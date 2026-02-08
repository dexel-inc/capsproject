<?php

namespace App\Actions\Brands;

use App\Models\Brand;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoreBrandAction
{
    public function execute(array $data): Brand
    {
        $path = null;
        $url = null;

        if (($data['logo'] ?? null) instanceof UploadedFile) {
            $path = $data['logo']->store('brands', 'public');
            $url = Storage::disk('public')->url($path);
        }

        return Brand::create([
            'name' => $data['name'],
            'path' => $path,
            'url' => $url,
        ]);
    }
}
