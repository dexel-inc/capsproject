<?php

declare(strict_types=1);

namespace App\Actions\Users;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

final readonly class RegisterUserAction
{
    public function __construct(
        private array $data
    ) {}

    public function execute(): User
    {
        $user = User::create([
            'name' => $this->data['name'],
            'email' => $this->data['email'],
            'password' => Hash::make($this->data['password']),
        ]);

        $customerRole = Role::where('name', 'customer')->first();
        if ($customerRole) {
            $user->roles()->attach($customerRole);
        }

        return $user;
    }
}
