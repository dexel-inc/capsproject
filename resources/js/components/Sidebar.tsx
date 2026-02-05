import { Link, usePage } from '@inertiajs/react';
import {
    Store,
    BookOpen,
    Grid2x2,
    Box,
    ChevronDown,
    Menu,
    X,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const mainItems: NavItem[] = [
    {
        label: 'Catálogo',
        href: '/catalog',
        icon: BookOpen,
    },
];

const adminItems: NavItem[] = [
    {
        label: 'Categorías',
        href: '/categories',
        icon: Grid2x2,
    },
    {
        label: 'Productos',
        href: '/products',
        icon: Box,
    },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const { url } = usePage();

    const isActive = (href: string) => url === href || url.startsWith(`${href}/`);
    const isAdminActive = adminItems.some((item) => isActive(item.href));

    const [openAdmin, setOpenAdmin] = useState(isAdminActive);

    useEffect(() => {
        if (isAdminActive) setOpenAdmin(true);
    }, [isAdminActive]);

    const itemCard = (item: NavItem) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
                    active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700 hover:bg-zinc-100',
                ].join(' ')}
            >
                <Icon className={['h-5 w-5 shrink-0', active ? 'text-zinc-800' : 'text-zinc-500'].join(' ')} />
                <div className="min-w-0">
                    <p className="truncate text-sm leading-5">{item.label}</p>
                </div>
            </Link>
        );
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed left-4 top-4 z-50 rounded-lg border border-zinc-300 bg-white p-2 shadow md:hidden"
                aria-label="Abrir menú"
            >
                <Menu className="h-5 w-5" />
            </button>

            {open && (
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    aria-label="Cerrar menú"
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-200 bg-zinc-50 p-4 transition-transform duration-300',
                    open ? 'translate-x-0' : '-translate-x-full',
                    'md:static md:translate-x-0',
                ].join(' ')}
            >
                <div className="mb-5 flex items-start justify-between border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-800 text-white">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold leading-5 text-zinc-900">Caps Project</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-100 md:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="space-y-1">
                    {mainItems.map(itemCard)}
                    <button
                        type="button"
                        onClick={() => setOpenAdmin((v) => !v)}
                        className={[
                            'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                            isAdminActive || openAdmin
                                ? 'bg-zinc-100 text-zinc-900'
                                : 'text-zinc-700 hover:bg-zinc-100',
                        ].join(' ')}
                    >
                        <ShieldCheck className="h-5 w-5 shrink-0 text-zinc-500" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-medium leading-5">Administración</p>
                        </div>
                        <ChevronDown
                            className={[
                                'h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200',
                                openAdmin ? 'rotate-180' : '',
                            ].join(' ')}
                        />
                    </button>

                    {openAdmin && (
                        <div className="ml-2 space-y-1 border-l border-zinc-200 pl-2">
                            {adminItems.map(itemCard)}
                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
}
