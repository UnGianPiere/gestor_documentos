'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface Banco {
  _id?: string;
  nombre: string;
}

interface BancosFormProps {
  isOpen: boolean;
  onClose: () => void;
  banco?: Banco | null;
  mode: 'create' | 'edit';
}

export function BancosForm({ isOpen, onClose, banco, mode }: BancosFormProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
  });

  // Reset form cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && banco) {
        setFormData({
          nombre: banco.nombre || '',
        });
      } else {
        setFormData({
          nombre: '',
        });
      }
    }
  }, [isOpen, mode, banco]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre del banco es requerido');
      return false;
    }

    if (formData.nombre.trim().length < 2) {
      toast.error('El nombre del banco debe tener al menos 2 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const url = mode === 'create' ? '/api/bancos' : `/api/bancos/${banco?._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar el banco');
      }

      // Actualizar la lista de bancos
      await queryClient.invalidateQueries({ queryKey: ['bancos'] });

      toast.success(
        mode === 'create'
          ? 'Banco creado exitosamente'
          : 'Banco actualizado exitosamente'
      );

      onClose();
    } catch (error) {
      console.error('Error saving banco:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el banco');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        nombre: '',
      });
      onClose();
    }
  };

  const title = mode === 'create' ? 'Crear Banco' : 'Editar Banco';
  const submitButtonText = mode === 'create' ? 'Crear Banco' : 'Actualizar Banco';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Nombre del Banco *
          </label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            placeholder="Ingresa el nombre del banco"
            className="w-full"
            disabled={isLoading}
          />
        </div>


        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'create' ? 'Creando...' : 'Actualizando...'}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}