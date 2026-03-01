<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $jsonPath = database_path('data/home.json');
        $jsonData = ['featuredProducts' => [], 'collections' => []];

        if (File::exists($jsonPath)) {
            try {
                $decoded = json_decode(File::get($jsonPath), true, 512, JSON_THROW_ON_ERROR);
                $jsonData = is_array($decoded) ? $decoded : $jsonData;
            } catch (\JsonException) {
            }
        }

        $featuredProducts = $this->getFeaturedProductsFromDatabase();

        $collections = $jsonData['collections'] ?? [];
        if (empty($collections)) {
            $collections = Brand::query()->orderBy('name')->get()->map(fn (Brand $brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => Str::slug($brand->name),
                'coverImage' => $brand->url ?? 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
                'description' => null,
                'featured' => false,
            ])->values()->all();
        }

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'collections' => $collections,
            'faqItems' => [
                [
                    'question' => 'Cuanto tarda el envio de una gorra Fortune?',
                    'answer' => 'Despachamos en 24 a 48 horas habiles. En ciudades principales, la entrega suele tardar entre 1 y 3 dias habiles.',
                ],
                [
                    'question' => 'Las gorras Fortune son unisex?',
                    'answer' => 'Si. Nuestros modelos estan disenados para un ajuste comodo en diferentes estilos y medidas.',
                ],
                [
                    'question' => 'Como cuido mi gorra para mantener su forma?',
                    'answer' => 'Limpia en seco o con pano humedo, evita lavadora y secadora, y guardala en un lugar fresco sin aplastar la visera.',
                ],
            ],
        ]);
    }

    /**
     * @return array<int, array{id: int, name: string, slug: string, price: float, currency: string, primaryImage: string, secondaryImage: string|null, isNew: bool}>
     */
    private function getFeaturedProductsFromDatabase(): array
    {
        $products = Product::query()
            ->where('is_featured', true)
            ->with('images:id,product_id,path,url')
            ->orderBy('name')
            ->limit(12)
            ->get();

        if ($products->isEmpty()) {
            return [];
        }

        return $products->map(function (Product $product): array {
            $images = $product->images;
            $first = $images->first();
            $second = $images->skip(1)->first();
            $primary = $first?->url ?: ($first ? '/storage/' . $first->path : '');
            $secondary = $second?->url ?: ($second ? '/storage/' . $second->path : null);

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
}

