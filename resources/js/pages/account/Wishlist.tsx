import { Head } from '@inertiajs/react';

export default function AccountWishlist() {
    return (
        <>
            <Head>
                <title>Favoritos | Caps Project</title>
            </Head>
            <main className="mx-auto max-w-7xl px-4 py-16">
                <h1 className="text-2xl font-bold text-neutral-900">Favoritos</h1>
                <p className="mt-4 text-neutral-600">Próximamente: tu lista de favoritos.</p>
            </main>
        </>
    );
}
