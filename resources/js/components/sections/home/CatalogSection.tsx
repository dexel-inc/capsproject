import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CatalogSection() {
    return (
        <section className="bg-white px-6 py-24" aria-label="Catálogo">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-20 text-center sm:px-12 md:py-28">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Nuestro catálogo
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
                            Descubre toda la colección de gorras de nuestra marca. Calidad y estilo en cada diseño.
                        </p>
                        <Link
                            href="/catalog"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                        >
                            Ver catálogo
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </div>
                    <div
                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&q=60')] bg-cover bg-center opacity-20"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </section>
    );
}
