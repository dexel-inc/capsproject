import React from 'react';

type Align = 'left' | 'center' | 'right';

export type Column<T> = {
    id?: string;
    header: React.ReactNode;
    accessor?: keyof T | string;
    cell?: (row: T, rowIndex: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    align?: Align;
    width?: number | string;
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    rowKey: keyof T | ((row: T, index: number) => React.Key);
    emptyMessage?: string;
    className?: string;
};

function getByPath<T>(obj: T, path?: keyof T | string): unknown {
    if (!path) return undefined;
    if (typeof path !== 'string') return obj[path];

    return path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj as unknown);
}

function getAlignClass(align: Align = 'left') {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
}

export default function DataTable<T>({ data,
                                         columns,
                                         rowKey,
                                         emptyMessage = 'No hay datos para mostrar.',
                                         className = '',
                                     }: DataTableProps<T>) {
    const resolveKey = (row: T, index: number) =>
        typeof rowKey === 'function' ? rowKey(row, index) : (row[rowKey] as React.Key);

    return (
        <div className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="border-b border-zinc-200">
                        {columns.map((col, i) => (
                            <th
                                key={col.id ?? i}
                                style={col.width ? { width: col.width } : undefined}
                                className={[
                                    'px-4 py-4 text-sm font-medium text-zinc-600',
                                    getAlignClass(col.align),
                                    col.headerClassName ?? '',
                                ].join(' ')}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-10 text-center text-sm text-zinc-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={resolveKey(row, rowIndex)}
                                className="border-b border-zinc-200 last:border-b-0"
                            >
                                {columns.map((col, colIndex) => {
                                    const content = col.cell
                                        ? col.cell(row, rowIndex)
                                        : (getByPath(row, col.accessor) as React.ReactNode);

                                    return (
                                        <td
                                            key={col.id ?? colIndex}
                                            className={[
                                                'px-4 py-5 text-sm text-zinc-700',
                                                getAlignClass(col.align),
                                                col.cellClassName ?? '',
                                            ].join(' ')}
                                        >
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
