<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            return redirect()->route('cart')->with('error', 'El carrito está vacío.');
        }

        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

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
            OrderItem::create([
                'order_id' => $order->id,
                'product_slug' => $item['slug'],
                'product_name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
            ]);
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
