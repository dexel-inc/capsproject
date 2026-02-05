import { Pencil, Trash2 } from 'lucide-react';
import type { Column } from '@/components/ui/DataTable';
import DataTable from '@/components/ui/DataTable';

type Category = {
    id: number;
    name: string;
    description: string;
    products_count: number;
};

type Props = {
    brands: Category[];
};
export default function Index({ brands }: Props) {
    const columns: Column<Category>[] = [
        {
            header: 'Nombre',
            accessor: 'name',
            cellClassName: 'font-medium text-zinc-900',
        },
        {
            header: 'Productos',
            accessor: 'products_count',
            align: 'center',
            cell: (row) => (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-medium text-zinc-600">
                    {row.products_count}
                </span>
            ),
        },
        {
            header: 'Acciones',
            align: 'center',
            width: 120,
            cell: (row) => (
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => console.log('Editar', row.id)}
                        className="text-zinc-600 hover:text-zinc-900"
                        aria-label={`Editar ${row.name}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => console.log('Eliminar', row.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Eliminar ${row.name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <DataTable<Category> data={brands} columns={columns} rowKey="id" emptyMessage="No hay categorías registradas." />
        </div>
    );
}
