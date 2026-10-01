import { useEffect, useState } from 'react';

import {
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';

import type { Insumo } from '../logic/types';
import type { InsumoFormValues } from '../logic/schema';

import { InsumosTable } from './insumo-table';
import { InsumoFormModal } from './insumo-form-modal';
import { InsumoEditModal } from './insumo-edit-modal';
import { InsumoDetailModal } from './insumo-detail-modal';

import { useInsumos } from '../logic/hooks';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function GestionarInsumosPage() {
  const {
    insumos,
    kpis,
    filtros,
    setFiltros,
    registrarInsumo,
    eliminarInsumo,
  } = useInsumos();

  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);

  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [insumoDetalle, setInsumoDetalle] = useState<Insumo | null>(null);

  const [insumoSeleccionado, setInsumoSeleccionado] =
    useState<Insumo | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);

  const elementosPorPagina = 5;

  const totalPaginas =
    Math.ceil(insumos.length / elementosPorPagina) || 1;

  const insumosPaginados = insumos.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const handleOpenEditar = (insumo: Insumo) => {
    setInsumoSeleccionado(insumo);
    setModalEditarOpen(true);
  };

  const handleEditarSubmit = (data: InsumoFormValues) => {
    console.log(
      'Insumo editado:',
      insumoSeleccionado?.id,
      data
    );

    setModalEditarOpen(false);
  };

  const handleEliminar = (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este insumo? Esta acción no se puede deshacer.')) return;
    eliminarInsumo(id);
  };

  // Si eliminas el último insumo de una página, vuelve a una página válida
  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [paginaActual, totalPaginas]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            MÓDULO - CUS03
          </span>

          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Insumos
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5">
            {kpis.activos} insumos activos de {kpis.total} registrados
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

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* BUSCADOR */}
        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon
            size={18}
            className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none"
          />

          <Input
            placeholder="Buscar por nombre, código o proveedor..."
            value={filtros.busqueda}
            onChange={(e) => {
              setPaginaActual(1);

              setFiltros((prev) => ({
                ...prev,
                busqueda: e.target.value,
              }));
            }}
            className="pl-9 bg-white shadow-xs border-gray-200"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 items-center flex-wrap sm:flex-nowrap">
          {/* FILTRO DE CATEGORÍA */}
          <select
            value={filtros.categoria}
            onChange={(e) => {
              setPaginaActual(1);

              setFiltros((prev) => ({
                ...prev,
                categoria: e.target.value as
                  | 'Todos'
                  | 'Mariscos'
                  | 'Pescados'
                  | 'Verduras'
                  | 'Condimentos'
                  | 'Bebidas'
                  | 'Envases'
                  | 'Abarrotes',
              }));
            }}
            className="flex h-9 w-full sm:w-44 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Todos">
              Todas las Categorías
            </option>

            <option value="Mariscos">Mariscos</option>
            <option value="Pescados">Pescados</option>
            <option value="Verduras">Verduras</option>
            <option value="Condimentos">Condimentos</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Envases">Envases</option>
            <option value="Abarrotes">Abarrotes</option>
          </select>

          {/* MOSTRAR INACTIVOS */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs h-9">
            <Switch
              id="filtro-inactivos"
              checked={filtros.estado === 'Inactivo'}
              onCheckedChange={(checked) => {
                setPaginaActual(1);

                setFiltros((prev) => ({
                  ...prev,
                  estado: checked ? 'Inactivo' : 'Activo',
                }));
              }}
            />

            <Label
              htmlFor="filtro-inactivos"
              className="text-xs font-medium cursor-pointer select-none"
            >
              {filtros.estado === 'Inactivo'
                ? 'Mostrando Inactivos'
                : 'Mostrar Inactivos'}
            </Label>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <InsumosTable
        insumos={insumosPaginados}
        onEliminar={handleEliminar}
        onVerDetalle={setInsumoDetalle}
        onEditar={handleOpenEditar}
      />

      {/* PAGINACIÓN */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>
          Mostrando{' '}
          {insumos.length === 0
            ? 0
            : (paginaActual - 1) * elementosPorPagina + 1}{' '}
          a{' '}
          {Math.min(
            paginaActual * elementosPorPagina,
            insumos.length
          )}{' '}
          de {insumos.length} resultados
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() =>
              setPaginaActual((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={paginaActual === 1}
            className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <CaretLeftIcon size={16} />
          </button>

          <span className="font-medium text-foreground">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            type="button"
            onClick={() =>
              setPaginaActual((prev) =>
                Math.min(prev + 1, totalPaginas)
              )
            }
            disabled={paginaActual === totalPaginas}
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
        onSubmit={registrarInsumo}
      />

      {/* MODAL EDITAR */}
      <InsumoEditModal
        open={modalEditarOpen}
        onOpenChange={setModalEditarOpen}
        insumo={insumoSeleccionado}
        onSubmit={handleEditarSubmit}
      />

      <InsumoDetailModal
        open={insumoDetalle !== null}
        onOpenChange={(open) => {
          if (!open) setInsumoDetalle(null);
        }}
        insumo={insumoDetalle}
      />
    </div>
  );
}