import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

type Props = {
    order: {
        id: number;
        customer_name: string;
        customer_email: string;
        payment_method: string;
        payment_method_label: string;
        subtotal: number;
        items: { product_name: string; quantity: number; price: number }[];
    };
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CheckoutThankYou({ order }: Props) {
    return (
        <>
            <Head title="Pedido confirmado | Fortune" />
            <main className="mx-auto max-w-2xl px-4 py-16 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="mt-6 text-3xl font-bold text-neutral-900">¡Pedido confirmado!</h1>
                <p className="mt-2 text-neutral-600">
                    Gracias, {order.customer_name}. Tu pedido #{order.id} ha sido recibido.
                </p>
                <p className="mt-4 text-sm text-neutral-500">
                    Enviaremos los detalles y el estado del pedido a <strong>{order.customer_email}</strong>.
                </p>
                <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 text-left">
                    <h2 className="font-semibold text-neutral-900">Resumen</h2>
                    <ul className="mt-3 space-y-2 text-sm">
                        {order.items.map((item, i) => (
                            <li key={i} className="flex justify-between">
                                <span className="text-neutral-700">
                                    {item.product_name} × {item.quantity}
                                </span>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <p className="mt-3 text-sm text-neutral-500">
                        Pago: {order.payment_method_label}
                    </p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/catalog"
                        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                        Seguir comprando
                    </Link>
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
                    >
                        Ver mis pedidos
                    </Link>
                </div>
            </main>
        </>
    );
}
