<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cart
    ) {}

    public function index(): Response
    {
        $items = $this->cart->getItems();
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        return Inertia::render('cart/Index', [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => ['required', 'string', 'max:255'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:99'],
        ]);

        $this->cart->add(
            $request->input('slug'),
            (int) $request->input('quantity', 1)
        );

        return redirect()->back()->with('cartAdded', true);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $this->cart->update(
            $request->input('slug'),
            (int) $request->input('quantity')
        );

        return redirect()->back();
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => ['required', 'string', 'max:255'],
        ]);

        $this->cart->remove($request->input('slug'));

        return redirect()->back();
    }
}
