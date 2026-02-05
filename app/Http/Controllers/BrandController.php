<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::all();

        return Inertia::render('brands/Index', ['brands' => $brands]);
    }

    public function store()
    {

    }
}
