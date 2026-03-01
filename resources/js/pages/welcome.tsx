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

const SITE_URL = (import.meta.env.VITE_APP_URL || 'https://fortunecaps.co').replace(/\/$/, '');
const PAGE_URL = `${SITE_URL}/`;
const OG_IMAGE = `${SITE_URL}/fortunelogo.svg`;

const META_TITLE = 'Fortune | Gorras premium con elegancia minimalista';
const META_DESCRIPTION =
    'Fortune: gorras premium para hombre y mujer. Diseno minimalista, calidad superior y envios a toda Colombia.';

export default function Welcome({ featuredProducts = [], collections = [] }: WelcomeProps) {
    const prefersReducedMotion = useReducedMotion();

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Fortune',
        url: SITE_URL,
        logo: OG_IMAGE,
        sameAs: ['https://www.instagram.com/fortunecaps.co'],
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'hola@fortunecaps.co',
                areaServed: 'CO',
                availableLanguage: ['es'],
            },
        ],
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Fortune',
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/catalog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <>
            <Head>
                <title>{META_TITLE}</title>
                <meta name="description" content={META_DESCRIPTION} />
                <meta
                    name="keywords"
                    content="fortune, gorras fortune, gorras premium, gorras elegantes, tienda de gorras, gorras colombia"
                />
                <link rel="canonical" href={PAGE_URL} />

                <meta property="og:title" content={META_TITLE} />
                <meta property="og:description" content={META_DESCRIPTION} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:locale" content="es_CO" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={META_TITLE} />
                <meta name="twitter:description" content={META_DESCRIPTION} />
                <meta name="twitter:image" content={OG_IMAGE} />

                <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
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

