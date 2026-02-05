<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'New Era',
            'Nike',
            'Adidas',
            'Puma',
            'Under Armour',
            'Mitchell & Ness',
            '47 Brand',
        ];

        foreach ($names as $name) {
            Brand::firstOrCreate([
                'name' => $name,
            ]);
        }
    }
}
