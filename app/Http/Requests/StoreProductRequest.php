<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')],
            'stock' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['sometimes', 'boolean'],

            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'brand_id.required' => 'La marca es obligatoria.',
            'brand_id.exists' => 'La marca seleccionada no existe.',
            'name.required' => 'El nombre del producto es obligatorio.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser numerico.',
            'price.min' => 'El precio no puede ser negativo.',
            'stock.integer' => 'El stock debe ser numerico.',
            'stock.min' => 'El stock no puede ser negativo.',
            'slug.unique' => 'El slug ya esta en uso.',
            'sku.unique' => 'El SKU ya esta en uso.',
            'images.array' => 'Las imagenes deben enviarse como una lista.',
            'images.max' => 'Solo puedes subir hasta 10 imagenes.',
            'images.*.image' => 'Cada archivo debe ser una imagen valida.',
            'images.*.mimes' => 'Las imagenes deben ser JPG, JPEG, PNG, WEBP o SVG.',
            'images.*.max' => 'Cada imagen no puede superar 2MB.',
        ];
    }
}

