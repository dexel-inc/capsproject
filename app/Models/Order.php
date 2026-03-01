<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'address',
        'city',
        'payment_method',
        'status',
        'subtotal',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $order): void {
            if (! empty($order->order_number)) {
                return;
            }

            $order->order_number = self::generateUniqueOrderNumber();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function paymentMethods(): array
    {
        return [
            'contra_entrega' => 'Contra entrega',
            'transferencia' => 'Transferencia bancaria',
        ];
    }

    public static function statuses(): array
    {
        return [
            'pending' => 'Pendiente',
            'paid' => 'Pagado',
            'shipped' => 'Enviado',
            'delivered' => 'Entregado',
            'cancelled' => 'Cancelado',
        ];
    }

    public static function generateUniqueOrderNumber(): string
    {
        do {
            $candidate = 'ORD' . now()->format('Ymd') . strtoupper(bin2hex(random_bytes(3)));
        } while (self::query()->where('order_number', $candidate)->exists());

        return $candidate;
    }
}

