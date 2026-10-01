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

export const MOCK_MESAS: Mesa[] = [
  { id: '1', codigo: 'M-01', nro: 1, piso: 'piso_1', capacidad: 4, ocupada: 'Libre', updated: '20/09 jefe', estado: 'Activa' },
  { id: '2', codigo: 'M-07', nro: 7, piso: 'piso_2', capacidad: 6, ocupada: 'Ocupada', updated: '21/09 jefe', estado: 'Activa' },
  { id: '3', codigo: 'M-12', nro: 12, piso: 'piso_1', capacidad: 2, ocupada: 'Libre', updated: '19/09 admin', estado: 'Activa' },
  { id: '4', codigo: 'M-09', nro: 9, piso: 'piso_1', capacidad: 2, ocupada: '—', updated: '18/09', estado: 'Inactiva' },
];