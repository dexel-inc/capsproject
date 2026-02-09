import type { ReactNode } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type AppTitleProps = {
    title: string;
    subtitle?: string;
    as?: HeadingTag;
    rightContent?: ReactNode;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
};

export default function AppTitle({
                                     title,
                                     subtitle,
                                     as = 'h1',
                                     rightContent,
                                     className = '',
                                     titleClassName = '',
                                     subtitleClassName = '',
                                 }: AppTitleProps) {
    const Tag = as;

    return (
        <div className={`mb-4 flex items-start justify-between gap-3 ${className}`}>
            <div className="min-w-0">
                <Tag className={`text-2xl font-semibold text-zinc-900 ${titleClassName}`}>
                    {title}
                </Tag>

                {subtitle && (
                    <p className={`mt-1 text-sm text-zinc-500 ${subtitleClassName}`}>
                        {subtitle}
                    </p>
                )}
            </div>

            {rightContent && <div className="shrink-0">{rightContent}</div>}
        </div>
    );
}
