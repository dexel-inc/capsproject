import type { InputHTMLAttributes, ReactNode} from 'react';
import { forwardRef, useId } from 'react';

type AppInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
};

const cx = (...classes: Array<string | undefined | null | false>) =>
    classes.filter(Boolean).join(' ');

const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
    (
        {
            id,
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            wrapperClassName,
            labelClassName,
            inputClassName,
            className,
            required,
            ...props
        },
        ref
    ) => {
        const autoId = useId();
        const inputId = id ?? `app-input-${autoId}`;

        const describedBy = [
            hint ? `${inputId}-hint` : null,
            error ? `${inputId}-error` : null,
        ]
            .filter(Boolean)
            .join(' ') || undefined;

        return (
            <div className={cx('w-full', wrapperClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cx(
                            'mb-1.5 block text-sm font-medium text-zinc-700',
                            labelClassName
                        )}
                    >
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error}
                        aria-describedby={describedBy}
                        className={cx(
                            'h-10 w-full rounded-xl border bg-white px-3 text-sm text-zinc-900',
                            'border-zinc-300 placeholder:text-zinc-400',
                            'focus:outline-none focus:ring-2 focus:ring-zinc-400',
                            'disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500',
                            leftIcon ? 'pl-10' : '',
                            rightIcon ? 'pr-10' : '',
                            error
                                ? 'border-red-500 focus:ring-red-300'
                                : 'border-zinc-300',
                            inputClassName,
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {!error && hint && (
                    <p id={`${inputId}-hint`} className="mt-1 text-xs text-zinc-500">
                        {hint}
                    </p>
                )}

                {error && (
                    <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

AppInput.displayName = 'AppInput';

export default AppInput;
