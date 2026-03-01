<?php

declare(strict_types=1);

namespace Tests\Feature\Checkout;

use App\Models\Brand;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CheckoutStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_decreases_stock_and_generates_alphanumeric_order_number(): void
    {
        $brand = Brand::factory()->create();

        $product = Product::query()->create([
            'brand_id' => $brand->id,
            'name' => 'Gorra Fortune Test',
            'price' => 90000,
            'slug' => 'gorra-fortune-test',
            'stock' => 5,
            'is_featured' => true,
        ]);

        session([
            'cart' => [
                ['slug' => $product->slug, 'quantity' => 2],
            ],
        ]);

        $response = $this->post(route('checkout.store'), [
            'customer_name' => 'Cliente Test',
            'customer_email' => 'cliente@example.com',
            'customer_phone' => '3000000000',
            'address' => 'Calle 123',
            'city' => 'Bogota',
            'payment_method' => 'contra_entrega',
            'notes' => null,
        ]);

        $order = Order::query()->first();

        $response->assertRedirect(route('checkout.thank-you', ['order' => $order?->id]));
        $this->assertNotNull($order);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]+$/', (string) $order->order_number);

        $product->refresh();
        $this->assertSame(3, (int) $product->stock);
    }

    public function test_it_rejects_checkout_when_stock_is_insufficient(): void
    {
        $brand = Brand::factory()->create();

        $product = Product::query()->create([
            'brand_id' => $brand->id,
            'name' => 'Gorra Stock Bajo',
            'price' => 80000,
            'slug' => 'gorra-stock-bajo',
            'stock' => 1,
        ]);

        session([
            'cart' => [
                ['slug' => $product->slug, 'quantity' => 2],
            ],
        ]);

        $response = $this->from(route('checkout'))->post(route('checkout.store'), [
            'customer_name' => 'Cliente Test',
            'customer_email' => 'cliente@example.com',
            'customer_phone' => '3000000000',
            'address' => 'Calle 123',
            'city' => 'Bogota',
            'payment_method' => 'contra_entrega',
            'notes' => null,
        ]);

        $response->assertRedirect(route('checkout'));
        $response->assertSessionHasErrors('cart');

        $product->refresh();
        $this->assertSame(1, (int) $product->stock);
        $this->assertDatabaseCount('orders', 0);
    }
}

