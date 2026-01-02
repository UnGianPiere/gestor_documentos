
'use client';

import { useEffect, useState } from 'react';

interface NotaCredito {
  _id: string;
  tipo: 'NATURAL' | 'JURIDICA';
  nombre_completo: string;
  numero_documento_origen?: string;
  monto_pagar: number;
  createdAt: string;
}

export default function NotasCreditoPage() {
  const [notas, setNotas] = useState<NotaCredito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/nota-credito');
        if (!res.ok) throw new Error('Error al cargar notas de crédito');
        const data = await res.json();
        setNotas(data.notas || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Cargando notas de crédito...</p>
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
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Notas de Crédito</h1>
        <p className="text-[11px] text-[var(--text-secondary)]">Listado de notas de crédito recibidas.</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-lg card-shadow p-4">
        {notas.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🧾</div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">No hay notas de crédito</h2>
            <p className="text-xs text-[var(--text-secondary)]">Aquí se mostrarán las notas registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--content-bg)] border-b border-[var(--border-color)]">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Tipo</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Nombre</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Monto</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-primary)]">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota) => (
                  <tr key={nota._id} className="border-b border-[var(--border-color)] hover:bg-[var(--content-bg)] transition-colors">
                    <td className="px-3 py-2 text-xs text-[var(--text-primary)] font-medium">{nota.tipo === 'JURIDICA' ? 'Factura' : 'Boleta'}</td>
                    <td className="px-3 py-2 text-xs text-[var(--text-primary)]">{nota.nombre_completo}</td>
                    <td className="px-3 py-2 text-xs text-[var(--text-secondary)]">S/ {nota.monto_pagar.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-[var(--text-secondary)]">{new Date(nota.createdAt).toLocaleDateString('es-ES')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
