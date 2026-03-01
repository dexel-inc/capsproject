<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cart
    ) {}

    public function show(): Response|RedirectResponse
    {
        $items = $this->cart->getItems();
        if (empty($items)) {
            return redirect()->route('cart');
        }

        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $user = auth()->user();
        $defaults = [
            'customer_name' => $user?->name ?? '',
            'customer_email' => $user?->email ?? '',
            'customer_phone' => '',
            'address' => '',
            'city' => '',
            'payment_method' => 'contra_entrega',
            'notes' => '',
        ];

        return Inertia::render('checkout/Index', [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'defaults' => $defaults,
            'paymentMethods' => Order::paymentMethods(),
        ]);
    }

    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $items = $this->cart->getItems();
        if (empty($items)) {
            return redirect()->route('cart')->with('error', 'El carrito esta vacio.');
        }

        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        try {
            $order = DB::transaction(function () use ($request, $items, $subtotal): Order {
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'customer_name' => $request->validated('customer_name'),
                    'customer_email' => $request->validated('customer_email'),
                    'customer_phone' => $request->validated('customer_phone'),
                    'address' => $request->validated('address'),
                    'city' => $request->validated('city'),
                    'payment_method' => $request->validated('payment_method'),
                    'status' => 'pending',
                    'subtotal' => $subtotal,
                    'notes' => $request->validated('notes'),
                ]);

                foreach ($items as $item) {
                    $product = Product::query()->where('slug', $item['slug'])->lockForUpdate()->first();

                    if ($product !== null) {
                        $currentStock = is_numeric((string) $product->stock) ? (int) $product->stock : 0;
                        if ($currentStock < $item['quantity']) {
                            throw ValidationException::withMessages([
                                'cart' => "No hay stock suficiente para {$product->name}. Disponible: {$currentStock}.",
                            ]);
                        }

                        $product->stock = $currentStock - $item['quantity'];
                        $product->save();
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_slug' => $item['slug'],
                        'product_name' => $item['name'],
                        'price' => $item['price'],
                        'quantity' => $item['quantity'],
                    ]);
                }

                return $order;
            });
        } catch (ValidationException $exception) {
            return redirect()->back()->withErrors($exception->errors());
        }

        $this->cart->clear();

        return redirect()->route('checkout.thank-you', ['order' => $order->id]);
    }

    public function thankYou(Request $request): Response|RedirectResponse
    {
        $orderId = $request->integer('order');
        $order = Order::with('items')->find($orderId);

        if (! $order) {
            return redirect()->route('home');
        }

        return Inertia::render('checkout/ThankYou', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'payment_method' => $order->payment_method,
                'payment_method_label' => Order::paymentMethods()[$order->payment_method] ?? $order->payment_method,
                'subtotal' => (float) $order->subtotal,
                'items' => $order->items->map(fn ($i) => [
                    'product_name' => $i->product_name,
                    'quantity' => $i->quantity,
                    'price' => (float) $i->price,
                ])->all(),
            ],
        ]);
    }
}

