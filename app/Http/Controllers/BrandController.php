<?php

namespace App\Http\Controllers;

use App\Actions\StoreBrandAction;
use App\Http\Requests\StoreBrandRequest;
use App\Models\Brand;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(): \Inertia\Response
    {
        $brands = Brand::all();

        return Inertia::render('brands/Index', ['brands' => $brands]);
    }

    public function store(StoreBrandRequest $request, StoreBrandAction $action): void
    {
        $action->execute($request->validated());
    }
}
