// src/features/gestionar-insumos/logic/api/hooks.ts
import { useState } from 'react';
import type { Insumo, InsumoFiltros, KpiInsumos } from './types';
import { MOCK_INSUMOS } from './mock';

export function useInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>(MOCK_INSUMOS);
  const [filtros, setFiltros] = useState<InsumoFiltros>({
    busqueda: '',
    categoria: 'Todos',
    estadoStock: 'Todos',
    estado: 'Todos',
  });

  const insumosFiltrados = insumos.filter((item) => {
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      item.codigo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      item.proveedor.toLowerCase().includes(filtros.busqueda.toLowerCase());

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

  const registrarInsumo = (nuevo: Omit<Insumo, 'id' | 'codigo' | 'nivelStock' | 'estado'>) => {
    const nextId = (insumos.length + 1).toString();
    const nextCode = `INS-${nextId.padStart(4, '0')}`;
    
    let nivelStock: Insumo['nivelStock'] = 'OK';
    if (nuevo.stockActual === 0) nivelStock = 'Critico';
    else if (nuevo.stockActual <= nuevo.stockMinimo) nivelStock = 'Bajo';

    const insumoCreado: Insumo = {
      ...nuevo,
      id: nextId,
      codigo: nextCode,
      estado: 'Activo',
      nivelStock,
    };

    setInsumos([insumoCreado, ...insumos]);
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
    inactivarInsumo,
    activarInsumo,
  };
}