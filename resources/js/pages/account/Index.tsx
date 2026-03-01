import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';

type User = {
    id: number;
    name: string;
    email: string;
};

type PageProps = {
    user: User;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function AccountIndex({ user }: { user: User }) {
    const page = usePage<PageProps>();
    const flash = page.props.flash ?? {};

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e: FormEvent) => {
        e.preventDefault();
        profileForm.patch('/account/profile', {
            preserveScroll: true,
        });
    };

    const submitPassword = (e: FormEvent) => {
        e.preventDefault();
        passwordForm.patch('/account/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset('current_password', 'password', 'password_confirmation');
            },
        });
    };

    return (
        <>
            <Head>
                <title>Mi cuenta | Fortune</title>
            </Head>
            <main className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Mi cuenta</h1>
                    <p className="mt-2 text-neutral-600">Administra tu perfil y seguridad.</p>
                </header>

                {(flash.success || flash.error) && (
                    <div
                        className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                            flash.error
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }`}
                    >
                        {flash.error ?? flash.success}
                    </div>
                )}

                <div className="mt-8 grid gap-6">
                    <section className="grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/account/orders"
                            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            <h2 className="text-base font-semibold text-neutral-900">Mis pedidos</h2>
                            <p className="mt-1 text-sm text-neutral-500">Consulta estado e historial de compras.</p>
                        </Link>
                        <Link
                            href="/account/wishlist"
                            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            <h2 className="text-base font-semibold text-neutral-900">Favoritos</h2>
                            <p className="mt-1 text-sm text-neutral-500">Revisa tus productos guardados.</p>
                        </Link>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-neutral-900">Informacion del perfil</h2>
                        <p className="mt-1 text-sm text-neutral-500">Actualiza tu nombre y correo de acceso.</p>

                        <form onSubmit={submitProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
                            <AppInput
                                label="Nombre"
                                name="name"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                error={profileForm.errors.name}
                                required
                            />
                            <AppInput
                                label="Correo"
                                name="email"
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                error={profileForm.errors.email}
                                required
                            />

                            <div className="sm:col-span-2 flex justify-end">
                                <AppButton type="submit" loading={profileForm.processing} disabled={profileForm.processing}>
                                    Guardar cambios
                                </AppButton>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-neutral-900">Seguridad</h2>
                        <p className="mt-1 text-sm text-neutral-500">Cambia tu contrasena para proteger tu cuenta.</p>

                        <form onSubmit={submitPassword} className="mt-5 grid gap-4">
                            <AppInput
                                label="Contrasena actual"
                                name="current_password"
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                error={passwordForm.errors.current_password}
                                required
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <AppInput
                                    label="Nueva contrasena"
                                    name="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    error={passwordForm.errors.password}
                                    required
                                />
                                <AppInput
                                    label="Confirmar nueva contrasena"
                                    name="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    error={passwordForm.errors.password_confirmation}
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <AppButton type="submit" loading={passwordForm.processing} disabled={passwordForm.processing}>
                                    Actualizar contrasena
                                </AppButton>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
