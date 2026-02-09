import { Head } from '@inertiajs/react';

import {
    CollectionsBentoGrid,
    FeaturedProductsCarousel,
    HeroSection,
    InfiniteMarquee,
    MinimalFooter,
} from '@/components/sections/home';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { WelcomeProps } from '@/types/home';

const META_DESCRIPTION =
    'Caps Project - Gorras premium de lujo. Nuevas colecciones, calidad excepcional. Descubre el streetwear que defines.';

export default function Welcome({ featuredProducts = [], collections = [] }: WelcomeProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <>
            <Head>
                <title>Caps Project | Luxury Streetwear Caps</title>
                <meta name="description" content={META_DESCRIPTION} />
                <meta property="og:title" content="Caps Project | Luxury Streetwear Caps" />
                <meta property="og:description" content={META_DESCRIPTION} />
                <meta property="og:type" content="website" />
            </Head>
            <main>
                <HeroSection prefersReducedMotion={prefersReducedMotion} />
                <InfiniteMarquee prefersReducedMotion={prefersReducedMotion} />
                <CollectionsBentoGrid collections={collections ?? []} prefersReducedMotion={prefersReducedMotion} />
                <FeaturedProductsCarousel products={featuredProducts ?? []} prefersReducedMotion={prefersReducedMotion} />
                <MinimalFooter prefersReducedMotion={prefersReducedMotion} />
            </main>
        </>
    );
}
