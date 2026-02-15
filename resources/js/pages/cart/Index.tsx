import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';


export type CartItem = {
    slug: string;
    quantity: number;
    name: string;
    price: number;
    currency: string;
    image: string;
};

type Props = {
    items: CartItem[];
    subtotal: number;
};

function formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CartIndex({ items, subtotal }: Props) {
    const updateQuantity = (slug: string, quantity: number) => {
        if (quantity < 1) {
            router.delete('/cart', { data: { slug } });
            return;
        }
        router.put('/cart', { slug, quantity });
    };

    const remove = (slug: string) => {
        router.delete('/cart', { data: { slug } });
    };

    return (
        <>
            <Head title="Carrito | Fortune" />
            <main className="mx-auto max-w-4xl px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Carrito</h1>

                {items.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center">
                        <ShoppingBag className="mx-auto h-12 w-12 text-neutral-400" />
                        <p className="mt-4 text-neutral-600">Tu carrito está vacío.</p>
                        <Link
                            href="/catalog"
                            className="mt-4 inline-block text-sm font-medium text-neutral-900 underline underline-offset-2 hover:no-underline"
                        >
                            Ir al catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li
                                    key={item.slug}
                                    className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
                                >
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-28 sm:w-28">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-semibold text-neutral-900">{item.name}</h2>
                                        <p className="mt-0.5 text-lg font-semibold text-neutral-900">
                                            {formatPrice(item.price, item.currency)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center rounded-lg border border-neutral-300">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                                                aria-label="Disminuir cantidad"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(item.slug)}
                                            className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                                            aria-label="Quitar del carrito"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="text-right font-semibold text-neutral-900 sm:min-w-[6rem]">
                                        {formatPrice(item.price * item.quantity, item.currency)}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="rounded-xl border border-neutral-200 bg-white p-6">
                            <div className="flex items-center justify-between text-lg">
                                <span className="font-medium text-neutral-600">Subtotal</span>
                                <span className="font-bold text-neutral-900">
                                    {formatPrice(subtotal, items[0]?.currency ?? 'COP')}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-neutral-500">
                                Los costos de envío se calculan al completar el pedido.
                            </p>
                            <Link
                                href="/checkout"
                                className="mt-6 inline-block w-full rounded-xl bg-neutral-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-neutral-800 sm:w-auto"
                            >
                                Completar pedido
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
