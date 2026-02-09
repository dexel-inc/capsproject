<?php

namespace App\Http\Controllers;

use App\Actions\Products\StoreProductAction;
use App\Actions\Products\UpdateProductAction;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

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

    public function show(Product $product): \Inertia\Response
    {
        $product->load([
            'brand:id,name',
            'images:id,product_id,path,url',
        ]);

        return Inertia::render('products/Show', [
            'product' => $product,
        ]);
    }
}
