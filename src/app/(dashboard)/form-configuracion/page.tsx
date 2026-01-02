'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface ConfigData {
  _id?: string;
  dependencia_solicitante: string;
  persona_contacto: string;
  anexo: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function FormConfiguracionPage() {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigData>({
    dependencia_solicitante: '',
    persona_contacto: '',
    anexo: '',
    activo: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/form-configuracion');
      if (response.ok) {
        const configData = await response.json();
        setConfig(configData);
      } else if (response.status === 404) {
        // No hay configuración, usar valores por defecto
        setConfig({
          dependencia_solicitante: '',
          persona_contacto: '',
          anexo: '',
          activo: true,
        });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConfigData, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = config._id ? 'PUT' : 'POST';
      const response = await fetch('/api/form-configuracion', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dependencia_solicitante: config.dependencia_solicitante,
          persona_contacto: config.persona_contacto,
          anexo: config.anexo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la configuración');
      }

      const savedConfig = await response.json();
      setConfig(savedConfig);
      toast.success('Configuración guardada exitosamente');

    } catch (error) {
      console.error('Error guardando configuración:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-on-content-bg-heading)] mb-2">
            Configuración del Formulario
          </h1>
          <p className="text-[var(--text-secondary)]">
            Configura los datos globales que aparecerán en el formulario de solicitud de notas de crédito.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow">
            <div className="space-y-4">
              <div>
                <label htmlFor="dependencia_solicitante" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-2">
                  Dependencia Solicitante
                </label>
                <Input
                  id="dependencia_solicitante"
                  value={config.dependencia_solicitante}
                  onChange={(e) => handleInputChange('dependencia_solicitante', e.target.value)}
                  placeholder="Ej: ESCUELA DE POSGRADO"
                  required
                />
              </div>

              <div>
                <label htmlFor="persona_contacto" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-2">
                  Persona de Contacto
                </label>
                <Input
                  id="persona_contacto"
                  value={config.persona_contacto}
                  onChange={(e) => handleInputChange('persona_contacto', e.target.value)}
                  placeholder="Ej: YVONNE MACHICADO ZUÑIGA"
                  required
                />
              </div>

              <div>
                <label htmlFor="anexo" className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-2">
                  Anexo
                </label>
                <Input
                  id="anexo"
                  value={config.anexo}
                  onChange={(e) => handleInputChange('anexo', e.target.value)}
                  placeholder="Ej: 210204"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/nota-credito')}
              className="px-6"
            >
              IR AL FORMULARIO
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Vista Previa del Formulario
          </h3>
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Dependencia:</strong> {config.dependencia_solicitante || 'No configurado'}</p>
            <p><strong>Persona Contacto:</strong> {config.persona_contacto || 'No configurado'}</p>
            <p><strong>Anexo:</strong> {config.anexo || 'No configurado'}</p>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Estos datos aparecerán automáticamente en el formulario público de notas de crédito.
          </p>
        </div>
      </div>
    </div>
  );
}
