<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_see_register_page(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('auth/Register'));
    }

    public function test_user_can_register(): void
    {
        $response = $this->post(route('register'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
        $this->assertAuthenticated();
    }

    public function test_register_validates_required_fields(): void
    {
        $response = $this->post(route('register'), []);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_register_validates_password_confirmation(): void
    {
        $response = $this->post(route('register'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ]);

        $response->assertSessionHasErrors(['password']);
    }

    public function test_register_validates_unique_email(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->post(route('register'), [
            'name' => 'Other User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors(['email']);
    }
}
