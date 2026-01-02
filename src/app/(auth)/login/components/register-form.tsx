'use client';

import { useState } from 'react';
import { useRegister } from '@/context/register-context';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth-service';

export function RegisterModal() {
  const { isRegisterModalOpen, closeRegisterModal } = useRegister();
  const [formData, setFormData] = useState({
    nombres: '',
    usuario: '',
    email: '',
    contrasenna: '',
    confirmarContrasenna: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: '', label: 'Seleccione un rol' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'USER', label: 'Usuario' },
    { value: 'VIEWER', label: 'Visualizador' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos.';
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido.';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido.';
    }

    if (!formData.contrasenna) {
      newErrors.contrasenna = 'La contraseña es requerida.';
    } else if (formData.contrasenna.length < 6) {
      newErrors.contrasenna = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (formData.contrasenna !== formData.confirmarContrasenna) {
      newErrors.confirmarContrasenna = 'Las contraseñas no coinciden.';
    }

    if (!formData.role) {
      newErrors.role = 'Debe seleccionar un rol.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores del formulario.');
      return;
    }

    setIsLoading(true);
    try {
      const { nombres, usuario, email, contrasenna, role } = formData;
      await authService.register(nombres, usuario, email, contrasenna);

      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      closeRegisterModal();
      setFormData({
        nombres: '',
        usuario: '',
        email: '',
        contrasenna: '',
        confirmarContrasenna: '',
        role: '',
      });
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Error en el registro.');
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
      role: '',
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isRegisterModalOpen}
      onClose={handleClose}
      title="Registro de Usuario"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-[var(--text-primary)]">Nombres</label>
          <Input
            id="nombres"
            type="text"
            value={formData.nombres}
            onChange={(e) => handleInputChange('nombres', e.target.value)}
            className="mt-1"
            placeholder="Ingresa tus nombres"
          />
          {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>}
        </div>

        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-[var(--text-primary)]">Usuario</label>
          <Input
            id="usuario"
            type="text"
            value={formData.usuario}
            onChange={(e) => handleInputChange('usuario', e.target.value)}
            className="mt-1"
            placeholder="Ingresa tu usuario"
          />
          {errors.usuario && <p className="text-red-500 text-xs mt-1">{errors.usuario}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]">Email</label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1"
            placeholder="Ingresa tu email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contrasenna" className="block text-sm font-medium text-[var(--text-primary)]">Contraseña</label>
          <Input
            id="contrasenna"
            type="password"
            value={formData.contrasenna}
            onChange={(e) => handleInputChange('contrasenna', e.target.value)}
            className="mt-1"
            placeholder="Ingresa tu contraseña"
          />
          {errors.contrasenna && <p className="text-red-500 text-xs mt-1">{errors.contrasenna}</p>}
        </div>

        <div>
          <label htmlFor="confirmarContrasenna" className="block text-sm font-medium text-[var(--text-primary)]">Confirmar Contraseña</label>
          <Input
            id="confirmarContrasenna"
            type="password"
            value={formData.confirmarContrasenna}
            onChange={(e) => handleInputChange('confirmarContrasenna', e.target.value)}
            className="mt-1"
            placeholder="Confirma tu contraseña"
          />
          {errors.confirmarContrasenna && <p className="text-red-500 text-xs mt-1">{errors.confirmarContrasenna}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[var(--text-primary)]">Rol</label>
          <Select
            value={formData.role}
            onChange={(value) => handleInputChange('role', value || '')}
            options={roles}
          />
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
    </Modal>
  );
}