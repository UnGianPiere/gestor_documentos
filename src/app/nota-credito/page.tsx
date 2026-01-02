'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { NumerosALetras } from 'numero-a-letras';

// Componente del Logo UPCH
const UPCHLogo = () => (
  <div className="flex items-center justify-center">
    <Image
      src="/logo.png"
      alt="UPCH Logo"
      width={200}
      height={200}
      className="object-contain"
      priority
    />
  </div>
);

// Constantes de colores para tema claro (igual que kapo-presupuestos)
const LIGHT_THEME_COLORS = {
  background: 'rgb(255, 255, 255)',
  foreground: 'rgb(23, 23, 23)',
  cardBg: 'rgb(255, 255, 255)',
  borderColor: 'rgb(229, 231, 235)',
  textPrimary: 'rgb(92, 92, 92)',
  textSecondary: 'rgb(75, 85, 99)',
  textOnContentBg: 'rgb(31, 41, 55)',
  textOnContentBgHeading: 'rgb(17, 24, 39)',
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#2563eb',
};

// Estilos CSS globales para las tablas
const tableStyles = `
  table {
    border-collapse: separate;
    border-spacing: 0 6px;
  }

  /* Forzar tema claro específicamente para esta página usando constantes */
  .force-light-theme {
    --background: ${LIGHT_THEME_COLORS.background} !important;
    --foreground: ${LIGHT_THEME_COLORS.foreground} !important;
    --card-bg: ${LIGHT_THEME_COLORS.cardBg} !important;
    --border-color: ${LIGHT_THEME_COLORS.borderColor} !important;
    --text-primary: ${LIGHT_THEME_COLORS.textPrimary} !important;
    --text-secondary: ${LIGHT_THEME_COLORS.textSecondary} !important;
    --text-on-content-bg: ${LIGHT_THEME_COLORS.textOnContentBg} !important;
    --text-on-content-bg-heading: ${LIGHT_THEME_COLORS.textOnContentBgHeading} !important;
    --primary: ${LIGHT_THEME_COLORS.primary} !important;
    --primary-foreground: ${LIGHT_THEME_COLORS.primaryForeground} !important;
    --secondary: ${LIGHT_THEME_COLORS.secondary} !important;
    --secondary-foreground: ${LIGHT_THEME_COLORS.secondaryForeground} !important;
    --muted: ${LIGHT_THEME_COLORS.muted} !important;
    --muted-foreground: ${LIGHT_THEME_COLORS.mutedForeground} !important;
    --accent: ${LIGHT_THEME_COLORS.accent} !important;
    --accent-foreground: ${LIGHT_THEME_COLORS.accentForeground} !important;
    --destructive: ${LIGHT_THEME_COLORS.destructive} !important;
    --destructive-foreground: ${LIGHT_THEME_COLORS.destructiveForeground} !important;
    --border: ${LIGHT_THEME_COLORS.border} !important;
    --input: ${LIGHT_THEME_COLORS.input} !important;
    --ring: ${LIGHT_THEME_COLORS.ring} !important;
  }

  /* Asegurar colores de texto visibles */
  .header-cell {
    color: ${LIGHT_THEME_COLORS.textPrimary} !important;
  }

  .data-cell {
    color: ${LIGHT_THEME_COLORS.textPrimary} !important;
  }

  .input-text {
    color: ${LIGHT_THEME_COLORS.textPrimary} !important;
  }
`;


interface FormData {
  tipo_comprobante: 'FACTURA' | 'BOLETA' | '';
  nombre_completo: string;
  dni: string;
  ruc: string;
  monto_pagar: string;
  numero_documento_origen: string;
  concepto_nota: string;
  fecha_caducidad: string;
  responsable_unidad: string;
  banco_id: string;
  numero_cuenta: string;
  cci: string;
  monto_letras: string;
}

interface ConfigData {
  dependencia_solicitante: string;
  persona_contacto: string;
  anexo: string;
}

interface Banco {
  _id: string;
  nombre: string;
}

