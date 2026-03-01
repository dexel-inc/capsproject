import { Head } from '@inertiajs/react';

const faqs = [
    {
        question: 'Cuanto tarda el envio de las gorras Fortune?',
        answer: 'Despachamos en 24-48 horas habiles. En ciudades principales, la entrega tarda entre 1 y 3 dias habiles.',
    },
    {
        question: 'Como elijo la talla correcta?',
        answer: 'Todas nuestras gorras incluyen medida de circunferencia y ajuste recomendado. Si dudas entre dos tallas, elige la mayor para mejor comodidad.',
    },
    {
        question: 'Puedo cambiar o devolver mi pedido?',
        answer: 'Si. Tienes 5 dias calendario desde la entrega para solicitar cambios por talla o defectos de fabrica.',
    },
    {
        question: 'Que metodos de pago aceptan?',
        answer: 'Aceptamos contra entrega y transferencia bancaria. Muy pronto habilitaremos mas opciones de pago digital.',
    },
    {
        question: 'Las gorras son unisex?',
        answer: 'Si. Los modelos Fortune estan pensados para un uso unisex con hormas equilibradas y ajuste comodo.',
    },
];

export default function Faq() {
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <>
            <Head>
                <title>Preguntas Frecuentes | Fortune</title>
                <meta
                    name="description"
                    content="Resuelve tus dudas sobre gorras Fortune: envios, pagos, cambios, tallas y cuidado del producto."
                />
                <meta
                    name="keywords"
                    content="fortune, gorras fortune, preguntas frecuentes gorras, envio gorras, cambios gorras"
                />
                <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
            </Head>
            <main className="mx-auto max-w-5xl px-4 py-16">
                <header className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Ayuda</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                        Preguntas frecuentes
                    </h1>
                    <p className="mt-4 text-neutral-600">
                        Todo lo que necesitas saber antes de comprar tus gorras Fortune.
                    </p>
                </header>

                <section className="mt-10 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                    {faqs.map((item) => (
                        <article key={item.question} className="px-6 py-6 sm:px-8">
                            <h2 className="text-lg font-semibold text-neutral-900">{item.question}</h2>
                            <p className="mt-2 leading-relaxed text-neutral-600">{item.answer}</p>
                        </article>
                    ))}
                </section>
            </main>
        </>
    );
}

