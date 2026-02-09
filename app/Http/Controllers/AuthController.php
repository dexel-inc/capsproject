<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Users\LoginUserAction;
use App\Actions\Users\RegisterUserAction;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('auth/Login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $action = new LoginUserAction($request->validated());
        $user = $action->execute();

        $request->session()->regenerate();

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.users.index'));
        }

        return redirect()->intended(route('home'));
    }

    public function logout(Request $request): RedirectResponse
    {
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function showRegister(): Response
    {
        return Inertia::render('auth/Register');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $action = new RegisterUserAction($request->validated());
        $user = $action->execute();

        auth()->login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }
}
