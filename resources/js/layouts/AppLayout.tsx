import type { PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-zinc-50 md:flex">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
    );
}
