import { Head, Link } from '@inertiajs/react';
import { Package } from 'lucide-react';

type OrderItem = {
    product_name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    order_number: string | null;
    status: string;
    status_label: string;
    payment_method_label: string;
    subtotal: number;
    created_at: string;
    items: OrderItem[];
};

type Props = {
    orders: Order[];
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function formatDate(iso: string | null | undefined): string {
    if (iso == null || iso === '') return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    try {
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return String(iso);
    }
}

export default function AccountOrders({ orders }: Props) {
    return (
        <>
            <Head>
                <title>Mis pedidos | Fortune</title>
            </Head>
            <main className="mx-auto max-w-4xl px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Mis pedidos</h1>
                <p className="mt-2 text-neutral-600">
                    Historial de tus compras.
                </p>

                {orders.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-neutral-400" />
                        <p className="mt-4 text-neutral-600">Aún no tienes pedidos.</p>
                        <Link
                            href="/catalog"
                            className="mt-4 inline-block text-sm font-medium text-neutral-900 underline underline-offset-2 hover:no-underline"
                        >
                            Ir al catálogo
                        </Link>
                    </div>
                ) : (
                    <ul className="mt-8 space-y-4">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className="rounded-2xl border border-neutral-200 bg-white p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                <p className="font-semibold text-neutral-900">Pedido {order.order_number || `#${order.id}`}</p>
                                        <p className="text-sm text-neutral-500">{formatDate(order.created_at)}</p>
                                        <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                                            {order.status_label}
                                        </span>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {order.payment_method_label}
                                        </p>
                                    </div>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {formatPrice(order.subtotal)}
                                    </p>
                                </div>
                                <ul className="mt-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
                                    {order.items.map((item, i) => (
                                        <li key={i}>
                                            {item.product_name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </>
    );
}

