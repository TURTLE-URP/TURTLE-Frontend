// src/features/gestionar-insumos/logic/api/hooks.ts
import { useMemo, useState } from 'react';
import type { Insumo, InsumoFiltros, KpiInsumos } from './types';
import type { InsumoFormValues } from './schema';
import { MOCK_INSUMOS } from './mock';
import { normalizar } from './etiquetas';


// TODO: el prefijo saldrá del módulo de configuración de sistema.
const CODIGO_PREFIJO = 'INS';
const generarCodigo = (correlativo: number) =>
  `${CODIGO_PREFIJO}-${String(correlativo).padStart(4, '0')}`;

export function useInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>(MOCK_INSUMOS);
  const [filtros, setFiltros] = useState<InsumoFiltros>({
    busqueda: '',
    categoria: 'Todos',
    estadoStock: 'Todos',
    estado: 'Todos',
  });

  const [etiquetasExtra, setEtiquetasExtra] = useState<string[]>([]);
  const etiquetasDisponibles = useMemo(() => {
    const vistas = new Map<string, string>();
    [...insumos.flatMap((i) => i.etiquetas ?? []), ...etiquetasExtra].forEach((t) => {
      const clave = normalizar(t);
      if (clave && !vistas.has(clave)) vistas.set(clave, t);
    });
    return [...vistas.values()].sort((a, b) => a.localeCompare(b, 'es'));
  }, [insumos, etiquetasExtra]);

  const agregarEtiqueta = (etiqueta: string) => {
    const nueva = etiqueta.trim();
    if (!nueva) return;
    setEtiquetasExtra((prev) =>
      prev.some((t) => normalizar(t) === normalizar(nueva)) ? prev : [...prev, nueva],
    );
  };

  const insumosFiltrados = insumos.filter((item) => {
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (item.proveedor ?? '').toLowerCase().includes(filtros.busqueda.toLowerCase());

    const coincideCategoria =
      filtros.categoria === 'Todos' || item.categoria === filtros.categoria;

    const coincideEstadoStock =
      filtros.estadoStock === 'Todos' || item.nivelStock === filtros.estadoStock;

    const coincideEstado =
      filtros.estado === 'Todos' || item.estado === filtros.estado;

    return (
      coincideBusqueda && coincideCategoria && coincideEstadoStock && coincideEstado
    );
  });

  const kpis: KpiInsumos = {
    total: insumos.length,
    activos: insumos.filter((i) => i.estado === 'Activo').length,
    stockBajo: insumos.filter((i) => i.nivelStock === 'Bajo' && i.estado === 'Activo').length,
    criticos: insumos.filter((i) => i.nivelStock === 'Critico' && i.estado === 'Activo').length,
  };

 const registrarInsumo = (nuevo: InsumoFormValues) => {
    const nextId = (insumos.length + 1).toString();

    // Stock y nivel de stock se gestionarán desde Almacén; por ahora inician en 0.
    const insumoCreado: Insumo = {
      ...nuevo,
      etiquetas: nuevo.etiquetas ?? [],
      id: nextId,
      codigo: generarCodigo(insumos.length + 1),
      estado: 'Activo',
      stockActual: 0,
      stockMinimo: 0,
      stockAbasto: 0,
      nivelStock: 'OK',
    };

    setInsumos((prev) => [insumoCreado, ...prev]);
  };

  const editarInsumo = (id: string, datos: InsumoFormValues) => {
    setInsumos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...datos, etiquetas: datos.etiquetas ?? [] }
          : item
      )
    );
  };

  const inactivarInsumo = (id: string) => {
    setInsumos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: 'Inactivo' as const } : item
      )
    );
  };

  const activarInsumo = (id: string) => {
  setInsumos((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, estado: 'Activo' as const } : item
    )
  );
};

  return {
    insumos: insumosFiltrados,
    kpis,
    filtros,
    setFiltros,
    registrarInsumo,
    editarInsumo,
    inactivarInsumo,
    activarInsumo,
    etiquetasDisponibles,   // <- nuevo
    agregarEtiqueta,        // <- nuevo
  };
}