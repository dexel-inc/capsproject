import { useForm } from '@inertiajs/react';
import { Barcode, DollarSign, Hash, ImagePlus, Package2, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppTitle from '@/components/ui/AppTitle';

type Brand = {
    id: number;
    name: string;
};

type Props = {
    brands: Brand[];
};

type ProductForm = {
    brand_id: number | '';
    name: string;
    price: string;
    slug: string;
    sku: string;
    stock: string;
    images: File[];
};

type Preview = {
    id: string;
    url: string;
    name: string;
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export default function Create({ brands }: Props) {
    const [slugTouched, setSlugTouched] = useState(false);
    const [previews, setPreviews] = useState<Preview[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm<ProductForm>({
        brand_id: '',
        name: '',
        price: '',
        slug: '',
        sku: '',
        stock: '',
        images: [],
    });

    // Limpieza de URLs temporales al desmontar
    useEffect(() => {
        return () => {
            previews.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    // Autogenerar slug desde name (mientras no lo toque manualmente)
    useEffect(() => {
        if (!slugTouched) {
            setData('slug', slugify(data.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.name, slugTouched]);

    const onImagesChange = (files?: FileList | null) => {
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);
        const newPreviews: Preview[] = newFiles.map((file) => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setData('images', [...data.images, ...newFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const preview = previews[index];
        if (preview) URL.revokeObjectURL(preview.url);

        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const clearAllImages = () => {
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews([]);
        setData('images', []);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/products', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                clearAllImages();
                reset();
                setSlugTouched(false);
            },
        });
    };

    const imageFieldErrors = Object.entries(errors)
        .filter(([key]) => key.startsWith('images.'))
        .map(([, message]) => message);

    return (
        <div className="p-6">
            <AppTitle title="Crear producto" subtitle="Completa los datos del producto y agrega una o varias imágenes." />

            <form onSubmit={submit} className="mt-6 space-y-5">
                {/* Marca */}
                <div>
                    <label htmlFor="brand_id" className="mb-1 block text-sm font-medium text-zinc-700">
                        Marca <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Tag className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <select
                            id="brand_id"
                            name="brand_id"
                            value={data.brand_id}
                            onChange={(e) => setData('brand_id', e.target.value ? Number(e.target.value) : '')}
                            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pr-3 pl-10 text-sm text-zinc-900 transition outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                            required
                        >
                            <option value="">Selecciona una marca</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>}
                </div>

                {/* Nombre */}
                <AppInput
                    label="Nombre"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ej: Gorra Classic Negra"
                    error={errors.name}
                    leftIcon={<Package2 className="h-4 w-4" />}
                    required
                />

                {/* Precio y Stock */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppInput
                        label="Precio"
                        name="price"
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="Ej: 89900.00"
                        error={errors.price}
                        leftIcon={<DollarSign className="h-4 w-4" />}
                        required
                    />

                    <AppInput
                        label="Stock"
                        name="stock"
                        value={data.stock}
                        onChange={(e) => setData('stock', e.target.value)}
                        placeholder="Ej: 25"
                        error={errors.stock}
                        leftIcon={<Hash className="h-4 w-4" />}
                    />
                </div>

                {/* Slug y SKU */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AppInput
                        label="Slug"
                        name="slug"
                        value={data.slug}
                        onChange={(e) => {
                            setSlugTouched(true);
                            setData('slug', slugify(e.target.value));
                        }}
                        placeholder="ej-gorra-classic-negra"
                        error={errors.slug}
                        leftIcon={<Tag className="h-4 w-4" />}
                        required
                    />

                    <AppInput
                        label="SKU"
                        name="sku"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        placeholder="Ej: CAP-CLASSIC-NEG-BLK"
                        error={errors.sku}
                        leftIcon={<Barcode className="h-4 w-4" />}
                    />
                </div>

                {/* Imágenes múltiples */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Imágenes del producto</label>

                    <input
                        id="product-images"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            onImagesChange(e.target.files);
                            // reset del input para poder volver a subir el mismo archivo si lo quitó
                            e.currentTarget.value = '';
                        }}
                    />

                    <label
                        htmlFor="product-images"
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 transition hover:border-zinc-400 hover:bg-zinc-100"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600">
                            <ImagePlus className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-800">Subir imágenes</p>
                            <p className="text-xs text-zinc-500">Puedes seleccionar varias (PNG, JPG, WEBP - máx 2MB c/u)</p>
                        </div>
                    </label>

                    {/* Preview grid */}
                    {previews.length > 0 && (
                        <div className="mt-3">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs text-zinc-500">
                                    {previews.length} imagen{previews.length > 1 ? 'es' : ''} seleccionada{previews.length > 1 ? 's' : ''}
                                </p>
                                <button type="button" onClick={clearAllImages} className="text-xs text-red-600 hover:text-red-700">
                                    Quitar todas
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {previews.map((preview, idx) => (
                                    <div key={preview.id} className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
                                        <img src={preview.url} alt={preview.name} className="h-28 w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/75"
                                            aria-label={`Quitar ${preview.name}`}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        <p className="truncate px-2 py-1 text-[11px] text-zinc-500">{preview.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                    {imageFieldErrors.length > 0 && (
                        <ul className="mt-1 list-disc pl-5 text-sm text-red-600">
                            {imageFieldErrors.map((msg, i) => (
                                <li key={`${msg}-${i}`}>{msg}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 pt-2">
                    <AppButton type="button" variant="secondary" onClick={() => window.history.back()}>
                        Cancelar
                    </AppButton>

                    <AppButton type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar producto'}
                    </AppButton>
                </div>
            </form>
        </div>
    );
}
