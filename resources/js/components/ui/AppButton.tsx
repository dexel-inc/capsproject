import { Link } from '@inertiajs/react';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
    children: React.ReactNode;
    className?: string;
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
};

type RouteButtonProps = CommonProps & {
    href: string;
    external?: boolean;
    target?: string;
    rel?: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: Record<string, unknown>;
    preserveScroll?: boolean;
    preserveState?: boolean;
};

type ActionButtonProps = CommonProps & {
    href?: never;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
};

type AppButtonProps = RouteButtonProps | ActionButtonProps;

const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
const variants: Record<Variant, string> = {
    primary:
        'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-400',
    secondary:
        'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-300',
    ghost:
        'bg-transparent text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-300',
    danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
};
const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

function isRouteButton(props: AppButtonProps): props is RouteButtonProps {
    return 'href' in props && typeof props.href === 'string';
}

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}

export default function AppButton(props: AppButtonProps) {
    const {
        children,
        className,
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        leftIcon,
        rightIcon,
        fullWidth = false,
    } = props;

    const isDisabled = disabled || loading;

    const classes = cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
    );

    const content = (
        <>
            {loading ? <Spinner /> : leftIcon}
            <span>{children}</span>
            {!loading && rightIcon}
        </>
    );

    if (isRouteButton(props)) {
        if (isDisabled) {
            return (
                <span className={cn(classes, 'pointer-events-none')}>
                    {content}
                </span>
            );
        }

        const {
            href,
            external = false,
            target,
            rel,
            method = 'get',
            data,
            preserveScroll,
            preserveState,
        } = props;

        if (external) {
            return (
                <a
                    href={href}
                    target={target}
                    rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
                    className={classes}
                >
                    {content}
                </a>
            );
        }

        return (
            <Link
                href={href}
                method={method}
                data={data}
                preserveScroll={preserveScroll}
                preserveState={preserveState}
                className={classes}
            >
                {content}
            </Link>
        );
    }

    const { onClick, type = 'button' } = props;

    return (
        <button type={type} onClick={onClick} disabled={isDisabled} className={classes}>
            {content}
        </button>
    );
}
