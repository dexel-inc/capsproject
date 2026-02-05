<?php

namespace App\Actions;

use App\Models\Brand;

class StoreBrandAction
{
    public function execute(array $data): void
    {
        Brand::create([
            'name' => $data['name'],
        ]);
    }
}
