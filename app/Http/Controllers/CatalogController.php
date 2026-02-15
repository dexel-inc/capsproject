<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

final class CatalogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $q = $request->string('q')->trim()->toString();

        $products = $this->getCatalogProducts($q);

        return Inertia::render('catalog/Index', [
            'products' => $products,
            'q' => $q,
        ]);
    }

    /**
     * @return array<int, array{id: int, name: string, slug: string, price: float, currency: string, primaryImage: string, secondaryImage: string|null, isNew: bool}>
     */
    private function getCatalogProducts(string $search): array
    {
        $fromDb = Product::query()
            ->with('images:id,product_id,path,url')
            ->orderBy('name');

        if ($search !== '') {
            $fromDb->where(function ($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%');
            });
        }

        $items = $fromDb->get();

        if ($items->isNotEmpty()) {
            return $items->map(function (Product $product) {
                $images = $product->images;
                $first = $images->first();
                $second = $images->skip(1)->first();
                $primary = $first?->url ?: ($first ? '/storage/'.$first->path : '');
                $secondary = $second?->url ?: ($second ? '/storage/'.$second->path : null);

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'currency' => 'COP',
                    'primaryImage' => $primary ?: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=640&q=80',
                    'secondaryImage' => $secondary,
                    'isNew' => false,
                ];
            })->values()->all();
        }

        $jsonPath = database_path('data/home.json');
        if (! File::exists($jsonPath)) {
            return [];
        }

        try {
            $decoded = json_decode(File::get($jsonPath), true, 512, JSON_THROW_ON_ERROR);
            $featured = $decoded['featuredProducts'] ?? [];
        } catch (\JsonException) {
            return [];
        }

        $list = array_values($featured);
        if ($search !== '') {
            $term = strtolower($search);
            $list = array_values(array_filter($list, function ($p) use ($term) {
                return str_contains(strtolower((string) ($p['name'] ?? '')), $term)
                    || str_contains(strtolower((string) ($p['slug'] ?? '')), $term);
            }));
        }

        return array_map(function ($p) {
            $images = $p['images'] ?? array_filter([$p['primaryImage'] ?? null, $p['secondaryImage'] ?? null]);
            if (empty($images) && ! empty($p['primaryImage'])) {
                $images = [$p['primaryImage']];
            }
            $primary = $images[0] ?? $p['primaryImage'] ?? '';
            $secondary = $images[1] ?? $p['secondaryImage'] ?? null;

            return [
                'id' => (int) ($p['id'] ?? 0),
                'name' => (string) ($p['name'] ?? ''),
                'slug' => (string) ($p['slug'] ?? ''),
                'price' => (float) ($p['price'] ?? 0),
                'currency' => $p['currency'] ?? 'COP',
                'primaryImage' => $primary,
                'secondaryImage' => $secondary,
                'isNew' => (bool) ($p['isNew'] ?? false),
            ];
        }, $list);
    }

    public function show(string $slug): Response|HttpResponse
    {
        $fromDb = Product::where('slug', $slug)->with('images:id,product_id,path,url')->first();

        if ($fromDb) {
            $images = $fromDb->images->map(fn ($img) => $img->url ?: '/storage/'.$img->path)->filter()->values()->all();
            $primary = $images[0] ?? '';

            return Inertia::render('product/Show', [
                'product' => [
                    'id' => $fromDb->id,
                    'name' => $fromDb->name,
                    'slug' => $fromDb->slug,
                    'price' => (float) $fromDb->price,
                    'currency' => 'COP',
                    'description' => '',
                    'images' => $images,
                    'primaryImage' => $primary,
                    'isNew' => false,
                ],
            ]);
        }

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
