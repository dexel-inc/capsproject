import { X } from 'lucide-react';
import type { ReactNode} from 'react';
import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type AppModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    className?: string;
    contentClassName?: string;
};

const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
};

function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(' ');
}

export default function AppModal({
                                     open,
                                     onClose,
                                     title,
                                     description,
                                     children,
                                     footer,
                                     size = 'md',
                                     closeOnOverlayClick = true,
                                     showCloseButton = true,
                                     className,
                                     contentClassName,
                                 }: AppModalProps) {
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => {
                    if (closeOnOverlayClick) onClose();
                }}
                aria-hidden="true"
            />

            {/* Container */}
            <div className="relative flex min-h-full items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    aria-describedby={description ? descriptionId : undefined}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                        'w-full rounded-2xl border border-zinc-200 bg-white shadow-xl',
                        'dark:border-zinc-800 dark:bg-zinc-900',
                        sizeClasses[size],
                        className
                    )}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                            <div>
                                {title && (
                                    <h2 id={titleId} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p id={descriptionId} className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {showCloseButton && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className={cn('px-5 py-4', contentClassName)}>{children}</div>

                    {footer && (
                        <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
