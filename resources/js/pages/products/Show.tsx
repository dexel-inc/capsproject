import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

import AppButton from '@/components/ui/AppButton';
import AppTitle from '@/components/ui/AppTitle';

type ProductImage = {
    id: number;
    path: string;
    url?: string | null;
};

type Product = {
    id: number;
    name: string;
    price: number | string;
    slug: string;
    sku?: string | null;
    stock?: string | null;
    brand?: { id: number; name: string };
    images?: ProductImage[];
};

type Props = {
    product: Product;
};

function imageUrl(img: ProductImage): string {
    if (img.url) return img.url;
    if (img.path.startsWith('http')) return img.path;
    if (img.path.startsWith('/storage/')) return img.path;
    return `/storage/${img.path}`;
}

export default function Show({ product }: Props) {
    const images = product.images ?? [];
    const primaryImage = images[0];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <AppTitle title={product.name} subtitle="Detalle del producto" />
                <div className="flex gap-2">
                    <AppButton href="/products" variant="secondary">
                        Volver
                    </AppButton>
                    <AppButton href={`/products/${product.id}/edit`}>
                        <span className="flex items-center gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar
                        </span>
                    </AppButton>
                </div>
            </div>

            <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 md:grid-cols-2">
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-700">Imágenes</h3>
                    {images.length === 0 ? (
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                            Sin imágenes
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100">
                                <img
                                    src={imageUrl(primaryImage)}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.slice(1).map((img) => (
                                        <div
                                            key={img.id}
                                            className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200"
                                        >
                                            <img src={imageUrl(img)} alt="" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-500">Marca</h3>
                        <p className="text-zinc-900">{product.brand?.name ?? '—'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-500">Precio</h3>
                        <p className="text-lg font-semibold text-zinc-900">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                maximumFractionDigits: 0,
                            }).format(Number(product.price ?? 0))}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-500">Slug</h3>
                        <p className="font-mono text-sm text-zinc-700">{product.slug}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-500">SKU</h3>
                        <p className="text-zinc-700">{product.sku || '—'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-500">Stock</h3>
                        <p className="text-zinc-700">{product.stock ?? '—'}</p>
                    </div>
                    <div>
                        <Link
                            href={`/catalog/${product.slug}`}
                            className="text-sm text-zinc-600 underline hover:text-zinc-900"
                        >
                            Ver en catálogo público →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
