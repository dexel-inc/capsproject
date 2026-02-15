<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

final class AccountController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('account/Index', [
            'user' => auth()->user(),
        ]);
    }

    public function orders(): Response
    {
        $user = auth()->user();
        $orders = $user
            ? Order::where('user_id', $user->id)
                ->with('items')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn (Order $order) => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'status_label' => Order::statuses()[$order->status] ?? $order->status,
                    'payment_method_label' => Order::paymentMethods()[$order->payment_method] ?? $order->payment_method,
                    'subtotal' => (float) $order->subtotal,
                    'created_at' => $order->created_at->toIso8601String(),
                    'items' => $order->items->map(fn ($i) => [
                        'product_name' => $i->product_name,
                        'quantity' => $i->quantity,
                        'price' => (float) $i->price,
                    ])->all(),
                ])
            : [];

        return Inertia::render('account/Orders', [
            'orders' => $orders,
        ]);
    }

    public function wishlist(): Response
    {
        return Inertia::render('account/Wishlist', [
            'items' => [],
        ]);
    }
}
