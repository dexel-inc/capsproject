import { Link } from '@inertiajs/react';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const HERO_HEADLINE = 'Compra en FORTUNE compra elegancia';
const HERO_SUBHEADLINE = 'Piezas creadas para quienes entienden la elegancia discreta y la exclusividad real';
const HERO_IMAGE = '/gorra.svg';

interface HeroSectionProps {
    prefersReducedMotion: boolean;
}

export default function HeroSection({ prefersReducedMotion }: HeroSectionProps) {
    const [imageError, setImageError] = useState(false);
    const ctaRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (prefersReducedMotion || !ctaRef.current) return;
            const rect = ctaRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
            ctaRef.current.style.transform = `translate(${x}px, ${y}px)`;
        },
        [prefersReducedMotion]
    );

    const handleMouseLeave = useCallback(() => {
        if (ctaRef.current) {
            ctaRef.current.style.transform = 'translate(0, 0)';
        }
    }, []);

    return (
        <section className="relative flex min-h-[85vh] w-full overflow-hidden bg-neutral-100 lg:min-h-[90vh]" aria-label="Hero">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center lg:flex-row lg:items-center lg:justify-between">
                <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 text-center lg:py-24 lg:text-left">
                    <h1 className="mb-5 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl">
                        {HERO_HEADLINE}
                    </h1>

                    <p className="mb-8 max-w-md text-base text-neutral-600 sm:text-lg lg:mb-10">{HERO_SUBHEADLINE}</p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                        <Link
                            ref={ctaRef}
                            href="/catalog"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                        >
                            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                            Comprar Ahora
                        </Link>
                        <Link
                            href="/catalog"
                            className="group inline-flex items-center gap-2 rounded-full border-2 border-neutral-900 px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                        >
                            Explorar Colección
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="relative flex w-full flex-1 items-center justify-center p-6 lg:min-h-[85vh]">
                    <div className="relative flex aspect-square max-h-[320px] w-full max-w-md items-center justify-center sm:max-h-[400px] lg:max-h-[520px] lg:max-w-xl">
                        {!imageError ? (
                            <img
                                src={HERO_IMAGE}
                                alt="Gorra premium Fortune"
                                className="relative h-full w-full object-contain object-center"
                                onError={() => setImageError(true)}
                                loading="eager"
                                fetchPriority="high"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-2xl">
                                <div className="h-32 w-32 rounded-full bg-neutral-300" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
