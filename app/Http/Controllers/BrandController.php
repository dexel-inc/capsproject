<?php

namespace App\Http\Controllers;

use App\Actions\Brands\StoreBrandAction;
use App\Actions\Brands\UpdateBrandAction;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()
            ->withCount('products')
            ->get();

        return Inertia::render('brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function store(StoreBrandRequest $request, StoreBrandAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('brands.index');
    }

    public function update(UpdateBrandRequest $request, Brand $brand, UpdateBrandAction $action): RedirectResponse
    {
        $action->execute($brand, $request->validated());

        return redirect()->route('brands.index');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()->route('brands.index');
    }
}
