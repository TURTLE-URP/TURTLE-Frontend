import type { AlertaStock, MedidaAlterna } from './types'

export const MOCK_MEDIDAS_ALTERNAS: MedidaAlterna[] = [
  { id: 'base', nombre: 'Kilogramo', abreviatura: 'Kg', factorABase: 1, uso: 'Todo', esBase: true },
  { id: 'm1', nombre: 'taza', abreviatura: 'Tz', factorABase: 0.25, uso: 'Cocina' },
  { id: 'm2', nombre: 'saco', abreviatura: 'saco', factorABase: 50, uso: 'Productos de proveedor' },
]

export const MOCK_ALERTAS_STOCK: AlertaStock[] = [
  { id: 'a1', alcance: 'GLOBAL', minimo: 14, cantidadAReponer: 28 },
  { id: 'a2', alcance: 'ALM-005', minimo: 5, cantidadAReponer: 10 },
]
