import { router, useForm } from '@inertiajs/react';
import { Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppModal from '@/components/ui/AppModal';
import type { Column } from '@/components/ui/DataTable';
import DataTable from '@/components/ui/DataTable';

type UserRole = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
    created_at: string;
};

type Props = {
    users: User[];
};

type CreateFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
};

type EditFormData = {
    name: string;
    email: string;
    password: string;
    role: string;
    _method: 'put';
};

export default function Index({ users }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<CreateFormData>({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });

    const {
        data: editData,
        setData: setEditData,
        post: postEdit,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<EditFormData>({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        _method: 'put',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        });
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0]?.name ?? 'customer',
            _method: 'put',
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
        resetEdit();
    };

    const submitEdit = (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        postEdit(`/admin/users/${editingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = (user: User) => {
        if (!confirm(`¿Eliminar a ${user.name}?`)) return;
        router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    const columns: Column<User>[] = [
        {
            header: 'Nombre',
            accessor: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Users className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-zinc-900">{row.name}</span>
                </div>
            ),
        },
        {
            header: 'Email',
            accessor: 'email',
            cell: (row) => (
                <span className="text-zinc-600">{row.email}</span>
            ),
        },
        {
            header: 'Rol',
            accessor: 'roles',
            cell: (row) => (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-medium text-zinc-600">
                    {row.roles[0]?.name ?? '—'}
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
                        onClick={() => openEditModal(row)}
                        className="text-zinc-600 hover:text-zinc-900"
                        aria-label={`Editar ${row.name}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row)}
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
                <AppButton onClick={openCreateModal} leftIcon={<UserPlus className="h-4 w-4" />}>
                    Agregar Usuario
                </AppButton>
            </div>

            <DataTable<User>
                data={users}
                columns={columns}
                rowKey="id"
                emptyMessage="No hay usuarios registrados."
            />

            <AppModal open={isCreateModalOpen} onClose={closeCreateModal} title="Agregar usuario">
                <form onSubmit={submit} className="space-y-4">
                    <AppInput
                        label="Nombre"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nombre completo"
                        error={errors.name}
                        required
                    />
                    <AppInput
                        label="Email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@ejemplo.com"
                        error={errors.email}
                        required
                    />
                    <AppInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        error={errors.password}
                        required
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Rol</label>
                        <select
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
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

            <AppModal open={isEditModalOpen} onClose={closeEditModal} title="Editar usuario">
                <form onSubmit={submitEdit} className="space-y-4">
                    <AppInput
                        label="Nombre"
                        name="edit-name"
                        value={editData.name}
                        onChange={(e) => setEditData('name', e.target.value)}
                        placeholder="Nombre completo"
                        error={editErrors.name}
                        required
                    />
                    <AppInput
                        label="Email"
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={(e) => setEditData('email', e.target.value)}
                        placeholder="email@ejemplo.com"
                        error={editErrors.email}
                        required
                    />
                    <AppInput
                        label="Nueva contraseña (dejar vacío para mantener)"
                        type="password"
                        name="password"
                        value={editData.password}
                        onChange={(e) => setEditData('password', e.target.value)}
                        placeholder="••••••••"
                        error={editErrors.password}
                    />
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Rol</label>
                        <select
                            name="role"
                            value={editData.role}
                            onChange={(e) => setEditData('role', e.target.value)}
                            className="h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <AppButton type="button" variant="secondary" onClick={closeEditModal}>
                            Cancelar
                        </AppButton>
                        <AppButton type="submit" disabled={editProcessing}>
                            {editProcessing ? 'Actualizando...' : 'Actualizar'}
                        </AppButton>
                    </div>
                </form>
            </AppModal>
        </div>
    );
}
