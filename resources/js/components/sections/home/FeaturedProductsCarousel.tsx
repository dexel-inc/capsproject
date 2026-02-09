import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { formatPrice } from '@/lib/formatPrice';
import type { Product } from '@/types/home';

interface FeaturedProductsCarouselProps {
    products: Product[];
    prefersReducedMotion: boolean;
}

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef(0);
    const scrollStartRef = useRef(0);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [updateScrollState, products.length]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        dragStartRef.current = e.clientX;
        scrollStartRef.current = scrollRef.current.scrollLeft;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !scrollRef.current) return;
        const diff = dragStartRef.current - e.clientX;
        scrollRef.current.scrollLeft = scrollStartRef.current + diff;
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (!isDragging) return;
        const handler = () => handlePointerUp();
        window.addEventListener('pointerup', handler);
        window.addEventListener('pointercancel', handler);
        return () => {
            window.removeEventListener('pointerup', handler);
            window.removeEventListener('pointercancel', handler);
        };
    }, [isDragging]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scroll('left');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scroll('right');
        }
    };

    if (products.length === 0) {
        return (
            <section className="bg-neutral-50 px-6 py-24" aria-label="Productos destacados">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Productos Destacados
                    </h2>
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white">
                        <p className="text-neutral-500">No hay productos destacados por el momento.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-neutral-50 px-6 py-24" aria-label="Productos destacados">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                    Productos Destacados
                </h2>
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto scroll-smooth py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{ scrollSnapType: 'x mandatory' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        role="region"
                        aria-label="Carrusel de productos"
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="min-w-[280px] max-w-[280px] shrink-0 sm:min-w-[320px] sm:max-w-[320px]"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                <Link
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
                                        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
                                        <p className="mt-1 text-neutral-600">{formatPrice(product)}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="rounded-full border border-neutral-300 bg-white p-2 text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
