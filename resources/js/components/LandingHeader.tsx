import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const TOP_LOGOS = [
    { key: 'nba', label: 'NBA', href: '/catalog?collection=nba' },
    { key: 'nfl', label: 'NFL', href: '/catalog?collection=nfl' },
    { key: 'caps', label: '🧢', href: '/catalog', icon: true },
];

const TOP_RIGHT_LINKS = [
    { label: 'Ayuda', href: '/faq' },
];

const NAV_LINKS = [
    { label: 'NBA', href: '/catalog?collection=nba' },
    { label: 'Beisboleras', href: '/catalog?collection=beisboleras' },
    { label: 'Talla única', href: '/catalog?collection=talla-unica' },
    { label: 'Estilos propios', href: '/catalog?collection=estilos-propios' },
];

export default function LandingHeader() {
    const { auth } = usePage().props as { auth: { user: { name: string; is_admin: boolean } | null } };
    const [searchQuery, setSearchQuery] = useState('');
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/catalog', { q: searchQuery.trim() });
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setAccountOpen(false);
        if (accountOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [accountOpen]);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top bar */}
            <div className="border-b border-neutral-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
                    <div className="flex items-center gap-6">
                        {TOP_LOGOS.map(({ label, href, icon, key }) => (
                            <Link
                                key={key}
                                href={href}
                                className="flex items-center gap-1.5 font-semibold text-neutral-900 transition-colors hover:text-neutral-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                            >
                                {icon ? <span className="text-lg">{label}</span> : label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {TOP_RIGHT_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                            >
                                {label}
                            </Link>
                        ))}
                        <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAccountOpen((v) => !v);
                                    }}
                                    className="flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                                >
                                    {auth.user.name}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {accountOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg border border-neutral-200 bg-white py-2 shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Link
                                            href="/account"
                                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            Mi cuenta
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            Mis pedidos
                                        </Link>
                                        {auth.user.is_admin && (
                                            <Link
                                                href="/brands"
                                                className="block border-t border-neutral-100 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                                onClick={() => setAccountOpen(false)}
                                            >
                                                Administración
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => router.post('/logout')}
                                            className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                                >
                                    Registrarse
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                                >
                                    Iniciar sesión
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen((v) => !v)}
                        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
                        aria-label={mobileNavOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                        Caps Project
                    </Link>
                </div>

                <nav
                    className={`absolute left-0 right-0 top-full z-10 flex-col gap-4 border-b border-neutral-200 bg-white p-4 shadow-lg lg:static lg:flex lg:flex-1 lg:flex-row lg:justify-center lg:gap-8 lg:border-0 lg:shadow-none lg:p-0 ${mobileNavOpen ? 'flex' : 'hidden'}`}
                    aria-label="Navegación principal"
                >
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setMobileNavOpen(false)}
                            className="block py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 lg:py-0"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar"
                            className="w-48 rounded-full border border-neutral-300 bg-neutral-50 py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 lg:w-56"
                            aria-label="Buscar productos"
                        />
                    </form>
                    <Link
                        href="/account/wishlist"
                        className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                        aria-label="Favoritos"
                    >
                        <Heart className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/cart"
                        className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                        aria-label="Carrito"
                    >
                        <ShoppingBag className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
