type ProductImage = {
    id: number;
    path: string;
    url?: string | null;
};

type Brand = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    sku?: string | null;
    price: number | string;
    stock?: string | null;
    brand?: Brand | null;
    images?: ProductImage[];
};

type Props = {
    product: Product;
};

export default function Show({ product }: Props) {
    const images = product.images ?? [];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900">{product.name}</h1>
                <p className="text-sm text-zinc-500">Detalle administrativo del producto</p>
            </div>

            <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-2">
                <div>
                    <p className="text-xs text-zinc-500">Marca</p>
                    <p className="text-sm font-medium text-zinc-900">{product.brand?.name ?? '—'}</p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">Precio</p>
                    <p className="text-sm font-medium text-zinc-900">${product.price}</p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">SKU</p>
                    <p className="text-sm font-medium text-zinc-900">{product.sku ?? '—'}</p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">Stock</p>
                    <p className="text-sm font-medium text-zinc-900">{product.stock ?? '—'}</p>
                </div>

                <div>
                    <p className="text-xs text-zinc-500">Slug</p>
                    <p className="text-sm font-medium text-zinc-900">{product.slug}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h2 className="mb-3 text-base font-semibold text-zinc-900">Imágenes</h2>

                {images.length === 0 ? (
                    <p className="text-sm text-zinc-500">Este producto no tiene imágenes.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {images.map((img) => {
                            const src =
                                img.url ||
                                (img.path.startsWith('http') || img.path.startsWith('/storage/')
                                    ? img.path
                                    : `/storage/${img.path}`);

                            return (
                                <img
                                    key={img.id}
                                    src={src}
                                    alt={`Imagen ${img.id}`}
                                    className="h-32 w-full rounded-xl border border-zinc-200 bg-zinc-50 object-cover"
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
