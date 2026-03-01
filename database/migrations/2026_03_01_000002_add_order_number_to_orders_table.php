<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('order_number', 32)->nullable()->unique();
        });

        Order::query()
            ->whereNull('order_number')
            ->orderBy('id')
            ->each(function (Order $order): void {
                $order->order_number = Order::generateUniqueOrderNumber();
                $order->save();
            });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropUnique(['order_number']);
            $table->dropColumn('order_number');
        });
    }
};

