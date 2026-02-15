import { useForm } from '@inertiajs/react';
import { Lock, Mail, User, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';

type AuthMode = 'login' | 'register';

type Props = {
    open: boolean;
    mode: AuthMode;
    onClose: () => void;
    onSwitchMode: (mode: AuthMode) => void;
    errors: Record<string, string | string[]> | undefined;
    authOldInput?: Record<string, unknown>;
};

function getError(errors: Record<string, string | string[]> | undefined, key: string): string | undefined {
    if (!errors || !errors[key]) return undefined;
    const v = errors[key];
    return Array.isArray(v) ? v[0] : (v as string);
}

export default function AuthModal({ open, mode, onClose, onSwitchMode, errors, authOldInput }: Props) {
    const loginForm = useForm({
        email: (authOldInput?.email as string) ?? '',
        password: '',
        remember: !!(authOldInput?.remember as boolean),
    });

    const registerForm = useForm({
        name: (authOldInput?.name as string) ?? '',
        email: (authOldInput?.email as string) ?? '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (!authOldInput || !open) return;
        if (mode === 'login') {
            if (authOldInput.email != null) loginForm.setData('email', String(authOldInput.email));
            if (authOldInput.remember != null) loginForm.setData('remember', !!authOldInput.remember);
        } else {
            if (authOldInput.name != null) registerForm.setData('name', String(authOldInput.name));
            if (authOldInput.email != null) registerForm.setData('email', String(authOldInput.email));
        }
        // Only run when modal opens with server-sent old input
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authOldInput, mode, open]);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        loginForm.post('/login', { preserveScroll: true });
    };

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        registerForm.post('/register', { preserveScroll: true });
    };

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/50 transition-opacity"
                aria-label="Cerrar"
            />
            <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>

                {mode === 'login' ? (
                    <>
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <img src="/fortunelogo.svg" alt="Fortune" className="h-10 w-auto" />
                            <h2 className="text-xl font-semibold text-neutral-900">Iniciar sesión</h2>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <AppInput
                                label="Correo electrónico"
                                type="email"
                                name="email"
                                value={loginForm.data.email}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                placeholder="tu@email.com"
                                error={getError(errors, 'email')}
                                leftIcon={<Mail className="h-4 w-4" />}
                                required
                                autoComplete="email"
                            />
                            <AppInput
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={loginForm.data.password}
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                error={getError(errors, 'password')}
                                leftIcon={<Lock className="h-4 w-4" />}
                                required
                                autoComplete="current-password"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
                                />
                                <span className="text-sm text-neutral-600">Recordarme</span>
                            </label>
                            <AppButton
                                type="submit"
                                fullWidth
                                loading={loginForm.processing}
                                disabled={loginForm.processing}
                            >
                                Entrar
                            </AppButton>
                        </form>
                        <p className="mt-6 text-center text-sm text-neutral-600">
                            ¿No tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => onSwitchMode('register')}
                                className="font-medium text-neutral-900 underline hover:no-underline"
                            >
                                Regístrate
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <img src="/fortunelogo.svg" alt="Fortune" className="h-10 w-auto" />
                            <h2 className="text-xl font-semibold text-neutral-900">Crear cuenta</h2>
                        </div>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <AppInput
                                label="Nombre"
                                type="text"
                                name="name"
                                value={registerForm.data.name}
                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                placeholder="Tu nombre"
                                error={getError(errors, 'name')}
                                leftIcon={<User className="h-4 w-4" />}
                                required
                                autoComplete="name"
                            />
                            <AppInput
                                label="Correo electrónico"
                                type="email"
                                name="email"
                                value={registerForm.data.email}
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                placeholder="tu@email.com"
                                error={getError(errors, 'email')}
                                leftIcon={<Mail className="h-4 w-4" />}
                                required
                                autoComplete="email"
                            />
                            <AppInput
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={registerForm.data.password}
                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                error={getError(errors, 'password')}
                                leftIcon={<Lock className="h-4 w-4" />}
                                required
                                autoComplete="new-password"
                            />
                            <AppInput
                                label="Confirmar contraseña"
                                type="password"
                                name="password_confirmation"
                                value={registerForm.data.password_confirmation}
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                error={getError(errors, 'password_confirmation')}
                                leftIcon={<Lock className="h-4 w-4" />}
                                required
                                autoComplete="new-password"
                            />
                            <AppButton
                                type="submit"
                                fullWidth
                                loading={registerForm.processing}
                                disabled={registerForm.processing}
                            >
                                Registrarse
                            </AppButton>
                        </form>
                        <p className="mt-6 text-center text-sm text-neutral-600">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => onSwitchMode('login')}
                                className="font-medium text-neutral-900 underline hover:no-underline"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
