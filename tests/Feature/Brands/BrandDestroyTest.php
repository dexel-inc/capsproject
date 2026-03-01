<?php

declare(strict_types=1);

namespace Tests\Feature\Brands;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesAdminUser;
use Tests\TestCase;

final class BrandDestroyTest extends TestCase
{
    use CreatesAdminUser;
    use RefreshDatabase;

    public function test_guest_cannot_destroy_brand(): void
    {
        $brand = Brand::factory()->create();

        $response = $this->delete(route('brands.destroy', $brand));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('brands', ['id' => $brand->id]);
    }

    public function test_admin_can_destroy_brand(): void
    {
        $admin = $this->createAdminUser();
        $brand = Brand::factory()->create();

        $response = $this->actingAs($admin)->delete(route('brands.destroy', $brand));

        $response->assertRedirect(route('brands.index'));
        $this->assertDatabaseMissing('brands', ['id' => $brand->id]);
    }

    public function test_admin_cannot_destroy_brand_with_products(): void
    {
        $admin = $this->createAdminUser();
        $brand = Brand::factory()->create();

        Product::query()->create([
            'brand_id' => $brand->id,
            'name' => 'Gorra Test',
            'price' => 100000,
            'slug' => 'gorra-test',
            'stock' => 10,
        ]);

        $response = $this->actingAs($admin)->delete(route('brands.destroy', $brand));

        $response->assertRedirect(route('brands.index'));
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('brands', ['id' => $brand->id]);
    }
}
