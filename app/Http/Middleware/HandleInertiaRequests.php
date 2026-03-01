<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $cartService = app(CartService::class);
        $cartItems = $cartService->getItems();
        $cartCount = $cartService->count();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'flash' => [
                'cartAdded' => $request->session()->get('cartAdded'),
                'auth_modal' => $request->session()->get('auth_modal'),
                'auth_old_input' => $request->session()->get('_old_input'),
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'is_admin' => $user->isAdmin(),
                ] : null,
            ],
            'cart' => [
                'count' => $cartCount,
                'items' => $cartItems,
            ],
        ];
    }
}
