import type { PropsWithChildren } from 'react';

import LandingHeader from '@/components/LandingHeader';

export default function LandingLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white text-neutral-900 antialiased">
            <LandingHeader />
            {children}
        </div>
    );
}
