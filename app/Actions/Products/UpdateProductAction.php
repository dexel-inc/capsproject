<?php

namespace App\Actions\Products;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateProductAction
{
    public function execute(Product $product, array $data): void
    {
        $product->brand_id = $data['brand_id'] ?? $product->brand_id;
        $product->name = $data['name'] ?? $product->name;
        $product->price = $data['price'] ?? $product->price;
        $product->slug = $data['slug'] ?? $product->slug;
        $product->sku = $data['sku'] ?? $product->sku;
        $product->stock = $data['stock'] ?? $product->stock;

        $product->save();

        if (isset($data['images']) && is_array($data['images']) && count($data['images']) > 0) {
            $this->replaceImages($product, $data['images']);
        }
    }

    private function replaceImages(Product $product, array $images): void
    {
        foreach ($product->images as $image) {
            if ($image->path) {
                Storage::disk('public')->delete($image->path);
            }
        }

        $product->images()->delete();

        foreach ($images as $image) {
            if (! $image instanceof UploadedFile) {
                continue;
            }

            $path = $image->store('products/images', 'public');

            $product->images()->create([
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
            ]);
        }
    }
}
