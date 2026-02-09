<?php

declare(strict_types=1);

namespace Tests\Feature\Brands;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class BrandIndexTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_access_brands_index(): void
    {
        $response = $this->get(route('brands.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_customer_cannot_access_brands_index(): void
    {
        $customer = $this->createCustomerUser();

        $response = $this->actingAs($customer)->get(route('brands.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_access_brands_index(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->get(route('brands.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('brands/Index')
            ->has('brands')
        );
    }
}
