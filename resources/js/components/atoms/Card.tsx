import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren & {
    className?: string;
};

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div
            className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}
