<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        $customer = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $customer->roles()->attach(Role::where('name', 'customer')->first());
    }
}
