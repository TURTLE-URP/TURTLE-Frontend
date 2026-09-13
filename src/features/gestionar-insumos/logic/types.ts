export type CategoriaInsumo =
  | 'Mariscos'
  | 'Pescados'
  | 'Verduras'
  | 'Condimentos'
  | 'Bebidas'
  | 'Envases'
  | 'Abarrotes';

export type EstadoInsumo = 'Activo' | 'Inactivo';

export type NivelStock = 'OK' | 'Bajo' | 'Critico';

export interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaInsumo;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  stockAbasto: number;
  estado: EstadoInsumo;
  nivelStock: NivelStock;
  imagenUrl?: string;
}

export interface InsumoFiltros {
  busqueda: string;
  categoria: CategoriaInsumo | 'Todos';
  estadoStock: NivelStock | 'Todos';
  estado: EstadoInsumo | 'Todos';
}

export interface KpiInsumos {
  total: number;
  activos: number;
  stockBajo: number;
  criticos: number;
}