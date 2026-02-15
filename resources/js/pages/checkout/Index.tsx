import { Head, Link, useForm } from '@inertiajs/react';
import { Banknote, MapPin, Truck } from 'lucide-react';
import type { FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';

type CartItem = {
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
    defaults: {
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        address: string;
        city: string;
        payment_method: string;
        notes: string;
    };
    paymentMethods: Record<string, string>;
};

function formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function CheckoutIndex({ items, subtotal, defaults, paymentMethods }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: defaults.customer_name,
        customer_email: defaults.customer_email,
        customer_phone: defaults.customer_phone,
        address: defaults.address,
        city: defaults.city,
        payment_method: defaults.payment_method,
        notes: defaults.notes,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    const getError = (key: string): string | undefined => {
        const e = errors[key as keyof typeof errors];
        return Array.isArray(e) ? e[0] : (e as string | undefined);
    };

    return (
        <>
            <Head title="Completar pedido | Fortune" />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Completar pedido</h1>
                <p className="mt-2 text-neutral-600">
                    Completa tus datos y elige el método de pago.
                </p>

                <form onSubmit={submit} className="mt-8 lg:grid lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-neutral-900">Datos de contacto</h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <AppInput
                                    label="Nombre completo"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    error={getError('customer_name')}
                                    required
                                    autoComplete="name"
                                />
                                <AppInput
                                    label="Correo electrónico"
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    error={getError('customer_email')}
                                    required
                                    autoComplete="email"
                                />
                                <AppInput
                                    label="Celular"
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    error={getError('customer_phone')}
                                    required
                                    autoComplete="tel"
                                    className="sm:col-span-2"
                                />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                                <MapPin className="h-5 w-5" />
                                Dirección de entrega
                            </h2>
                            <div className="mt-4 space-y-4">
                                <AppInput
                                    label="Dirección"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    error={getError('address')}
                                    required
                                    autoComplete="street-address"
                                    placeholder="Calle, número, barrio"
                                />
                                <AppInput
                                    label="Ciudad (opcional)"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    error={getError('city')}
                                    autoComplete="address-level2"
                                />
                                <AppInput
                                    label="Notas del pedido (opcional)"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    error={getError('notes')}
                                    placeholder="Indicaciones adicionales para la entrega"
                                />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                                <Banknote className="h-5 w-5" />
                                Método de pago
                            </h2>
                            <div className="mt-4 space-y-3">
                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="contra_entrega"
                                        checked={data.payment_method === 'contra_entrega'}
                                        onChange={() => setData('payment_method', 'contra_entrega')}
                                        className="mt-1 h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                                    />
                                    <Truck className="h-5 w-5 shrink-0 text-neutral-600" />
                                    <div>
                                        <span className="font-medium text-neutral-900">
                                            {paymentMethods.contra_entrega}
                                        </span>
                                        <p className="text-sm text-neutral-500">Paga al recibir tu pedido</p>
                                    </div>
                                </label>
                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="transferencia"
                                        checked={data.payment_method === 'transferencia'}
                                        onChange={() => setData('payment_method', 'transferencia')}
                                        className="mt-1 h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-500"
                                    />
                                    <Banknote className="h-5 w-5 shrink-0 text-neutral-600" />
                                    <div>
                                        <span className="font-medium text-neutral-900">
                                            {paymentMethods.transferencia}
                                        </span>
                                        <p className="text-sm text-neutral-500">
                                            Te enviaremos los datos por correo
                                        </p>
                                    </div>
                                </label>
                            </div>
                            {getError('payment_method') && (
                                <p className="mt-2 text-sm text-red-600">{getError('payment_method')}</p>
                            )}
                        </section>
                    </div>

                    <div className="mt-8 lg:mt-0">
                        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-neutral-900">Resumen del pedido</h2>
                            <ul className="mt-4 space-y-3">
                                {items.map((item) => (
                                    <li key={item.slug} className="flex gap-3 text-sm">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-neutral-900">{item.name}</p>
                                            <p className="text-neutral-500">
                                                {item.quantity} × {formatPrice(item.price, item.currency)}
                                            </p>
                                        </div>
                                        <p className="shrink-0 font-medium text-neutral-900">
                                            {formatPrice(item.price * item.quantity, item.currency)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 border-t border-neutral-200 pt-4">
                                <div className="flex justify-between text-base font-semibold text-neutral-900">
                                    <span>Subtotal</span>
                                    <span>
                                        {formatPrice(subtotal, items[0]?.currency ?? 'COP')}
                                    </span>
                                </div>
                            </div>
                            <AppButton
                                type="submit"
                                className="mt-6 w-full"
                                loading={processing}
                                disabled={processing}
                            >
                                Confirmar pedido
                            </AppButton>
                            <Link
                                href="/cart"
                                className="mt-3 block text-center text-sm text-neutral-600 hover:text-neutral-900"
                            >
                                Volver al carrito
                            </Link>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}
