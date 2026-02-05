<?php

namespace App\Actions;

use App\Models\Brand;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateBrandAction
{
    public function execute(Brand $brand, array $data): void
    {
        $brand->name = $data['name'] ?? $brand->name;

        if (($logo = $data['logo'] ?? null) instanceof UploadedFile) {
            $this->replaceLogo($brand, $logo);
        }

        $brand->save();
    }

    private function replaceLogo(Brand $brand, UploadedFile $logo): void
    {
        if ($brand->path) {
            Storage::disk('public')->delete($brand->path);
        }

        $path = $logo->store('brands/logos', 'public');

        $brand->path = $path;
        $brand->url = Storage::disk('public')->url($path);
    }
}
