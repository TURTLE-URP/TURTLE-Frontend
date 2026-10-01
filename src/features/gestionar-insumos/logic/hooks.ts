// src/features/gestionar-insumos/logic/hooks.ts
import { useState } from 'react';
import type { Insumo, InsumoFiltros, KpiInsumos } from './types';
import type { InsumoFormValues } from './schema';
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
    const texto = filtros.busqueda.toLowerCase();
 
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(texto) ||
      item.codigo.toLowerCase().includes(texto) ||
      item.descripcion.toLowerCase().includes(texto);
 
    const coincideCategoria =
      filtros.categoria === 'Todos' ||
      item.categorias.includes(filtros.categoria);
 
    const coincideEstadoStock =
      filtros.estadoStock === 'Todos' || item.nivelStock === filtros.estadoStock;
 
    const coincideEstado =
      filtros.estado === 'Todos' || item.estado === filtros.estado;
 
    return (
      coincideBusqueda &&
      coincideCategoria &&
      coincideEstadoStock &&
      coincideEstado
    );
  });
 
  const kpis: KpiInsumos = {
    total: insumos.length,
    activos: insumos.filter((i) => i.estado === 'Activo').length,
    stockBajo: insumos.filter(
      (i) => i.nivelStock === 'Bajo' && i.estado === 'Activo'
    ).length,
    criticos: insumos.filter(
      (i) => i.nivelStock === 'Critico' && i.estado === 'Activo'
    ).length,
  };
 
  const registrarInsumo = (data: InsumoFormValues) => {
    // El código se calcula a partir del mayor existente, así no se repite
    // aunque se hayan eliminado insumos.
    const maxCodigo = insumos.reduce((max, item) => {
      const num = parseInt(item.codigo.replace('INS-', ''), 10) || 0;
      return Math.max(max, num);
    }, 0);
    const nextCode = `INS-${String(maxCodigo + 1).padStart(4, '0')}`;
 
    let nivelStock: Insumo['nivelStock'] = 'OK';
    if (data.stockActual === 0) nivelStock = 'Critico';
    else if (data.stockActual <= data.stockMinimo) nivelStock = 'Bajo';
 
    const insumoCreado: Insumo = {
      id: crypto.randomUUID(),
      codigo: nextCode,
      nombre: data.nombre,
      descripcion: data.descripcion ?? '',
      categorias: [data.categoria],
      unidadMedida: data.unidadMedida,
      stockActual: data.stockActual,
      stockMinimo: data.stockMinimo,
      stockAbasto: data.stockAbasto,
      estado: 'Activo',
      nivelStock,
    };
 
    setInsumos((prev) => [insumoCreado, ...prev]);
  };
 
  const eliminarInsumo = (id: string) => {
    setInsumos((prev) => prev.filter((item) => item.id !== id));
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
    eliminarInsumo,
    activarInsumo,
  };
}
 