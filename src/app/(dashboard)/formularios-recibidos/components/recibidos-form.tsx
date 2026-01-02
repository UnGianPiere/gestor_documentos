'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { NumerosALetras } from 'numero-a-letras';

interface NotaCredito {
  _id: string;
  tipo: 'NATURAL' | 'JURIDICA';
  nombre_completo: string;
  dni?: string;
  ruc?: string;
  monto_pagar: number;
  monto_letras?: string;
  numero_documento_origen: string;
  concepto_nota: string;
  fecha_caducidad: Date;
  responsable_unidad: string;
  banco_id?: {
    _id: string;
    nombre: string;
  };
  numero_cuenta?: string;
  cci?: string;
  datos_estaticos: {
    dependencia_solicitante: string;
    persona_contacto: string;
    anexo: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Banco {
  _id: string;
  nombre: string;
}

interface RecibidosFormProps {
  isOpen: boolean;
  onClose: () => void;
  nota: NotaCredito | null;
}

export function RecibidosForm({ isOpen, onClose, nota }: RecibidosFormProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [formData, setFormData] = useState({
    tipo_comprobante: '' as 'FACTURA' | 'BOLETA' | '',
    nombre_completo: '',
    dni: '',
    ruc: '',
    monto_pagar: '',
    monto_letras: '',
    numero_documento_origen: '',
    concepto_nota: '',
    fecha_caducidad: '',
    responsable_unidad: '',
    banco_id: '',
    numero_cuenta: '',
    cci: '',
  });

  // Cargar bancos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadBancos();
    }
  }, [isOpen]);

  // Cargar datos de la nota cuando se abre el modal
  useEffect(() => {
    if (isOpen && nota) {
      setFormData({
        tipo_comprobante: nota.tipo === 'JURIDICA' ? 'FACTURA' : 'BOLETA',
        nombre_completo: nota.nombre_completo,
        dni: nota.dni || '',
        ruc: nota.ruc || '',
        monto_pagar: nota.monto_pagar.toString(),
        monto_letras: nota.monto_letras || '',
        numero_documento_origen: nota.numero_documento_origen,
        concepto_nota: nota.concepto_nota,
        fecha_caducidad: nota.fecha_caducidad ? new Date(nota.fecha_caducidad).toISOString().split('T')[0] : '',
        responsable_unidad: nota.responsable_unidad,
        banco_id: nota.banco_id?._id || '',
        numero_cuenta: nota.numero_cuenta || '',
        cci: nota.cci || '',
      });
    }
  }, [isOpen, nota]);

  const loadBancos = async () => {
    try {
      const response = await fetch('/api/bancos');
      if (response.ok) {
        const bancosData = await response.json();
        setBancos(bancosData);
      }
    } catch (error) {
      console.error('Error cargando bancos:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Limpiar campos cuando cambia el tipo de comprobante
      if (field === 'tipo_comprobante') {
        if (value === 'FACTURA') {
          newData.dni = '';
        } else if (value === 'BOLETA') {
          newData.ruc = '';
        }
      }

      // Actualizar monto en letras automáticamente
      if (field === 'monto_pagar') {
        const monto = parseFloat(value);
        if (!isNaN(monto) && monto > 0) {
          let letras = NumerosALetras(monto);
          letras = letras.replace(/Pesos/g, 'Soles');
          letras = letras.replace(/Peso/g, 'Sol');
          newData.monto_letras = letras;
        } else {
          newData.monto_letras = '';
        }
      }

      return newData;
    });
  };

  const validateForm = (): string | null => {
    if (!formData.tipo_comprobante) return 'Debe seleccionar un tipo de comprobante';

    if (!formData.nombre_completo.trim()) {
      return formData.tipo_comprobante === 'FACTURA'
        ? 'La razón social es requerida'
        : 'El nombre completo es requerido';
    }

    if (formData.tipo_comprobante === 'FACTURA') {
      if (!formData.ruc.trim()) return 'El RUC es requerido para facturas';
      if (!/^\d{11}$/.test(formData.ruc.trim())) return 'El RUC debe tener exactamente 11 dígitos numéricos';
    } else if (formData.tipo_comprobante === 'BOLETA') {
      if (!formData.dni.trim()) return 'El DNI es requerido para boletas';
      if (!/^\d{8}$/.test(formData.dni.trim())) return 'El DNI debe tener exactamente 8 dígitos numéricos';
    }

    if (!formData.monto_pagar || parseFloat(formData.monto_pagar) <= 0) return 'El monto debe ser mayor a 0';
    if (parseFloat(formData.monto_pagar) > 999999.99) return 'El monto no puede ser mayor a 999,999.99';

    if (!formData.numero_documento_origen.trim()) return 'El número de documento de origen es requerido';
    if (!formData.concepto_nota.trim()) return 'El concepto de la nota es requerido';
    if (!formData.fecha_caducidad) return 'La fecha de caducidad es requerida';
    if (!formData.responsable_unidad.trim()) return 'El responsable de la unidad es requerido';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nota) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        tipo: formData.tipo_comprobante === 'FACTURA' ? 'JURIDICA' : 'NATURAL',
        nombre_completo: formData.nombre_completo.trim(),
        dni: formData.tipo_comprobante === 'BOLETA' ? formData.dni.trim() : undefined,
        ruc: formData.tipo_comprobante === 'FACTURA' ? formData.ruc.trim() : undefined,
        monto_pagar: parseFloat(formData.monto_pagar),
        monto_letras: formData.monto_letras,
        numero_documento_origen: formData.numero_documento_origen.trim(),
        concepto_nota: formData.concepto_nota.trim(),
        fecha_caducidad: formData.fecha_caducidad,
        responsable_unidad: formData.responsable_unidad.trim(),
        banco_id: formData.banco_id || undefined,
        numero_cuenta: formData.numero_cuenta.trim() || undefined,
        cci: formData.cci.trim() || undefined,
      };

      const response = await fetch(`/api/nota-credito/${nota._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la solicitud');
      }

      // Actualizar la lista de formularios
      await queryClient.invalidateQueries({ queryKey: ['notas-credito'] });

      toast.success('Solicitud actualizada exitosamente');
      onClose();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  if (!nota) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Solicitud de Nota de Crédito"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* TIPO COMPROBANTE */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-2">
            Tipo de Comprobante *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo_comprobante"
                value="FACTURA"
                checked={formData.tipo_comprobante === 'FACTURA'}
                onChange={(e) => handleInputChange('tipo_comprobante', e.target.value)}
                className="mr-2 accent-black"
              />
              Factura
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipo_comprobante"
                value="BOLETA"
                checked={formData.tipo_comprobante === 'BOLETA'}
                onChange={(e) => handleInputChange('tipo_comprobante', e.target.value)}
                className="mr-2 accent-black"
              />
              Boleta de Venta
            </label>
          </div>
        </div>

        {/* NOMBRE COMPLETO / RAZÓN SOCIAL */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            {formData.tipo_comprobante === 'FACTURA' ? 'Razón Social' : 'Nombre Completo'} *
          </label>
          <Input
            value={formData.nombre_completo}
            onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
            placeholder={
              formData.tipo_comprobante === 'FACTURA'
                ? 'Ingresa la razón social'
                : 'Ingresa el nombre completo'
            }
            className="w-full"
          />
        </div>

        {/* DNI / RUC */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            {formData.tipo_comprobante === 'FACTURA' ? 'RUC' : 'DNI'} *
          </label>
          <Input
            value={formData.tipo_comprobante === 'FACTURA' ? formData.ruc : formData.dni}
            onChange={(e) => handleInputChange(
              formData.tipo_comprobante === 'FACTURA' ? 'ruc' : 'dni',
              e.target.value
            )}
            placeholder={`Ingresa ${formData.tipo_comprobante === 'FACTURA' ? 'RUC' : 'DNI'}`}
            className="w-full"
          />
        </div>

        {/* MONTO */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Monto a Pagar *
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.monto_pagar}
            onChange={(e) => handleInputChange('monto_pagar', e.target.value)}
            placeholder="Ingresa el monto"
            className="w-full"
          />
          {formData.monto_letras && (
            <div className="mt-1 text-xs text-gray-700 font-medium">
              {formData.monto_letras}
            </div>
          )}
        </div>

        {/* NÚMERO DOCUMENTO ORIGEN */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            N° Documento de Origen *
          </label>
          <Input
            value={formData.numero_documento_origen}
            onChange={(e) => handleInputChange('numero_documento_origen', e.target.value)}
            placeholder="Ingresa el número de documento"
            className="w-full"
          />
        </div>

        {/* CONCEPTO */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Concepto de Nota de Crédito *
          </label>
          <textarea
            value={formData.concepto_nota}
            onChange={(e) => handleInputChange('concepto_nota', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe el concepto de la nota de crédito"
          />
        </div>

        {/* FECHA CADUCIDAD */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Fecha de Caducidad *
          </label>
          <Input
            type="date"
            value={formData.fecha_caducidad}
            onChange={(e) => handleInputChange('fecha_caducidad', e.target.value)}
            className="w-full"
          />
        </div>

        {/* RESPONSABLE */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Responsable de la Unidad *
          </label>
          <Input
            value={formData.responsable_unidad}
            onChange={(e) => handleInputChange('responsable_unidad', e.target.value)}
            placeholder="Ingresa el nombre del responsable"
            className="w-full"
          />
        </div>

        {/* BANCO */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Banco
          </label>
          <Select
            value={formData.banco_id || null}
            onChange={(value) => handleInputChange('banco_id', value || '')}
            options={[
              { value: '', label: 'Seleccione Banco' },
              ...bancos.map((banco) => ({
                value: banco._id,
                label: banco.nombre
              }))
            ]}
          />
        </div>

        {/* NÚMERO CUENTA */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            Número de Cuenta
          </label>
          <Input
            value={formData.numero_cuenta}
            onChange={(e) => handleInputChange('numero_cuenta', e.target.value)}
            placeholder="Ingresa el número de cuenta"
            className="w-full"
          />
        </div>

        {/* CCI */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-on-content-bg)] mb-1">
            CCI
          </label>
          <Input
            value={formData.cci}
            onChange={(e) => handleInputChange('cci', e.target.value)}
            placeholder="Ingresa el CCI"
            className="w-full"
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}