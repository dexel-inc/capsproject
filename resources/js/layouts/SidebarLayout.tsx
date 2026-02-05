import type { PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar';

export default function SidebarLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 pt-16 md:pt-0">{children}</main>
            </div>
        </div>
    );
}
