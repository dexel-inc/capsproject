<?php

namespace App\Actions\Products;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreProductAction
{
    public function execute(array $data): void
    {
        $product = Product::create([
            'brand_id' => $data['brand_id'],
            'name' => $data['name'],
            'price' => $data['price'],
            'slug' => $this->resolveUniqueSlug($data),
            'sku' => $data['sku'] ?? null,
            'stock' => $data['stock'] ?? null,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
        ]);

        $imagesPayload = collect($data['images'] ?? [])
            ->filter(fn ($file) => $file instanceof UploadedFile)
            ->map(function (UploadedFile $file) {
                $path = $file->store('products/images', 'public');

                return [
                    'path' => $path,
                    'url' => Storage::disk('public')->url($path),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->values()
            ->all();

        if (! empty($imagesPayload)) {
            $product->images()->createMany($imagesPayload);
        }
    }

    private function resolveUniqueSlug(array $data): string
    {
        $base = Str::slug($data['slug'] ?? $data['name']);
        $slug = $base;
        $i = 2;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
