import { Head } from '@inertiajs/react';

export default function Cart() {
    return (
        <>
            <Head>
                <title>Carrito | Fortune</title>
            </Head>
            <main className="mx-auto max-w-7xl px-4 py-16">
                <h1 className="text-2xl font-bold text-neutral-900">Carrito</h1>
                <p className="mt-4 text-neutral-600">Tu carrito está vacío.</p>
            </main>
        </>
    );
}
