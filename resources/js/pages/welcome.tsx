import { Head } from '@inertiajs/react';

import {
    CatalogSection,
    FeaturedProductsCarousel,
    HeroSection,
    InfiniteMarquee,
    MinimalFooter,
} from '@/components/sections/home';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { WelcomeProps } from '@/types/home';

const META_DESCRIPTION =
    'Fortune - Piezas creadas para quienes entienden la elegancia discreta y la exclusividad real. Compra en Fortune, compra elegancia.';

export default function Welcome({ featuredProducts = [], collections = [] }: WelcomeProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <>
            <Head>
                <title>Fortune | Elegancia discreta y exclusividad real</title>
                <meta name="description" content={META_DESCRIPTION} />
                <meta property="og:title" content="Fortune | Elegancia discreta y exclusividad real" />
                <meta property="og:description" content={META_DESCRIPTION} />
                <meta property="og:type" content="website" />
            </Head>
            <main>
                <HeroSection prefersReducedMotion={prefersReducedMotion} />
                <InfiniteMarquee prefersReducedMotion={prefersReducedMotion} />
                <CatalogSection />
                <FeaturedProductsCarousel products={featuredProducts ?? []} prefersReducedMotion={prefersReducedMotion} />
                <MinimalFooter prefersReducedMotion={prefersReducedMotion} />
            </main>
        </>
    );
}
