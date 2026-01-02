'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Edit } from 'lucide-react';
import { RecibidosPdf } from './components/recibidos-pdf';
import { RecibidosForm } from './components/recibidos-form';

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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function FormulariosRecibidosPage() {
  const [notas, setNotas] = useState<NotaCredito[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    nombre: '',
    documento: ''
  });

  // Estados para modales
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaCredito | null>(null);

  useEffect(() => {
    fetchNotas(pagination.page);
  }, [pagination.page]);

  const fetchNotas = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filtros.tipo && { tipo: filtros.tipo }),
        ...(filtros.nombre && { nombre: filtros.nombre }),
        ...(filtros.documento && { documento: filtros.documento })
      });

      const response = await fetch(`/api/nota-credito?${params}`);
      if (!response.ok) {
        throw new Error('Error al obtener los formularios');
      }
      const data = await response.json();
      setNotas(data.notas || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPagination(prev => ({ ...prev, page: 1 })); // Resetear a página 1 cuando se filtra
  };

  const aplicarFiltros = () => {
    fetchNotas(1);
  };

  const limpiarFiltros = () => {
    setFiltros({ tipo: '', nombre: '', documento: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchNotas(1);
  };

  const handleViewPdf = (nota: NotaCredito) => {
    setSelectedNota(nota);
    setPdfModalOpen(true);
  };

  const handleEdit = (nota: NotaCredito) => {
    setSelectedNota(nota);
    setFormModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setPdfModalOpen(false);
    setSelectedNota(null);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setSelectedNota(null);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Cargando formularios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-sm mb-1">❌ Error</div>
        <p className="text-[11px] text-[var(--text-secondary)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          Formularios Recibidos
        </h1>
        <p className="text-[11px] text-[var(--text-secondary)]">
          Gestiona y administra todos los formularios que han sido enviados por los usuarios.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-lg card-shadow p-4">
          {/* Filtros */}
          <div className="mb-4 p-3 bg-[var(--content-bg)] rounded-lg card-shadow">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Filtros de Búsqueda</h3>
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Tipo</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-[var(--background)] border border-[var(--border-color)] rounded focus:ring-1 focus:ring-[var(--ring)] focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="factura">Factura</option>
                  <option value="boleta">Boleta</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Nombre</label>
                <input
                  type="text"
                  value={filtros.nombre}
                  onChange={(e) => handleFiltroChange('nombre', e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full px-2 py-1 text-xs bg-[var(--background)] border border-[var(--border-color)] rounded focus:ring-1 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Documento</label>
                <input
                  type="text"
                  value={filtros.documento}
                  onChange={(e) => handleFiltroChange('documento', e.target.value)}
                  placeholder="DNI o RUC..."
                  className="w-full px-2 py-1 text-xs bg-[var(--background)] border border-[var(--border-color)] rounded focus:ring-1 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 pt-5">
                <button
                  onClick={aplicarFiltros}
                  className="px-3 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary)]/90 transition-colors"
                >
                  Aplicar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="px-3 py-1 text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded hover:bg-[var(--secondary)]/80 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {notas.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📥</div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                Bandeja de Formularios
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Aquí aparecerán todos los formularios enviados por los usuarios para su revisión.
              </p>
              <div className="text-xs text-[var(--text-secondary)] bg-[var(--content-bg)] p-3 rounded-lg card-shadow">
                No hay formularios que coincidan con los filtros aplicados
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Formularios Recibidos ({pagination.total})
                </h2>
                <div className="text-xs text-[var(--text-secondary)]">
                  Página {pagination.page} de {pagination.pages}
                </div>
              </div>

              {/* Tabla HTML clásica */}
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="bg-[var(--background)] rounded-lg card-shadow overflow-hidden min-w-[720px]">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="bg-[var(--content-bg)] border-b border-[var(--border-color)]">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] w-20 whitespace-nowrap">
                          Tipo
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] w-40 whitespace-nowrap">
                          Nombre
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] w-24 whitespace-nowrap">
                          Documento
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] w-32 whitespace-nowrap">
                          Monto
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)] w-24 whitespace-nowrap">
                          Fecha
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-[var(--text-primary)] w-20 whitespace-nowrap">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.map((nota, index) => (
                        <tr key={nota._id} className="border-b border-[var(--border-color)] hover:bg-[var(--content-bg)] transition-colors">
                          <td className="px-3 py-2 w-20">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              nota.tipo === 'JURIDICA'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {nota.tipo === 'JURIDICA' ? 'Factura' : 'Boleta'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-[var(--text-primary)] font-medium w-40">
                            <div className="truncate max-w-[160px]" title={nota.nombre_completo}>
                              {nota.nombre_completo}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs text-[var(--text-secondary)] w-24">
                            {nota.tipo === 'JURIDICA' ? (nota.ruc || 'N/A') : (nota.dni || 'N/A')}
                          </td>
                          <td className="px-3 py-2 text-xs text-[var(--text-primary)] font-medium w-32">
                            <div>S/ {nota.monto_pagar.toFixed(2)}</div>
                            {nota.monto_letras && (
                              <div className="text-xs text-[var(--text-secondary)] mt-1 italic truncate max-w-[120px]" title={nota.monto_letras}>
                                {nota.monto_letras}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-[var(--text-secondary)] w-24">
                            {formatDate(nota.createdAt)}
                          </td>
                          <td className="px-3 py-2 text-center w-20">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPdf(nota)}
                                title="Ver PDF"
                              >
                                <FileText className="h-4 w-4 text-[var(--text-secondary)] hover:text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(nota)}
                                title="Editar formulario"
                              >
                                <Edit className="h-4 w-4 text-[var(--text-secondary)] hover:text-orange-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-4 p-3 bg-[var(--content-bg)] rounded-lg card-shadow">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>

                  <span className="text-xs text-[var(--text-secondary)]">
                    Página {pagination.page} de {pagination.pages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modales */}
        <RecibidosPdf
          isOpen={pdfModalOpen}
          onClose={handleClosePdfModal}
          nota={selectedNota}
        />

        <RecibidosForm
          isOpen={formModalOpen}
          onClose={handleCloseFormModal}
          nota={selectedNota}
        />
      </div>
  );
}


