import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6 text-[#1b1b18]">
            {children}
        </div>
    );
}
