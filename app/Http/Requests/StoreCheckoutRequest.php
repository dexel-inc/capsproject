<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'string', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'payment_method' => ['required', 'string', 'in:contra_entrega,transferencia'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_name' => 'nombre',
            'customer_email' => 'correo',
            'customer_phone' => 'celular',
            'address' => 'dirección',
            'city' => 'ciudad',
            'payment_method' => 'método de pago',
            'notes' => 'notas',
        ];
    }
}
