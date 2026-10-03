import { useEffect, useState } from 'react';

export interface KardexMovement {
  id: string;
  fecha: string;
  tipo: 'Entrada' | 'Salida' | 'Ajuste' | 'Merma' | string;
  insumo: string;
  unidadMedida?: string;
  almacen: string;
  cantidad: number | string;
  saldo: number | string;
  documento: string;
  responsable?: string;
  motivo?: string;
}

interface KardexTableProps {
  movements: KardexMovement[];
  unidadMedida?: string;
  onSelectMovement?: (movement: KardexMovement) => void;
  selectedMovementId?: string;
  paginationKey?: string;
}

export function KardexTable({
  movements = [],
  unidadMedida = 'kg',
  onSelectMovement,
  selectedMovementId,
  paginationKey,
}: KardexTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(movements.length / itemsPerPage));
  const paginatedMovements = movements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [paginationKey]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const getBadgeStyle = (tipo: string) => {
    const t = (tipo || '').toLowerCase();
    if (t.includes('entrada')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (t.includes('salida')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (t.includes('merma')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (t.includes('ajuste')) return 'bg-sky-50 text-sky-700 border-sky-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3">Fecha y hora</th>
              <th className="py-3 px-3">Movimiento</th>
              <th className="py-3 px-3">Insumo</th>
              <th className="py-3 px-3">Almacén</th>
              <th className="py-3 px-3">Cantidad</th>
              <th className="py-3 px-3">Saldo</th>
              <th className="py-3 px-3">Origen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {Array.isArray(paginatedMovements) && paginatedMovements.length > 0 ? (
              paginatedMovements.map((m) => {
                if (!m) return null;
                const isSelected = selectedMovementId === m.id;
                const rawCantidad = String(m.cantidad || '');
                const isNegative = rawCantidad.startsWith('-');
                const cleanCantidad = rawCantidad.replace(/^[+-]/, '');
                const unit = m.unidadMedida ?? unidadMedida;

                return (
                  <tr
                    key={m.id}
                    onClick={() => onSelectMovement?.(m)}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      isSelected ? 'bg-amber-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-foreground whitespace-nowrap">
                      {m.fecha ? new Date(m.fecha).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getBadgeStyle(m.tipo)}`}>
                        {m.tipo || 'Movimiento'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-foreground font-medium">
                      {m.insumo || '-'}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {m.almacen || 'Cocina Central'}
                    </td>
                    <td className={`py-3 px-3 font-semibold ${
                      isNegative ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {isNegative ? `-${cleanCantidad}` : `+${cleanCantidad}`} {unit}
                    </td>
                    <td className="py-3 px-3 text-foreground">
                      {m.saldo ?? '-'} {unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground text-[11px]">
                      {m.documento || '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay movimientos registrados para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación horizontal al pie de la tarjeta */}
      <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground mt-auto">
        <span>
          Mostrando{' '}
          <strong className="text-foreground">
            {movements.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            {'–'}
            {Math.min(currentPage * itemsPerPage, movements.length)}
          </strong>{' '}
          de <strong className="text-foreground">{movements.length} movimientos</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-input bg-background hover:bg-muted disabled:opacity-50 text-xs font-medium cursor-pointer"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-input bg-background hover:bg-muted disabled:opacity-50 text-xs font-medium cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}