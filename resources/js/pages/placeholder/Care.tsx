import { Head, Link } from '@inertiajs/react';

const tips = [
    {
        title: 'Limpieza puntual',
        description: 'Usa un pano suave apenas humedo con jabon neutro. Evita sumergir la gorra completa en agua.',
    },
    {
        title: 'Secado natural',
        description: 'Nunca uses secadora. Deja secar a la sombra sobre una superficie curva para conservar la forma.',
    },
    {
        title: 'Almacenamiento',
        description: 'Guarda la gorra en un lugar fresco y sin peso encima para proteger visera, corona y bordados.',
    },
    {
        title: 'Evita calor extremo',
        description: 'No la dejes en el carro o cerca de fuentes de calor para prevenir deformaciones y decoloracion.',
    },
];

export default function Care() {
    return (
        <>
            <Head>
                <title>Cuidado del Producto | Fortune</title>
                <meta
                    name="description"
                    content="Guia oficial de cuidado para gorras Fortune: limpieza, secado y almacenamiento para conservar forma y acabado premium."
                />
                <meta
                    name="keywords"
                    content="cuidado de gorras, como lavar gorras, mantenimiento de gorras, fortune gorras"
                />
            </Head>
            <main className="mx-auto max-w-6xl px-4 py-16">
                <header className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Fortune Care</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Cuidado del producto
                    </h1>
                    <p className="mt-4 leading-relaxed text-neutral-600">
                        Cada gorra Fortune esta creada para durar. Sigue estas recomendaciones para mantener su forma,
                        color y acabado premium por mas tiempo.
                    </p>
                </header>

                <section className="mt-10 grid gap-4 sm:grid-cols-2">
                    {tips.map((tip) => (
                        <article key={tip.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-neutral-900">{tip.title}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{tip.description}</p>
                        </article>
                    ))}
                </section>

                <section className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-neutral-900">Necesitas ayuda personalizada?</h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Escribenos para asesorarte con limpieza, horma y mantenimiento de tu referencia Fortune.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <a
                            href="mailto:hola@fortunecaps.co"
                            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                        >
                            Contactar por correo
                        </a>
                        <Link
                            href="/faq"
                            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-white"
                        >
                            Ver FAQ
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}

