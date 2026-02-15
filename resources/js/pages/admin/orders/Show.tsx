import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, MapPin, Package, Phone, Mail } from 'lucide-react';
import type { FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';

type OrderItem = {
    id: number;
    product_slug: string;
    product_name: string;
    price: number;
    quantity: number;
};

type Order = {
    id: number;
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
    created_at: string;
    items: OrderItem[];
};

type Props = {
    order: Order;
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

export default function AdminOrdersShow({ order, statuses }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        status: order.status,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/orders/${order.id}`);
    };

    return (
        <>
            <Head title={`Orden #${order.id} | Admin`} />
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a órdenes
                </Link>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-zinc-200 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                                <Package className="h-5 w-5" />
                                Pedido #{order.id}
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">{formatDate(order.created_at)}</p>

                            <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-4">
                                <div className="min-w-[180px] flex-1">
                                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                        Estado
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                    >
                                        {Object.entries(statuses).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                                <AppButton type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Actualizar estado'}
                                </AppButton>
                            </form>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                                <Mail className="h-5 w-5" />
                                Cliente
                            </h2>
                            <dl className="mt-4 space-y-2 text-sm">
                                <div>
                                    <dt className="text-zinc-500">Nombre</dt>
                                    <dd className="font-medium text-zinc-900">{order.customer_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">Correo</dt>
                                    <dd className="font-medium text-zinc-900">{order.customer_email}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">Celular</dt>
                                    <dd className="font-medium text-zinc-900">{order.customer_phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-zinc-500">Pago</dt>
                                    <dd className="font-medium text-zinc-900">{order.payment_method_label}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                                <MapPin className="h-5 w-5" />
                                Dirección de entrega
                            </h2>
                            <p className="mt-4 text-sm text-zinc-700">{order.address}</p>
                            {order.city && (
                                <p className="mt-1 text-sm text-zinc-600">{order.city}</p>
                            )}
                            {order.notes && (
                                <p className="mt-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                                    Notas: {order.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="rounded-xl border border-zinc-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-zinc-900">Productos</h2>
                            <ul className="mt-4 space-y-3">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between border-b border-zinc-100 pb-3 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium text-zinc-900">{item.product_name}</p>
                                            <p className="text-sm text-zinc-500">
                                                {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-medium text-zinc-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-lg font-semibold">
                                <span>Total</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
