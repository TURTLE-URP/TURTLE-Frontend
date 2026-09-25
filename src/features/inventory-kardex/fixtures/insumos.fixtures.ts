import type { Insumo } from '../types'

/**
 * Mock supply catalog used while there is no backend wired up. Kept separate
 * from the movements fixture so either can be imported independently.
 */
export const INSUMOS_FIXTURE: Insumo[] = [
  {
    id: 'ins-001',
    nombre: 'Harina de trigo',
    categoria: 'Abarrotes',
    unidadMedida: 'kg',
    stockActual: 42,
  },
  {
    id: 'ins-002',
    nombre: 'Aceite vegetal',
    categoria: 'Abarrotes',
    unidadMedida: 'litro',
    stockActual: 18,
  },
  {
    id: 'ins-003',
    nombre: 'Pechuga de pollo',
    categoria: 'Carnes',
    unidadMedida: 'kg',
    stockActual: 25,
  },
  {
    id: 'ins-004',
    nombre: 'Queso mozzarella',
    categoria: 'Lácteos',
    unidadMedida: 'kg',
    stockActual: 7,
  },
  {
    id: 'ins-005',
    nombre: 'Cajas para delivery',
    categoria: 'Empaques',
    unidadMedida: 'unidad',
    stockActual: 340,
  },
  {
    id: 'ins-006',
    nombre: 'Tomate fresco',
    categoria: 'Verduras',
    unidadMedida: 'kg',
    stockActual: 12,
  },
]
