import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import type { FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center justify-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-zinc-900 text-white">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-semibold text-zinc-900">Caps Project</h1>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-zinc-900">Iniciar sesión</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <AppInput
                            label="Correo electrónico"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu@email.com"
                            error={errors.email}
                            leftIcon={<Mail className="h-4 w-4" />}
                            required
                            autoComplete="email"
                        />

                        <AppInput
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            leftIcon={<Lock className="h-4 w-4" />}
                            required
                            autoComplete="current-password"
                        />

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
                            />
                            <span className="text-sm text-zinc-600">Recordarme</span>
                        </label>

                        <AppButton
                            type="submit"
                            fullWidth
                            loading={processing}
                            disabled={processing}
                        >
                            Entrar
                        </AppButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-600">
                        ¿No tienes cuenta?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-zinc-900 underline hover:no-underline"
                        >
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
