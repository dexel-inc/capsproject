import { useForm } from '@inertiajs/react';
import { ImagePlus, Pencil, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppModal from '@/components/ui/AppModal';
import type { Column } from '@/components/ui/DataTable';
import DataTable from '@/components/ui/DataTable';

type Brand = {
    id: number;
    name: string;
    path?: string | null;
    url?: string | null;
    products_count?: number;
};

type Props = {
    brands: Brand[];
};

type FormData = {
    name: string;
    logo: File | null;
};

export default function Index({ brands }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        logo: null,
    });

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    const clearLogo = () => {
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        setData('logo', null);
    };

    const openCreateModal = () => {
        reset();
        clearLogo();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
        clearLogo();
    };

    const handleLogoChange = (file?: File) => {
        if (!file) {
            clearLogo();
            return;
        }

        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setData('logo', file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/brands', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const columns: Column<Brand>[] = [
        {
            header: 'Nombre',
            accessor: 'name',
            cell: (row) => {
                const src =
                    row.url ||
                    (row.path ? (row.path.startsWith('http') || row.path.startsWith('/storage/') ? row.path : `/storage/${row.path}`) : null);

                return (
                    <div className="flex items-center gap-3">
                        {src ? (
                            <img
                                src={src}
                                alt={`Logo ${row.name}`}
                                className="h-9 w-9 rounded-lg border border-zinc-200 bg-white object-contain p-1"
                                loading="lazy"
                            />
                        ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-400">
                                —
                            </div>
                        )}

                        <span className="font-medium text-zinc-900">{row.name}</span>
                    </div>
                );
            },
        },
        {
            header: 'Productos',
            accessor: 'products_count',
            align: 'center',
            cell: (row) => (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-medium text-zinc-600">
                    {row.products_count ?? 0}
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
            <div className="flex justify-end py-4">
                <AppButton onClick={openCreateModal}>Agregar Marca</AppButton>
            </div>

            <DataTable<Brand> data={brands} columns={columns} rowKey="id" emptyMessage="No hay marcas registradas." />

            <AppModal open={isCreateModalOpen} onClose={closeCreateModal} title="Agregar marca">
                <form onSubmit={submit} className="space-y-4">
                    <AppInput
                        label="Nombre de la marca"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej: Nike"
                        error={errors.name}
                        leftIcon={<Tag className="h-4 w-4" />}
                        required
                    />
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">Logo</label>

                        <input
                            id="brand-logo"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={(e) => handleLogoChange(e.target.files?.[0])}
                        />
                        <label
                            htmlFor="brand-logo"
                            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 transition hover:border-zinc-400 hover:bg-zinc-100"
                        >
                            {logoPreview ? (
                                <>
                                    <img
                                        src={logoPreview}
                                        alt="Preview logo"
                                        className="h-14 w-14 rounded-lg border border-zinc-200 bg-white object-contain p-1"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-zinc-800">Logo seleccionado</p>
                                        <p className="truncate text-xs text-zinc-500">{data.logo?.name ?? 'Haz clic para cambiar la imagen'}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600">
                                        <ImagePlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-800">Subir logo</p>
                                        <p className="text-xs text-zinc-500">PNG, JPG, WEBP o SVG (máx. 2MB)</p>
                                    </div>
                                </>
                            )}
                        </label>
                        {data.logo && (
                            <button
                                type="button"
                                onClick={clearLogo}
                                className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                                <X className="h-3.5 w-3.5" />
                                Quitar imagen
                            </button>
                        )}
                        {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <AppButton type="button" variant="secondary" onClick={closeCreateModal}>
                            Cancelar
                        </AppButton>

                        <AppButton type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </AppButton>
                    </div>
                </form>
            </AppModal>
        </div>
    );
}
