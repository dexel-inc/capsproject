<?php

declare(strict_types=1);

namespace Tests;

use App\Models\Role;
use App\Models\User;

trait CreatesAdminUser
{
    protected function createAdminUser(): User
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));

        return $admin;
    }

    protected function createCustomerUser(): User
    {
        $customer = User::factory()->create();
        $customer->roles()->attach(Role::firstOrCreate(['name' => 'customer']));

        return $customer;
    }
}
