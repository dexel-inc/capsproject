<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PlaceholderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/catalog', CatalogController::class)->name('catalog');
Route::get('/catalog/{slug}', [CatalogController::class, 'show'])->name('product.show');
Route::get('/faq', [PlaceholderController::class, 'faq'])->name('faq');
Route::get('/care', [PlaceholderController::class, 'care'])->name('care');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/thank-you', [CheckoutController::class, 'thankYou'])->name('checkout.thank-you');

Route::middleware('auth')->prefix('account')->name('account.')->group(function (): void {
    Route::get('/', [AccountController::class, 'index'])->name('index');
    Route::patch('/profile', [AccountController::class, 'updateProfile'])->name('profile.update');
    Route::patch('/password', [AccountController::class, 'updatePassword'])->name('password.update');
    Route::get('/orders', [AccountController::class, 'orders'])->name('orders');
    Route::get('/wishlist', [AccountController::class, 'wishlist'])->name('wishlist');
});

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::resource('brands', BrandController::class)->middleware(['auth', 'admin']);
Route::resource('products', ProductController::class)->middleware(['auth', 'admin']);

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function (): void {
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
});
