<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with('items')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'address' => $order->address,
                'city' => $order->city,
                'payment_method' => $order->payment_method,
                'payment_method_label' => Order::paymentMethods()[$order->payment_method] ?? $order->payment_method,
                'status' => $order->status,
                'status_label' => Order::statuses()[$order->status] ?? $order->status,
                'subtotal' => (float) $order->subtotal,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toIso8601String(),
                'items_count' => $order->items->count(),
            ]);

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'statuses' => Order::statuses(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items');

        return Inertia::render('admin/orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'address' => $order->address,
                'city' => $order->city,
                'payment_method' => $order->payment_method,
                'payment_method_label' => Order::paymentMethods()[$order->payment_method] ?? $order->payment_method,
                'status' => $order->status,
                'status_label' => Order::statuses()[$order->status] ?? $order->status,
                'subtotal' => (float) $order->subtotal,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toIso8601String(),
                'items' => $order->items->map(fn ($i) => [
                    'id' => $i->id,
                    'product_slug' => $i->product_slug,
                    'product_name' => $i->product_name,
                    'price' => (float) $i->price,
                    'quantity' => $i->quantity,
                ])->all(),
            ],
            'statuses' => Order::statuses(),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(Order::statuses()))],
        ]);

        $order->update(['status' => $request->input('status')]);

        return redirect()->back();
    }
}

