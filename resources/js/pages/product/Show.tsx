import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatPrice } from '@/lib/formatPrice';
import type { ProductDetail } from '@/types/product';

interface ProductShowProps {
    product: ProductDetail;
}

const SITE_URL = (import.meta.env.VITE_APP_URL || 'https://fortunecaps.co').replace(/\/$/, '');

export default function ProductShow({ product }: ProductShowProps) {
    const [adding, setAdding] = useState(false);
    const [selectedImage, setSelectedImage] = useState(
        product.primaryImage ?? (product.images?.[0]) ?? ''
    );
    const images =
        product.images?.length > 0
            ? product.images
            : product.primaryImage
              ? [product.primaryImage]
              : [];

    const productSchema = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: images,
            description:
                product.description || 'Gorra premium Fortune con diseno minimalista y materiales de alta calidad.',
            sku: product.slug,
            brand: {
                '@type': 'Brand',
                name: 'Fortune',
            },
            offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/catalog/${product.slug}`,
                priceCurrency: product.currency,
                price: product.price,
                availability: 'https://schema.org/InStock',
            },
        }),
        [images, product.currency, product.description, product.name, product.price, product.slug]
    );

    const handleAddToCart = () => {
        setAdding(true);
        router.post('/cart', { slug: product.slug, quantity: 1 }, {
            preserveScroll: true,
            onFinish: () => setAdding(false),
        });
    };

    return (
        <>
            <Head>
                <title>{`${product.name} | Fortune`}</title>
                <meta
                    name="description"
                    content={`${product.name} en Fortune. Gorra premium con estilo elegante y minimalista.`}
                />
                <link rel="canonical" href={`${SITE_URL}/catalog/${product.slug}`} />
                {selectedImage && <meta property="og:image" content={selectedImage} />}
                <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            </Head>
            <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                <Link
                    href="/catalog"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Volver al catalogo
                </Link>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        {images.length > 1 && (
                            <div className="flex flex-row gap-2 sm:flex-col sm:gap-3">
                                {images.map((src) => (
                                    <button
                                        key={src}
                                        type="button"
                                        onClick={() => setSelectedImage(src)}
                                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:h-20 sm:w-20 ${
                                            selectedImage === src
                                                ? 'border-neutral-900 ring-1 ring-neutral-900'
                                                : 'border-transparent hover:border-neutral-300'
                                        }`}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-neutral-100">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {product.isNew && (
                                <span className="absolute left-4 top-4 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                                    Nuevo
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-semibold text-neutral-900">
                            {formatPrice({ price: product.price, currency: product.currency })}
                        </p>

                        {product.description && (
                            <div className="mt-6">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                                    Descripcion
                                </h2>
                                <p className="mt-2 text-neutral-600 leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {!product.description && (
                            <p className="mt-6 text-neutral-600">
                                Gorra premium de alta calidad. Diseno atemporal y materiales que garantizan durabilidad y
                                estilo.
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-60"
                            >
                                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                                {adding ? 'Agregando...' : 'Agregar al carrito'}
                            </button>
                            <Link
                                href="/account/wishlist"
                                className="inline-flex items-center justify-center rounded-full border-2 border-neutral-900 px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                            >
                                Agregar a favoritos
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

