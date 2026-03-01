<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class PlaceholderController extends Controller
{
    public function faq(): Response
    {
        return Inertia::render('placeholder/Faq', ['title' => 'Preguntas Frecuentes']);
    }

    public function cart(): Response
    {
        return Inertia::render('placeholder/Cart', ['title' => 'Carrito']);
    }

    public function care(): Response
    {
        return Inertia::render('placeholder/Care', ['title' => 'Cuidado del Producto']);
    }
}
