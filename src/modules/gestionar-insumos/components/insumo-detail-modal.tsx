import { XIcon } from '@phosphor-icons/react';

import type { Insumo } from '../interfaces/types';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumo: Insumo | null;
}

const NIVEL_STOCK_STYLES = {
  OK: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Bajo: 'bg-amber-50 text-amber-700 border-amber-200',
  Critico: 'bg-rose-50 text-rose-700 border-rose-200',
} as const;

export function InsumoDetailModal({ open, onOpenChange, insumo }: Props) {
  if (!open || !insumo) return null;

  const handleClose = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              DETALLE DE INSUMO · {insumo.codigo}
            </span>
            <h2 className="text-xl font-bold text-gray-800">{insumo.nombre}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4">
          {insumo.imagenUrl && (
            <img
              src={insumo.imagenUrl}
              alt={insumo.nombre}
              className="h-40 w-full rounded-lg object-cover"
            />
          )}

          <div>
            <p className="text-xs font-medium text-gray-500">Descripción</p>
            <p className="mt-1 text-sm text-gray-800">
              {insumo.descripcion || 'Sin descripción'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Categorías</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {insumo.categorias.map((categoria) => (
                <Badge
                  key={categoria}
                  variant="outline"
                  className="font-normal text-xs bg-background"
                >
                  {categoria}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Unidad de medida</p>
              <p className="mt-1 text-sm text-gray-800">{insumo.unidadMedida}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Estado</p>
              <p className="mt-1 text-sm text-gray-800">{insumo.estado}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Stock actual</p>
              <p className="text-lg font-semibold text-gray-800">
                {insumo.stockActual}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Stock mínimo</p>
              <p className="text-lg font-semibold text-gray-800">
                {insumo.stockMinimo}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-500">Stock de abasto</p>
              <p className="text-lg font-semibold text-gray-800">
                {insumo.stockAbasto}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Nivel de stock</p>
            <span
              className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${NIVEL_STOCK_STYLES[insumo.nivelStock]}`}
            >
              {insumo.nivelStock}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}