/** A stock item (ingredient/supply) tracked in inventory. */
export interface Insumo {
  id: string
  nombre: string
  categoria: string
  /** e.g. 'kg', 'litro', 'unidad'. */
  unidadMedida: string
  stockActual: number
}

/** The three kinds of stock movement this Kardex records. */
export type MovementType = 'entrada' | 'salida' | 'merma'

export interface KardexMovement {
  id: string
  insumoId: string
  tipo: MovementType
  /** Always a positive quantity; `tipo` determines the sign of its effect. */
  cantidad: number
  /** Stock level immediately after this movement was applied. */
  saldoResultante: number
  /** ISO 8601 date-time string, e.g. "2026-03-14T09:30:00". */
  fecha: string
  responsable: string
  /** Reference document: purchase order, invoice, delivery note, etc. */
  documento: string
  motivo: string
}
