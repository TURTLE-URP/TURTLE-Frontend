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
    stockActual: 332,
  },
  {
    id: 'ins-006',
    nombre: 'Tomate fresco',
    categoria: 'Verduras',
    unidadMedida: 'kg',
    stockActual: 12,
  },
  {
    id: 'ins-007',
    nombre: 'Filete de lenguado',
    categoria: 'Pescados y mariscos',
    unidadMedida: 'kg',
    stockActual: 24,
  },
  {
    id: 'ins-008',
    nombre: 'Langostinos',
    categoria: 'Pescados y mariscos',
    unidadMedida: 'kg',
    stockActual: 16,
  },
  {
    id: 'ins-009',
    nombre: 'Limón',
    categoria: 'Verduras',
    unidadMedida: 'kg',
    stockActual: 30,
  },
  {
    id: 'ins-010',
    nombre: 'Cebolla roja',
    categoria: 'Verduras',
    unidadMedida: 'kg',
    stockActual: 18,
  },
  {
    id: 'ins-011',
    nombre: 'Camote',
    categoria: 'Abarrotes',
    unidadMedida: 'kg',
    stockActual: 28,
  },
  {
    id: 'ins-012',
    nombre: 'Choclo',
    categoria: 'Abarrotes',
    unidadMedida: 'unidad',
    stockActual: 40,
  },
  {
    id: 'ins-013',
    nombre: 'Cerveza',
    categoria: 'Bebidas',
    unidadMedida: 'unidad',
    stockActual: 96,
  },
  {
    id: 'ins-014',
    nombre: 'Pisco',
    categoria: 'Bebidas',
    unidadMedida: 'litro',
    stockActual: 12,
  },
  {
    id: 'ins-015',
    nombre: 'Envases herméticos',
    categoria: 'Empaques',
    unidadMedida: 'unidad',
    stockActual: 240,
  },
  {
    id: 'ins-016',
    nombre: 'Cloro alimentario',
    categoria: 'Limpieza',
    unidadMedida: 'litro',
    stockActual: 8,
  },
]
