<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
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
}