export default function NotaCreditoPage() {
  const [formData, setFormData] = useState<FormData>({
    tipo_comprobante: '',
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

  const [config, setConfig] = useState<ConfigData | null>(null);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar configuración y bancos al montar
  useEffect(() => {
    loadConfig();
    loadBancos();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/form-configuracion');
      if (response.ok) {
        const configData = await response.json();
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Si cambia el tipo de comprobante, limpiar el campo opuesto
      if (field === 'tipo_comprobante') {
        if (value === 'FACTURA') {
          newData.dni = ''; // Limpiar DNI cuando es FACTURA
        } else if (value === 'BOLETA') {
          newData.ruc = ''; // Limpiar RUC cuando es BOLETA
        }
      }

      // Si cambia el monto, actualizar automáticamente el monto en letras
      if (field === 'monto_pagar') {
        const monto = parseFloat(value);
        if (!isNaN(monto) && monto > 0) {
          let letras = NumerosALetras(monto);
          // Reemplazar "Pesos" por "Soles" para Perú
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

    // Validar DNI o RUC dependiendo del tipo de comprobante
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

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/nota-credito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la solicitud');
      }

      const result = await response.json();
      toast.success('Solicitud enviada exitosamente');

      // Limpiar formulario
      setFormData({
        tipo_comprobante: '',
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

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-4 md:py-10 px-2 md:px-4 text-xs force-light-theme"
      style={{
        backgroundImage: 'url(/fondo-form.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: tableStyles }} />

      {/* Botón de volver */}
      <div className="max-w-5xl mx-auto mb-4 md:mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Si hay historial y no estamos en la raíz del historial, ir atrás
            if (window.history.length > 1) {
              window.history.back();
            } else {
              // Si no hay historial, ir al dashboard principal
              window.location.href = '/formularios-recibidos';
            }
          }}
        >
          ← Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto bg-[var(--background)] backdrop-blur-sm rounded-lg shadow-sm p-4 md:p-8 border border-[var(--border-color)]">

          {/* HEADER */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <tbody>
                <tr>
                  <td className="w-1/4 text-center font-bold p-2 md:p-4 header-cell">
                    <UPCHLogo />
                  </td>

                  <td className="w-1/2 text-center font-bold leading-tight p-2 md:p-4 header-cell">
                    <div className="text-xs">
                      UNIDAD DE GESTIÓN GOBIERNO Y ADMINISTRACIÓN<br />
                      DIRECCIÓN GENERAL DE ADMINISTRACIÓN<br />
                      SISTEMA DE GESTIÓN DE LA CALIDAD
                    </div>
                    <div className="mt-1 md:mt-2 font-bold text-xs">
                      SOLICITUD DE EMISIÓN NOTA DE CRÉDITO
                    </div>
                    <div className="text-xs">
                      (Bienes, servicios, proyectos, protocolos y otros)
                    </div>
                  </td>

                  <td className="w-1/4 text-xs p-2 md:p-4 align-top header-cell">
                    <div><b>Código:</b> F-1-C-E-12</div>
                    <div><b>Versión:</b> 10 - 10/09/2018</div>
                    <div><b>División:</b> Finanzas</div>
                    <div><b>Página:</b> 1 de 1</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TIPO COMPROBANTE */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full min-w-[500px]">
              <tbody>
                <tr>
                  <td className="px-3 py-2 font-bold w-48 md:w-64 header-cell" style={{ background: '#d8d9d9' }}>
                    MARCAR SEGÚN CORRESPONDA
                  </td>
                  <td className="px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                    FACTURA
                    <input
                      type="radio"
                      name="tipo_comprobante"
                      value="FACTURA"
                      checked={formData.tipo_comprobante === 'FACTURA'}
                      onChange={(e) => handleInputChange('tipo_comprobante', e.target.value)}
                      className="ml-2 accent-black"
                    />
                  </td>
                  <td className="px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                    BOLETA DE VENTA
                    <input
                      type="radio"
                      name="tipo_comprobante"
                      value="BOLETA"
                      checked={formData.tipo_comprobante === 'BOLETA'}
                      onChange={(e) => handleInputChange('tipo_comprobante', e.target.value)}
                      className="ml-2 accent-black"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* DATOS */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[600px]">
            <tbody>
              <tr>
                <td className="px-2 md:px-3 py-2 font-bold w-32 md:w-48 lg:w-64 header-cell" style={{ background: '#d8d9d9' }}>
                  {formData.tipo_comprobante === 'FACTURA' ? 'Razón Social' : 'Nombre Completo'}
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={formData.nombre_completo}
                    onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                    className="w-full bg-transparent outline-none border-none input-text"
                    placeholder={
                      formData.tipo_comprobante === 'FACTURA'
                        ? 'Ingresa la razón social'
                        : 'Ingresa el nombre completo'
                    }
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  {formData.tipo_comprobante === 'FACTURA' ? 'RUC' : 'DNI'}
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={formData.tipo_comprobante === 'FACTURA' ? formData.ruc : formData.dni}
                    onChange={(e) => handleInputChange(
                      formData.tipo_comprobante === 'FACTURA' ? 'ruc' : 'dni',
                      e.target.value
                    )}
                    className="w-full bg-transparent outline-none border-none input-text"
                    placeholder={`Ingresa ${formData.tipo_comprobante === 'FACTURA' ? 'RUC' : 'DNI'}`}
                  />
                </td>
              </tr>

              {/* DATOS ESTÁTICOS */}
              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Dependencia Solicitante
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={config?.dependencia_solicitante || ''}
                    readOnly
                    className="w-full bg-transparent outline-none border-none input-text"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Persona de Contacto
                </td>
                <td className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={config?.persona_contacto || ''}
                    readOnly
                    className="w-full bg-transparent outline-none border-none input-text"
                  />
                </td>
                <td className="px-2 md:px-3 py-2 font-bold text-center header-cell" style={{ background: '#d8d9d9' }}>
                  Anexo
                </td>
                <td className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={config?.anexo || ''}
                    readOnly
                    className="w-full bg-transparent outline-none border-none input-text"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Monto a Pagar
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.monto_pagar}
                    onChange={(e) => handleInputChange('monto_pagar', e.target.value)}
                    className="w-full bg-transparent outline-none border-none input-text"
                    placeholder="Ingresa el monto"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Monto en Letras
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <div className="w-full bg-transparent text-xs text-gray-700 font-medium min-h-[2.5rem] flex items-center">
                    {formData.monto_letras || 'Ingresa un monto para ver el equivalente en letras'}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  N° Documento de Origen
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={formData.numero_documento_origen}
                    onChange={(e) => handleInputChange('numero_documento_origen', e.target.value)}
                    className="w-full bg-transparent outline-none border-none input-text"
                    placeholder="Ingresa el número de documento"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold align-top header-cell" style={{ background: '#d8d9d9' }}>
                  Concepto de Nota de Crédito
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-3 data-cell" style={{ background: '#f2f3f2' }}>
                  <textarea
                    value={formData.concepto_nota}
                    onChange={(e) => handleInputChange('concepto_nota', e.target.value)}
                    rows={3}
                    className="w-full bg-transparent outline-none resize-none border-none input-text"
                    placeholder="Describe el concepto de la nota de crédito"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Fecha de Caducidad
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    type="date"
                    value={formData.fecha_caducidad}
                    onChange={(e) => handleInputChange('fecha_caducidad', e.target.value)}
                    className="bg-transparent outline-none border-none input-text"
                  />
                </td>
              </tr>

              <tr>
                <td className="px-2 md:px-3 py-2 font-bold header-cell" style={{ background: '#d8d9d9' }}>
                  Responsable de la Unidad
                </td>
                <td colSpan={3} className="px-2 md:px-4 py-2 data-cell" style={{ background: '#f2f3f2' }}>
                  <Input
                    value={formData.responsable_unidad}
                    onChange={(e) => handleInputChange('responsable_unidad', e.target.value)}
                    className="w-full bg-transparent outline-none border-none input-text"
                    placeholder="Ingresa el nombre del responsable"
                  />
                </td>
              </tr>
            </tbody>
            </table>
          </div>

          {/* TRANSFERENCIA */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full min-w-[600px]">
            <tbody>
              <tr>
                <td className="w-2/3 p-2 md:p-4 data-cell" style={{ background: '#f2f3f2' }}>
                  <div className="font-bold mb-2 header-cell">
                    APLICACIÓN DE LA NOTA DE CRÉDITO
                  </div>

                  <div className="font-bold mb-2 header-cell">TRANSFERENCIA BANCARIA</div>

                  <div className="mb-2">
                    <select
                      value={formData.banco_id || ''}
                      onChange={(e) => handleInputChange('banco_id', e.target.value)}
                      className="w-full bg-transparent border border-gray-200 text-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-2 text-xs"
                    >
                      <option value="">Seleccione Banco</option>
                      {bancos.map((banco) => (
                        <option key={banco._id} value={banco._id}>
                          {banco.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    value={formData.numero_cuenta}
                    onChange={(e) => handleInputChange('numero_cuenta', e.target.value)}
                    className="w-full mb-2 input-text"
                    placeholder="Número de Cuenta"
                  />

                  <Input
                    value={formData.cci}
                    onChange={(e) => handleInputChange('cci', e.target.value)}
                    className="w-full input-text"
                    placeholder="CCI"
                  />
                </td>

                <td className="w-1/3 text-center p-2 md:p-3 header-cell" style={{ background: '#d8d9d9' }}>
                  <div className="font-bold text-xs mb-2">
                    FIRMA Y SELLO DEL RESPONSABLE DE LA UNIDAD
                  </div>
                  <div className="h-24 flex items-center justify-center text-xs data-cell" style={{ background: '#feffff' }}>
                    <Image
                      src="/firma.jpg"
                      alt="Firma del Responsable"
                      width={120}
                      height={60}
                      className="object-contain"
                      priority
                    />
                  </div>
                </td>
              </tr>
            </tbody>
            </table>
          </div>

          <div className="mt-4 md:mt-6 text-right">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
