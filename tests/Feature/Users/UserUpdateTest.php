<?php

declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class UserUpdateTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'password' => '',
            'role' => 'customer',
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_customer_cannot_update_user(): void
    {
        $customer = $this->createCustomerUser();
        $user = User::factory()->create();

        $response = $this->actingAs($customer)->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'password' => '',
            'role' => 'customer',
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_update_user(): void
    {
        $admin = $this->createAdminUser();
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'password' => '',
            'role' => 'admin',
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_update_validates_required_fields(): void
    {
        $admin = $this->createAdminUser();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), []);

        $response->assertSessionHasErrors(['name', 'email', 'role']);
    }

    public function test_update_validates_unique_email_except_current(): void
    {
        $admin = $this->createAdminUser();
        $user = User::factory()->create(['email' => 'user@example.com']);
        User::factory()->create(['email' => 'other@example.com']);

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => 'other@example.com',
            'password' => '',
            'role' => 'customer',
        ]);

        $response->assertSessionHasErrors(['email']);
    }
}
