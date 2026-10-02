import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import {
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';

import type { Insumo } from '../interfaces/insumo.types';
import type { InsumoFormValues } from '../schemas/insumo.schema';

import { InsumosTable } from '../components/insumo-table';
import { InsumoFormModal } from '../components/insumo-form-modal';
import { InsumoEditModal } from '../components/insumo-edit-modal';
import { InsumoDeleteDialog } from '../components/insumo-delete-dialog';

import { useInsumos } from '../hooks/use-insumos';

import { Input } from '@/shared/components/ui/input';

export function InsumosPage() {
  const {
    busqueda,
    cambiarBusqueda,
    pagina,
    setPagina,
    insumos,
    meta,
    isLoading,
    isError,
    crear,
    actualizar,
  } = useInsumos();

  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [insumoSeleccionado, setInsumoSeleccionado] = useState<Insumo | null>(null);
  const [insumoAEliminar, setInsumoAEliminar] = useState<Insumo | null>(null);

  const navigate = useNavigate();

  const totalPaginas = meta?.totalPages ?? 1;

  const handleOpenEditar = (insumo: Insumo) => {
    setInsumoSeleccionado(insumo);
    setModalEditarOpen(true);
  };

  const handleRegistrar = (data: InsumoFormValues) => {
    crear.mutate(data);
  };

  const handleEditarSubmit = (data: InsumoFormValues) => {
    if (!insumoSeleccionado) return;
    actualizar.mutate({ id: insumoSeleccionado.id, input: data });
    setModalEditarOpen(false);
  };

  const handleVerDetalle = (insumo: Insumo) => {
    void navigate({ to: '/insumo/$insumoId/ver-detalles', params: { insumoId: insumo.id } });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            MÓDULO - INSUMOS
          </span>

          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Insumos
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5">
            {meta ? `${meta.total} insumos registrados` : 'Cargando...'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalRegistrarOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Registrar Insumo
        </button>
      </div>

      {/* BUSCADOR (server-side: ?search=) */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon
            size={18}
            className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none"
          />

          <Input
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => cambiarBusqueda(e.target.value)}
            className="pl-9 bg-white shadow-xs border-gray-200"
          />
        </div>
      </div>

      {/* TABLA */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando insumos...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">No se pudieron cargar los insumos.</p>
      ) : (
        <InsumosTable
          insumos={insumos}
          onEliminar={(id) =>
            setInsumoAEliminar(insumos.find((i) => i.id === id) ?? null)
          }
          onVerDetalle={handleVerDetalle}
          onEditar={handleOpenEditar}
        />
      )}

      {/* PAGINACIÓN (backend: 10 por página) */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>
          {meta
            ? `Página ${meta.page} de ${meta.totalPages} · ${meta.total} resultados`
            : ''}
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
            disabled={pagina === 1}
            className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <CaretLeftIcon size={16} />
          </button>

          <span className="font-medium text-foreground">
            Página {pagina} de {totalPaginas}
          </span>

          <button
            type="button"
            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página siguiente"
          >
            <CaretRightIcon size={16} />
          </button>
        </div>
      </div>

      {/* MODAL REGISTRAR */}
      <InsumoFormModal
        open={modalRegistrarOpen}
        onOpenChange={setModalRegistrarOpen}
        onSubmit={handleRegistrar}
        isPending={crear.isPending}
      />

      {/* MODAL EDITAR */}
      <InsumoEditModal
        open={modalEditarOpen}
        onOpenChange={setModalEditarOpen}
        insumo={insumoSeleccionado}
        onSubmit={handleEditarSubmit}
        isPending={actualizar.isPending}
      />

      {/* MODAL ELIMINAR (hace el DELETE + invalida el listado; aquí solo se limpia) */}
      <InsumoDeleteDialog
        open={insumoAEliminar !== null}
        insumo={insumoAEliminar}
        onOpenChange={(open) => {
          if (!open) setInsumoAEliminar(null);
        }}
        onConfirmar={() => setInsumoAEliminar(null)}
      />
    </div>
  );
}
