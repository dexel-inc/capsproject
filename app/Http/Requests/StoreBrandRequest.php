<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $brandId = $this->route('brand')?->id ?? $this->route('brand');

        return [
            'name' => ['required', 'string', 'max:255'],
            'path' => [
                'nullable',
                'string',
                'max:255',
                'required_with:url',
                'regex:/^[A-Za-z0-9_\-\/\.]+$/',
                Rule::unique('brands', 'path')->ignore($brandId),
            ],
            'url' => [
                'nullable',
                'string',
                'max:2048',
                'required_with:path',
                'url:http,https',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'path.required_with' => 'El campo path es obligatorio cuando se envía url.',
            'url.required_with' => 'El campo url es obligatorio cuando se envía path.',
            'path.unique' => 'Ya existe una marca con ese path.',
            'url.url' => 'La URL debe tener un formato válido (http o https).',
            'path.regex' => 'El path contiene caracteres no permitidos.',
        ];
    }
}
