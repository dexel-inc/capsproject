<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255', 'unique:brands,name'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'path' => ['nullable', 'string', 'max:255', 'unique:brands,path'],
            'url' => ['nullable', 'url', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser un texto válido.',
            'name.max' => 'El nombre no puede superar los :max caracteres.',
            'name.unique' => 'Ya existe una marca con ese nombre.',

            'logo.image' => 'El archivo debe ser una imagen válida.',
            'logo.mimes' => 'El logo debe ser de tipo: JPG, JPEG, PNG o WEBP.',
            'logo.max' => 'El logo no puede superar los 2MB.',

            'path.string' => 'La ruta del logo debe ser un texto válido.',
            'path.max' => 'La ruta del logo no puede superar los :max caracteres.',
            'path.unique' => 'Ya existe una marca con esa ruta de logo.',

            'url.url' => 'La URL del logo debe tener un formato válido.',
            'url.max' => 'La URL del logo no puede superar los :max caracteres.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'logo' => 'logo',
            'path' => 'ruta',
            'url' => 'URL',
        ];
    }
}
