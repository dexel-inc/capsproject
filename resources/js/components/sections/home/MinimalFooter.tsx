import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const HELP_LINKS = [
    { label: 'Preguntas Frecuentes', href: '/faq' },
    { label: 'Cuidado del Producto', href: '/care' },
];

const SERVICES_LINKS = [
    { label: 'Personalización', href: '/personalization' },
    { label: 'El Arte de Regalar', href: '/gift' },
];

const ABOUT_LINKS = [{ label: 'Noticias recientes', href: '/news' }];

const SOCIAL_LINKS = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
];

interface MinimalFooterProps {
    prefersReducedMotion: boolean;
}

export default function MinimalFooter({ prefersReducedMotion }: MinimalFooterProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleNewsletterSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 500);
    };

    return (
        <footer className="border-t border-neutral-200 bg-white px-6 py-16 lg:py-24" role="contentinfo">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Ayuda */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">Ayuda</h3>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
                            Un asesor de clientes estará disponible:
                            <br />
                            Lunes a Viernes de 10 am – 7 pm llamando al{' '}
                            <a
                                href="tel:+528009991807"
                                className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-2 transition-colors hover:decoration-neutral-900"
                            >
                                +52 800 999 1807
                            </a>
                            . También puede contactarnos a través de{' '}
                            <a
                                href="https://wa.me/528009991807"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-2 transition-colors hover:decoration-neutral-900"
                            >
                                WhatsApp
                            </a>{' '}
                            o enviarnos un correo electrónico a{' '}
                            <a
                                href="mailto:contacto@capsproject.com"
                                className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-2 transition-colors hover:decoration-neutral-900"
                            >
                                contacto@capsproject.com
                            </a>
                        </p>
                        <ul className="mt-6 space-y-2">
                            {HELP_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:rounded"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">Servicios</h3>
                        <ul className="mt-4 space-y-3">
                            {SERVICES_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:rounded"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Acerca de nuestra marca */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                            Acerca de nuestra marca
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {ABOUT_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:rounded"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recibir Correos */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                            Recibir Correos
                        </h3>
                        <p className="mt-4 text-sm text-neutral-600">
                            Regístrese a los correos electrónicos de Caps y reciba las últimas noticias, incluyendo
                            pre-lanzamientos exclusivos en línea y nuevas colecciones.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="mt-4">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                                    aria-label="Email para newsletter"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50"
                                >
                                    {status === 'loading' ? '...' : <Mail className="h-5 w-5" aria-hidden="true" />}
                                </button>
                            </div>
                            {status === 'success' && (
                                <p className="mt-2 text-xs text-green-600">¡Gracias por suscribirte!</p>
                            )}
                        </form>
                        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-neutral-900">
                            Síganos
                        </h3>
                        <div className="mt-4 flex gap-3">
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                                    aria-label={label}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
                    © {new Date().getFullYear()} Fortune. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
