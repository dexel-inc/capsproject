<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\File;

final class CartService
{
    private const SESSION_KEY = 'cart';

    public function getItems(): array
    {
        $rows = session(self::SESSION_KEY, []);
        $items = [];

        foreach ($rows as $row) {
            $slug = $row['slug'] ?? null;
            $quantity = (int) ($row['quantity'] ?? 1);
            if (! $slug || $quantity < 1) {
                continue;
            }

            $product = $this->resolveProductBySlug($slug);
            if ($product) {
                $items[] = [
                    'slug' => $slug,
                    'quantity' => $quantity,
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'currency' => $product['currency'] ?? 'COP',
                    'image' => $product['image'],
                ];
            }
        }

        return $items;
    }

    public function add(string $slug, int $quantity = 1): void
    {
        $product = $this->resolveProductBySlug($slug);
        if (! $product) {
            return;
        }

        $cart = session(self::SESSION_KEY, []);
        $found = false;

        foreach ($cart as &$row) {
            if (($row['slug'] ?? '') === $slug) {
                $row['quantity'] = (int) ($row['quantity'] ?? 0) + $quantity;
                $found = true;
                break;
            }
        }

        if (! $found) {
            $cart[] = ['slug' => $slug, 'quantity' => $quantity];
        }

        session([self::SESSION_KEY => $cart]);
    }

    public function update(string $slug, int $quantity): bool
    {
        if ($quantity < 1) {
            return $this->remove($slug);
        }

        $cart = session(self::SESSION_KEY, []);
        foreach ($cart as &$row) {
            if (($row['slug'] ?? '') === $slug) {
                $row['quantity'] = $quantity;
                session([self::SESSION_KEY => $cart]);

                return true;
            }
        }

        return false;
    }

    public function remove(string $slug): bool
    {
        $cart = session(self::SESSION_KEY, []);
        $newCart = array_values(array_filter($cart, fn ($row) => ($row['slug'] ?? '') !== $slug));
        session([self::SESSION_KEY => $newCart]);

        return true;
    }

    public function count(): int
    {
        $cart = session(self::SESSION_KEY, []);
        $total = 0;
        foreach ($cart as $row) {
            $total += (int) ($row['quantity'] ?? 0);
        }

        return $total;
    }

    public function clear(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    /**
     * @return array{name: string, price: float|int, currency: string, image: string}|null
     */
    private function resolveProductBySlug(string $slug): ?array
    {
        $fromDb = Product::where('slug', $slug)->with('images')->first();
        if ($fromDb) {
            $firstImage = $fromDb->images->first();
            $image = $firstImage?->url ?: ($firstImage ? '/storage/'.$firstImage->path : '');

            return [
                'name' => $fromDb->name,
                'price' => (float) $fromDb->price,
                'currency' => 'COP',
                'image' => $image ?: '',
            ];
        }

        $jsonPath = database_path('data/home.json');
        if (! File::exists($jsonPath)) {
            return null;
        }

        try {
            $decoded = json_decode(File::get($jsonPath), true, 512, JSON_THROW_ON_ERROR);
            $products = $decoded['featuredProducts'] ?? [];
        } catch (\JsonException) {
            return null;
        }

        $product = collect($products)->firstWhere('slug', $slug);
        if (! $product) {
            return null;
        }

        $image = $product['primaryImage'] ?? $product['images'][0] ?? '';

        return [
            'name' => $product['name'],
            'price' => (float) ($product['price'] ?? 0),
            'currency' => $product['currency'] ?? 'COP',
            'image' => $image,
        ];
    }
}
