import { Head, Link } from '@inertiajs/react';
import { Package, Eye } from 'lucide-react';

import AppTitle from '@/components/ui/AppTitle';

type Order = {
    id: number;
    order_number: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    address: string;
    city: string | null;
    payment_method: string;
    payment_method_label: string;
    status: string;
    status_label: string;
    subtotal: number;
    notes: string | null;
    created_at: string | null;
    items_count: number;
};

type Props = {
    orders: Order[];
    statuses: Record<string, string>;
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
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersIndex({ orders }: Props) {
    return (
        <>
            <Head title="Órdenes | Admin" />
            <div className="space-y-4 p-6">
                <AppTitle title="Órdenes" subtitle="Gestiona los pedidos de la tienda." />

                {orders.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-12 text-center">
                        <Package className="mx-auto h-12 w-12 text-zinc-400" />
                        <p className="mt-4 text-zinc-600">No hay órdenes aún.</p>
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                        <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Pedido / Cliente
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Pago
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50/50">
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-medium text-zinc-900">{order.order_number || `#${order.id}`}</p>
                                                <p className="text-sm text-zinc-600">{order.customer_name}</p>
                                                <p className="text-xs text-zinc-500">{order.customer_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    statusColors[order.status] ?? 'bg-zinc-100 text-zinc-700'
                                                }`}
                                            >
                                                {order.status_label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-zinc-600">
                                            {order.payment_method_label}
                                        </td>
                                        <td className="px-4 py-4 text-right font-medium text-zinc-900">
                                            {formatPrice(order.subtotal)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-zinc-500">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

