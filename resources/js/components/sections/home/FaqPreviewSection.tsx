import { Link } from '@inertiajs/react';

type FaqItem = {
    question: string;
    answer: string;
};

interface FaqPreviewSectionProps {
    items: FaqItem[];
}

export default function FaqPreviewSection({ items }: FaqPreviewSectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-white px-6 py-20" aria-label="Preguntas frecuentes">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Soporte</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                            Preguntas frecuentes
                        </h2>
                    </div>
                    <Link
                        href="/faq"
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                    >
                        Ver todas
                    </Link>
                </div>

                <div className="mt-8 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                    {items.slice(0, 3).map((item) => (
                        <article key={item.question} className="px-6 py-5 sm:px-8">
                            <h3 className="text-base font-semibold text-neutral-900">{item.question}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

