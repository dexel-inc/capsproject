import { useRef, useState } from 'react';
import { m } from 'framer-motion';

import { useReducedMotion } from '@/hooks/useReducedMotion';

const MARQUEE_PHRASES = ['NEW DROPS', 'PREMIUM QUALITY', 'LIMITED EDITION', 'FREE SHIPPING'];

function MarqueeContent({ phrases }: { phrases: string[] }) {
    return (
        <>
            {phrases.map((phrase, i) => (
                <span key={i} className="mx-10 shrink-0 text-xl font-bold uppercase tracking-[0.25em] text-neutral-500 sm:text-2xl md:text-3xl">
                    {phrase}
                </span>
            ))}
        </>
    );
}

interface InfiniteMarqueeProps {
    prefersReducedMotion: boolean;
}

export default function InfiniteMarquee({ prefersReducedMotion }: InfiniteMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const baseDuration = 25;
    const duration = prefersReducedMotion ? 0 : baseDuration;

    return (
        <section
            className="relative overflow-hidden border-y border-neutral-200 bg-white py-5"
            aria-label="Novedades y mensajes"
            onMouseEnter={() => !prefersReducedMotion && setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
            <m.div
                ref={containerRef}
                className="flex w-max select-none"
                animate={duration > 0 && !isPaused ? { x: [0, '-50%'] } : {}}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration,
                        ease: 'linear',
                    },
                }}
            >
                <div className="flex">
                    <MarqueeContent phrases={MARQUEE_PHRASES} />
                </div>
                <div className="flex" aria-hidden="true">
                    <MarqueeContent phrases={MARQUEE_PHRASES} />
                </div>
            </m.div>
        </section>
    );
}
