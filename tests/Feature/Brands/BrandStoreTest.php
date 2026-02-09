<?php

declare(strict_types=1);

namespace Tests\Feature\Brands;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class BrandStoreTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_store_brand(): void
    {
        $response = $this->post(route('brands.store'), [
            'name' => 'New Brand',
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_store_brand(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->post(route('brands.store'), [
            'name' => 'New Brand',
        ]);

        $response->assertRedirect(route('brands.index'));
        $this->assertDatabaseHas('brands', ['name' => 'New Brand']);
    }

    public function test_store_validates_required_name(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->post(route('brands.store'), []);

        $response->assertSessionHasErrors(['name']);
    }
}
