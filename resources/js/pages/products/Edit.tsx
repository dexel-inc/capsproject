import { useForm } from '@inertiajs/react';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppTitle from '@/components/ui/AppTitle';

type Brand = {
    id: number;
    name: string;
};

type ProductImage = {
    id: number;
    path: string;
    url?: string | null;
};

type Product = {
    id: number;
    brand_id: number;
    name: string;
    price: number | string;
    slug: string;
    sku?: string | null;
    stock?: string | number | null;
    is_featured?: boolean;
    images?: ProductImage[];
};

type Props = {
    product: Product;
    brands?: Brand[];
};

type FormData = {
    _method: 'put';
    brand_id: number | '';
    name: string;
    price: string;
    slug: string;
    sku: string;
    stock: string;
    is_featured: boolean;
    images: File[];
    deleted_image_ids: number[];
};

export default function Edit({ product, brands = [] }: Props) {
    const initialImages = useMemo(() => product.images ?? [], [product.images]);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        _method: 'put',
        brand_id: product.brand_id ?? '',
        name: product.name ?? '',
        price: String(product.price ?? ''),
        slug: product.slug ?? '',
        sku: product.sku ?? '',
        stock: product.stock ? String(product.stock) : '',
        is_featured: Boolean(product.is_featured),
        images: [],
        deleted_image_ids: [],
    });

    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImagePreviews]);

    const handleNewImagesChange = (filesList: FileList | null) => {
        // Limpia previews anteriores
        newImagePreviews.forEach((url) => URL.revokeObjectURL(url));

        const files = filesList ? Array.from(filesList) : [];
        setData('images', files);
        setNewImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const removeNewImageAt = (index: number) => {
        const nextFiles = [...data.images];
        const nextPreviews = [...newImagePreviews];

        const removedPreview = nextPreviews[index];
        if (removedPreview) URL.revokeObjectURL(removedPreview);

        nextFiles.splice(index, 1);
        nextPreviews.splice(index, 1);

        setData('images', nextFiles);
        setNewImagePreviews(nextPreviews);
    };

    const toggleDeleteExistingImage = (imageId: number) => {
        const exists = data.deleted_image_ids.includes(imageId);

        if (exists) {
            setData(
                'deleted_image_ids',
                data.deleted_image_ids.filter((id) => id !== imageId),
            );
        } else {
            setData('deleted_image_ids', [...data.deleted_image_ids, imageId]);
        }
    };

    const imageSrc = (img: ProductImage) => {
        if (img.url) return img.url;
        if (img.path.startsWith('http')) return img.path;
        if (img.path.startsWith('/storage/')) return img.path;
        return `/storage/${img.path}`;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/products/${product.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <AppTitle title="Editar producto" subtitle="Actualiza la información e imágenes del producto" />
                <AppButton href="/products" variant="secondary">
                    Volver
                </AppButton>
            </div>

            <form onSubmit={submit} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5">
                {/* Brand */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Marca</label>
                    <select
                        name="brand_id"
                        value={data.brand_id}
                        onChange={(e) => setData('brand_id', Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                        required
                    >
                        <option value="">Selecciona una marca</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>}
                </div>

                {/* Name / Slug */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppInput
                        label="Nombre"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej: Gorra Classic Black"
                        error={errors.name}
                        required
                    />

                    <AppInput
                        label="Slug"
                        name="slug"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        placeholder="ej: gorra-classic-black"
                        error={errors.slug}
                        required
                    />
                </div>

                {/* Price / SKU / Stock */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <AppInput
                        label="Precio"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="0.00"
                        error={errors.price}
                        required
                    />

                    <AppInput
                        label="SKU"
                        name="sku"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        placeholder="Opcional"
                        error={errors.sku}
                    />

                    <AppInput
                        label="Stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={data.stock}
                        onChange={(e) => setData('stock', e.target.value)}
                        placeholder="Opcional"
                        error={errors.stock}
                    />
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                    <input
                        type="checkbox"
                        checked={data.is_featured}
                        onChange={(e) => setData('is_featured', e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                    />
                    <span className="text-sm text-zinc-700">Mostrar en productos destacados</span>
                </label>

                {/* Existing images */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Imágenes actuales</label>

                    {initialImages.length === 0 ? (
                        <p className="text-sm text-zinc-500">Este producto no tiene imágenes registradas.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {initialImages.map((img) => {
                                const marked = data.deleted_image_ids.includes(img.id);

                                return (
                                    <div
                                        key={img.id}
                                        className={[
                                            'relative overflow-hidden rounded-xl border',
                                            marked ? 'border-red-300 opacity-60' : 'border-zinc-200',
                                        ].join(' ')}
                                    >
                                        <img src={imageSrc(img)} alt="Imagen actual del producto" className="h-28 w-full object-cover" />

                                        <button
                                            type="button"
                                            onClick={() => toggleDeleteExistingImage(img.id)}
                                            className={[
                                                'absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium',
                                                marked ? 'bg-zinc-900 text-white' : 'bg-white/95 text-red-600 hover:bg-white',
                                            ].join(' ')}
                                        >
                                            {marked ? 'Deshacer' : 'Eliminar'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {errors.deleted_image_ids && <p className="mt-1 text-sm text-red-600">{errors.deleted_image_ids}</p>}
                </div>

                {/* New images */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Agregar nuevas imágenes</label>

                    <input
                        id="product-images"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => handleNewImagesChange(e.target.files)}
                    />

                    <label
                        htmlFor="product-images"
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 transition hover:border-zinc-400 hover:bg-zinc-100"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600">
                            <ImagePlus className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-800">Seleccionar imágenes</p>
                            <p className="text-xs text-zinc-500">Puedes cargar múltiples imágenes (JPG, PNG, WEBP)</p>
                        </div>
                    </label>

                    {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}

                    {newImagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {newImagePreviews.map((src, index) => (
                                <div key={`${src}-${index}`} className="relative overflow-hidden rounded-xl border border-zinc-200">
                                    <img src={src} alt={`Nueva imagen ${index + 1}`} className="h-28 w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImageAt(index)}
                                        className="absolute top-2 right-2 rounded-full bg-white/95 p-1 text-red-600 hover:bg-white"
                                        aria-label="Quitar imagen"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <AppButton type="button" href="/products" variant="secondary">
                        Cancelar
                    </AppButton>
                    <AppButton type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Actualizar producto'}
                    </AppButton>
                </div>
            </form>
        </div>
    );
}
