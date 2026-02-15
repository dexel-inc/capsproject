import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User } from 'lucide-react';
import type { FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Registro" />

            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <img src="/fortunelogo.svg" alt="Fortune" className="h-12 w-auto" />
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 text-lg font-semibold text-zinc-900">Crear cuenta</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <AppInput
                            label="Nombre"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Tu nombre"
                            error={errors.name}
                            leftIcon={<User className="h-4 w-4" />}
                            required
                            autoComplete="name"
                        />

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
                            autoComplete="new-password"
                        />

                        <AppInput
                            label="Confirmar contraseña"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            leftIcon={<Lock className="h-4 w-4" />}
                            required
                            autoComplete="new-password"
                        />

                        <AppButton
                            type="submit"
                            fullWidth
                            loading={processing}
                            disabled={processing}
                        >
                            Registrarse
                        </AppButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-zinc-900 underline hover:no-underline"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
