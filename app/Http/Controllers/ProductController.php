<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

final class ProductController extends Controller
{
    public function show(string $slug): Response|HttpResponse
    {
        $jsonPath = database_path('data/home.json');
        $products = [];

        if (File::exists($jsonPath)) {
            try {
                $decoded = json_decode(File::get($jsonPath), true, 512, JSON_THROW_ON_ERROR);
                $products = $decoded['featuredProducts'] ?? [];
            } catch (\JsonException) {
            }
        }

        $product = collect($products)->firstWhere('slug', $slug);

        if (! $product) {
            abort(404);
        }

        $images = $product['images'] ?? array_filter([
            $product['primaryImage'] ?? null,
            $product['secondaryImage'] ?? null,
        ]);

        if (empty($images) && ! empty($product['primaryImage'])) {
            $images = [$product['primaryImage']];
        }

        return Inertia::render('product/Show', [
            'product' => [
                'id' => $product['id'],
                'name' => $product['name'],
                'slug' => $product['slug'],
                'price' => $product['price'],
                'currency' => $product['currency'] ?? 'COP',
                'description' => $product['description'] ?? '',
                'images' => array_values($images),
                'primaryImage' => $images[0] ?? null,
                'isNew' => $product['isNew'] ?? false,
            ],
        ]);
    }
}
