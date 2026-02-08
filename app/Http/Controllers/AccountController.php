<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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
        return Inertia::render('account/Orders', [
            'orders' => [],
        ]);
    }

    public function wishlist(): Response
    {
        return Inertia::render('account/Wishlist', [
            'items' => [],
        ]);
    }
}
