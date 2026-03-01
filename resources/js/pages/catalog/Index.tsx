import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

import { formatPrice } from '@/lib/formatPrice';
import type { Product } from '@/types/home';

interface CatalogIndexProps {
    products: Product[];
    q: string;
}

const SITE_URL = (import.meta.env.VITE_APP_URL || 'https://fortunecaps.co').replace(/\/$/, '');

export default function CatalogIndex() {
    const { products = [], q: initialQ = '' } = usePage().props as CatalogIndexProps;
    const [searchQuery, setSearchQuery] = useState(initialQ);

    const pageTitle = initialQ
        ? `Catalogo de gorras: ${initialQ} | Fortune`
        : 'Catalogo de gorras premium | Fortune';

    const description = initialQ
        ? `Resultados para ${initialQ} en Fortune. Explora gorras premium con estilo minimalista y envio nacional.`
        : 'Descubre el catalogo completo de gorras Fortune: premium, urbanas, minimalistas y de edicion especial.';

    const canonical = initialQ
        ? `${SITE_URL}/catalog?q=${encodeURIComponent(initialQ)}`
        : `${SITE_URL}/catalog`;

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            router.get('/catalog', searchQuery.trim() ? { q: searchQuery.trim() } : {});
        },
        [searchQuery]
    );

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content="gorras, gorras premium, catalogo gorras, fortune" />
                <link rel="canonical" href={canonical} />
            </Head>
            <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Catalogo</h1>
                <p className="mt-2 text-neutral-600">Todos nuestros productos de marca.</p>

                <form onSubmit={handleSearch} className="relative mt-8 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar en el catalogo"
                        className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                        aria-label="Buscar productos"
                    />
                </form>

                {products.length === 0 ? (
                    <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 py-20 text-center">
                        <p className="text-neutral-500">
                            {initialQ ? 'No hay productos que coincidan con tu busqueda.' : 'Aun no hay productos en el catalogo.'}
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/catalog/${product.slug}`}
                                className="group block focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
                                    <img
                                        src={product.primaryImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                                        loading="lazy"
                                        width={320}
                                        height={427}
                                    />
                                    {product.secondaryImage ? (
                                        <img
                                            src={product.secondaryImage}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            loading="lazy"
                                            width={320}
                                            height={427}
                                        />
                                    ) : (
                                        <img
                                            src={product.primaryImage}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {product.isNew && (
                                        <span className="absolute left-4 top-4 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                                            Nuevo
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h2 className="font-semibold text-neutral-900">{product.name}</h2>
                                    <p className="mt-1 text-neutral-600">{formatPrice(product)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}

