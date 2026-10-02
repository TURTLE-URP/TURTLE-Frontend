export type EstadoMesa = 'Activa' | 'Inactiva';
export type EstadoOcupacion = 'Libre' | 'Ocupada' | '—';

export interface Mesa {
  id: string;
  codigo: string;
  nro: number;
  piso: string;
  capacidad: number;
  ocupada: EstadoOcupacion;
  updated: string;
  estado: EstadoMesa;
}