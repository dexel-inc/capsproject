<?php

declare(strict_types=1);

namespace Tests\Feature\Users;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class UserIndexTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_access_users_index(): void
    {
        $response = $this->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_customer_cannot_access_users_index(): void
    {
        $customer = $this->createCustomerUser();

        $response = $this->actingAs($customer)->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_access_users_index(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users/Index')
            ->has('users')
        );
    }
}
