<?php

declare(strict_types=1);

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

final readonly class LoginUserAction
{
    public function __construct(
        private array $credentials
    ) {}

    public function execute(): User
    {
        if (! Auth::attempt($this->credentials, request()->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        request()->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }
}
