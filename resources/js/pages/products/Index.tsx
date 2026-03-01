import { Link } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';

import AppButton from '@/components/ui/AppButton';
import AppTitle from '@/components/ui/AppTitle';
import DataTable, { type Column } from '@/components/ui/DataTable';

type Product = {
    id: number;
    name: string;
    price: number | string;
    sku?: string | null;
    stock?: string | number | null;
    is_featured?: boolean;
};

type Props = {
    products?: Product[];
    filters?: {
        search?: string | null;
    };
};

export default function Index({ products = [] }: Props) {
    const columns: Column<Product>[] = [
        {
            header: 'Nombre',
            accessor: 'name',
            cellClassName: 'font-medium text-zinc-900',
        },
        {
            header: 'Precio',
            accessor: 'price',
            align: 'right',
            cell: (row) => {
                const value = Number(row.price ?? 0);

                return (
                    <span className="tabular-nums">
                        {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            maximumFractionDigits: 0,
                        }).format(value)}
                    </span>
                );
            },
        },
        {
            header: 'SKU',
            accessor: 'sku',
            cell: (row) => <span className="text-zinc-600">{row.sku || '-'}</span>,
        },
        {
            header: 'Stock',
            accessor: 'stock',
            align: 'center',
            cell: (row) => <span className="text-zinc-600">{row.stock ?? '-'}</span>,
        },
        {
            header: 'Destacado',
            accessor: 'is_featured',
            align: 'center',
            cell: (row) => (
                <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.is_featured ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}
                >
                    {row.is_featured ? 'Si' : 'No'}
                </span>
            ),
        },
        {
            header: 'Acciones',
            align: 'center',
            width: 120,
            cell: (row) => (
                <div className="flex items-center justify-center gap-3">
                    <Link href={`/products/${row.id}`} className="text-zinc-600 hover:text-zinc-900" aria-label={`Ver ${row.name}`} title="Ver">
                        <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                        href={`/products/${row.id}/edit`}
                        className="text-zinc-600 hover:text-zinc-900"
                        aria-label={`Editar ${row.name}`}
                        title="Editar"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <AppTitle title="Productos" subtitle="Gestiona los productos disponibles" />
                <AppButton href="/products/create">Agregar producto</AppButton>
            </div>

            <DataTable<Product> data={products} columns={columns} rowKey="id" emptyMessage="No hay productos registrados." />
        </div>
    );
}

