
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BancosForm } from './components/bancos-form';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Banco {
  _id: string;
  nombre: string;
  activo: boolean;
}

export default function BancosPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanco, setSelectedBanco] = useState<Banco | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Query para obtener bancos
  const { data: bancos = [], isLoading, error } = useQuery<Banco[]>({
    queryKey: ['bancos'],
    queryFn: async () => {
      const res = await fetch('/api/bancos');
      if (!res.ok) throw new Error('Error al cargar los bancos');
      return res.json();
    },
  });

  // Mutation para eliminar bancos
  const deleteMutation = useMutation({
    mutationFn: async (bancoId: string) => {
      const res = await fetch(`/api/bancos/${bancoId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al eliminar el banco');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
      toast.success('Banco eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar el banco');
    },
  });

  // Mutation para cambiar estado del banco
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ bancoId, activo }: { bancoId: string; activo: boolean }) => {
      const res = await fetch(`/api/bancos/${bancoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al cambiar el estado del banco');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
      toast.success('Estado del banco actualizado');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al cambiar el estado del banco');
    },
  });

  const handleCreate = () => {
    setSelectedBanco(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (banco: Banco) => {
    setSelectedBanco(banco);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (banco: Banco) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el banco "${banco.nombre}"?`)) {
      deleteMutation.mutate(banco._id);
    }
  };

  const handleToggleStatus = async (banco: Banco) => {
    toggleStatusMutation.mutate({
      bancoId: banco._id,
      activo: !banco.activo,
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBanco(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Cargando bancos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-sm mb-1">❌ Error</div>
        <p className="text-[11px] text-[var(--text-secondary)]">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Gestión de Bancos</h1>
          <p className="text-[11px] text-[var(--text-secondary)]">Administra las entidades bancarias. Los bancos inactivos se muestran con su estado.</p>
        </div>
        <Button onClick={handleCreate} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Banco
        </Button>
      </div>

      <div className="bg-[var(--card-bg)] rounded-lg card-shadow p-4">
        {bancos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏦</div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">No hay bancos registrados</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-4">Comienza creando tu primer banco.</p>
            <Button onClick={handleCreate} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear primer banco
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--content-bg)] border-b border-[var(--border-color)]">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Nombre</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--text-primary)]">Estado</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--text-primary)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bancos.map((banco) => (
                  <tr
                    key={banco._id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--content-bg)] transition-colors ${
                      !banco.activo ? 'opacity-75' : ''
                    }`}
                  >
                    <td className={`px-3 py-2 text-xs font-medium ${
                      banco.activo ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}>
                      {banco.nombre}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            banco.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {banco.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(banco)}
                          disabled={toggleStatusMutation.isPending}
                          className={`h-6 w-6 p-0 ${
                            banco.activo
                              ? 'hover:bg-orange-100 hover:text-orange-600'
                              : 'hover:bg-green-100 hover:text-green-600'
                          }`}
                          title={banco.activo ? 'Desactivar banco' : 'Activar banco'}
                        >
                          {banco.activo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banco)}
                          className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                          title="Editar"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(banco)}
                          disabled={deleteMutation.isPending}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BancosForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        banco={selectedBanco}
        mode={formMode}
      />
    </div>
  );
}
