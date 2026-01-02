'use client';

import { useState } from 'react';
import { useRegister } from '@/context/register-context';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export function RegisterModal() {
  const { isRegisterModalOpen, closeRegisterModal } = useRegister();
  const [formData, setFormData] = useState({
    nombres: '',
    usuario: '',
    email: '',
    contrasenna: '',
    confirmarContrasenna: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasenna !== formData.confirmarContrasenna) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasenna.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la lógica de registro
      // Por ahora solo mostramos un mensaje
      toast.success('Funcionalidad de registro pendiente de implementar');

      // Cerrar modal después del registro exitoso
      closeRegisterModal();
      setFormData({
        nombres: '',
        usuario: '',
        email: '',
        contrasenna: '',
        confirmarContrasenna: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeRegisterModal();
    setFormData({
      nombres: '',
      usuario: '',
      email: '',
      contrasenna: '',
      confirmarContrasenna: '',
    });
  };

  return (
    <Modal
      isOpen={isRegisterModalOpen}
      onClose={handleClose}
      title="Crear cuenta"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Nombres completos
          </label>
          <Input
            id="nombres"
            name="nombres"
            type="text"
            value={formData.nombres}
            onChange={handleInputChange}
            required
            placeholder="Ingresa tus nombres completos"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Usuario
          </label>
          <Input
            id="usuario"
            name="usuario"
            type="text"
            value={formData.usuario}
            onChange={handleInputChange}
            required
            placeholder="Ingresa tu nombre de usuario"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Ingresa tu correo electrónico"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="contrasenna" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Contraseña
          </label>
          <Input
            id="contrasenna"
            name="contrasenna"
            type="password"
            value={formData.contrasenna}
            onChange={handleInputChange}
            required
            placeholder="Ingresa tu contraseña"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="confirmarContrasenna" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Confirmar contraseña
          </label>
          <Input
            id="confirmarContrasenna"
            name="confirmarContrasenna"
            type="password"
            value={formData.confirmarContrasenna}
            onChange={handleInputChange}
            required
            placeholder="Confirma tu contraseña"
            className="w-full"
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
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}