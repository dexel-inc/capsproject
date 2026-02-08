<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Support\Facades\File;
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

        $featuredProducts = $jsonData['featuredProducts'] ?? [];
        $collections = $jsonData['collections'] ?? [];

        if (empty($collections)) {
            $collections = Brand::all()->map(fn (Brand $brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => \Illuminate\Support\Str::slug($brand->name),
                'coverImage' => $brand->url ?? 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
                'description' => null,
                'featured' => false,
            ])->values()->all();
        }

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'collections' => $collections,
        ]);
    }
}
