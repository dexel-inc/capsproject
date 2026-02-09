<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class LoginTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_can_see_login_page(): void
    {
        $response = $this->get(route('login'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/Login'));
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $response = $this->post(route('login'), [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticated();
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post(route('login'), [
            'email' => 'user@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_authenticated_user_redirected_from_login(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->get(route('login'));

        $response->assertRedirect(route('home'));
    }
}
