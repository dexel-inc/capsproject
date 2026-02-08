<?php

declare(strict_types=1);

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class UserDestroyTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_destroy_user(): void
    {
        $user = User::factory()->create();

        $response = $this->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_customer_cannot_destroy_user(): void
    {
        $customer = $this->createCustomerUser();
        $user = User::factory()->create();

        $response = $this->actingAs($customer)->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_admin_can_destroy_user(): void
    {
        $admin = $this->createAdminUser();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
