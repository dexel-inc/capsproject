import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import type { Collection } from '@/types/home';

interface CollectionsBentoGridProps {
    collections: Collection[];
    prefersReducedMotion: boolean;
}

export default function CollectionsBentoGrid({ collections }: CollectionsBentoGridProps) {
    if (collections.length === 0) {
        return (
            <section className="bg-white px-6 py-24" aria-label="Colecciones">
                <div className="mx-auto max-w-7xl">
                    <p className="text-center text-neutral-500">Próximamente nuevas colecciones.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white px-6 py-24" aria-label="Colecciones">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                    Colecciones
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-4">
                    {collections.slice(0, 5).map((collection, index) => (
                        <div
                            key={collection.id}
                            className={`group relative overflow-hidden rounded-xl ${
                                index === 0
                                    ? 'aspect-[4/3] md:col-span-1 md:row-span-2 md:aspect-auto'
                                    : 'aspect-[4/3] md:col-span-1'
                            }`}
                        >
                            <Link
                                href={`/catalog?collection=${collection.slug}`}
                                className="block h-full w-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                            >
                                <img
                                    src={collection.coverImage}
                                    alt={collection.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-neutral-900/20 transition-opacity duration-300 group-hover:bg-neutral-900/30" aria-hidden="true" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-900">
                                        Ver colección
                                    </span>
                                    <ArrowRight className="h-5 w-5 text-neutral-900" aria-hidden="true" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                    <h3 className="text-xl font-semibold text-white drop-shadow sm:text-2xl">{collection.name}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
