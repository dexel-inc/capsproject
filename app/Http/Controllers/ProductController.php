<?php

namespace App\Http\Controllers;

use App\Actions\Products\StoreProductAction;
use App\Actions\Products\UpdateProductAction;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ProductController extends Controller
{
    public function index(): \Inertia\Response
    {
        $products = Product::all();

        return Inertia::render('products/Index', ['products' => $products]);
    }

    public function create(): \Inertia\Response
    {
        $brands = Brand::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('products/Create', ['brands' => $brands]);
    }

    public function store(StoreProductRequest $request, StoreProductAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('products.index');
    }

    public function edit(Product $product): \Inertia\Response
    {
        $product->load('images');

        return Inertia::render('products/Edit', [
            'product' => $product,
            'brands' => Brand::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateProductRequest $request, UpdateProductAction $action, Product $product): RedirectResponse
    {
        $action->execute($product, $request->validated());

        return redirect()->back();
    }

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
