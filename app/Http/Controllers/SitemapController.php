<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Response;

final class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $baseUrl = rtrim((string) config('app.url', url('/')), '/');

        $staticUrls = [
            '/',
            '/catalog',
            '/faq',
            '/care',
        ];

        $entries = collect($staticUrls)->map(fn (string $path): array => [
            'loc' => $baseUrl . $path,
            'lastmod' => now()->toDateString(),
            'changefreq' => $path === '/' ? 'daily' : 'weekly',
            'priority' => $path === '/' ? '1.0' : '0.7',
        ]);

        $products = Product::query()->orderByDesc('updated_at')->get(['slug', 'updated_at']);
        foreach ($products as $product) {
            $entries->push([
                'loc' => $baseUrl . '/catalog/' . $product->slug,
                'lastmod' => optional($product->updated_at)->toDateString() ?? now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ]);
        }

        $xml = view('sitemap', [
            'entries' => $entries,
        ])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}

