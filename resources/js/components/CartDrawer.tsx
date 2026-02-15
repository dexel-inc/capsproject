import { Link, router, usePage } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

type CartItem = {
    slug: string;
    quantity: number;
    name: string;
    price: number;
    currency: string;
    image: string;
};

type Cart = {
    count: number;
    items: CartItem[];
};

type Props = {
    open: boolean;
    onClose: () => void;
};

function formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CartDrawer({ open, onClose }: Props) {
    const { props } = usePage();
    const cart = (props.cart ?? { count: 0, items: [] }) as Cart;
    const { items } = cart;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updateQuantity = (slug: string, quantity: number) => {
        if (quantity < 1) {
            router.delete('/cart', { data: { slug }, preserveScroll: true });
            return;
        }
        router.put('/cart', { slug, quantity }, { preserveScroll: true });
    };

    const remove = (slug: string) => {
        router.delete('/cart', { data: { slug } }, { preserveScroll: true });
    };

    return (
        <>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Carrito"
                className={`fixed inset-0 z-50 transition-opacity duration-200 ${
                    open ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40"
                    aria-label="Cerrar"
                />
                <div
                    className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-200 ease-out ${
                        open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                        <h2 className="text-lg font-semibold text-neutral-900">Carrito ({cart.count})</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                            aria-label="Cerrar carrito"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingBag className="h-12 w-12 text-neutral-300" />
                                <p className="mt-3 text-sm text-neutral-500">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {items.map((item) => (
                                    <li key={item.slug} className="flex gap-3">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-900">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {formatPrice(item.price, item.currency)} c/u
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex items-center rounded-md border border-neutral-300">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(item.slug)}
                                                    className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                                                    aria-label="Quitar del carrito"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="shrink-0 text-sm font-semibold text-neutral-900">
                                            {formatPrice(item.price * item.quantity, item.currency)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-neutral-200 p-4">
                            <div className="mb-3 flex justify-between text-sm">
                                <span className="text-neutral-600">Subtotal</span>
                                <span className="font-semibold text-neutral-900">
                                    {formatPrice(subtotal, items[0]?.currency ?? 'COP')}
                                </span>
                            </div>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="block w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                            >
                                Ir al carrito
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
