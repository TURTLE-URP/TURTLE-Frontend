import {
  PencilSimpleIcon,
  TrashIcon,
  EyeIcon,
} from '@phosphor-icons/react';

import type { Insumo } from '../interfaces/insumo.types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface Props {
  insumos: Insumo[];
  onEliminar: (id: string) => void;
  onVerDetalle: (insumo: Insumo) => void;
  onEditar: (insumo: Insumo) => void;
}

export function InsumosTable({
  insumos,
  onEliminar,
  onVerDetalle,
  onEditar,
}: Props) {
  return (
    <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
            <TableHead>Insumo</TableHead>

            <TableHead>Unidad base</TableHead>

            <TableHead>Stock</TableHead>

            <TableHead>Descripción</TableHead>

            <TableHead className="text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {insumos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No se encontraron insumos.
              </TableCell>
            </TableRow>
          ) : (
            insumos.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* INSUMO */}
                <TableCell>
                  <div className="font-semibold text-foreground text-sm">
                    {item.nombre}
                  </div>

                  <div className="text-xs text-muted-foreground font-mono">
                    {item.codigo}
                  </div>
                </TableCell>

                {/* UNIDAD BASE */}
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {item.unidadBase
                      ? `${item.unidadBase.nombre} (${item.unidadBase.abreviatura})`
                      : item.id_unidad_base}
                  </span>
                </TableCell>

                {/* STOCK */}
                <TableCell>
                  <span className="text-sm text-foreground">
                    {item.stockActual ?? '—'}
                  </span>
                </TableCell>

                {/* DESCRIPCIÓN */}
                <TableCell>
                  <p
                    className="text-sm text-muted-foreground max-w-md truncate"
                    title={item.descripcion ?? ''}
                  >
                    {item.descripcion ?? '—'}
                  </p>
                </TableCell>

                {/* ACCIONES */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(item)}
                      className="p-1 text-gray-500 hover:text-sky-600 transition-colors"
                      title="Ver Detalles"
                    >
                      <EyeIcon size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditar(item)}
                      className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                      title="Editar Insumo"
                    >
                      <PencilSimpleIcon size={18} />
                    </button>

                    <button
                      type="button"
                      title="Eliminar Insumo"
                      onClick={() => onEliminar(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}