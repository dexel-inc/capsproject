<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class LogoutTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_logout(): void
    {
        $response = $this->post(route('logout'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_logout(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->post(route('logout'));

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
