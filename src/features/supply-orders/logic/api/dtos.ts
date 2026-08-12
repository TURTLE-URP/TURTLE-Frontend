import type {
  Dish,
  HistoryEntry,
  Ingredient,
  OrderItem,
  SendStatus,
  SingleOrder,
} from '../types'

export type CalculateRequest =
  | { modality: 'platillos'; dishQtys: Record<string, number> }
  | { modality: 'escasez' }
  | { modality: 'libre'; quantities: Record<string, number> }

export interface EmitRequest {
  items: OrderItem[]
  modality?: string
}

export interface EmitResponseDto {
  orders: SingleOrder[]
  sendStatus: Record<string, SendStatus>
}

export interface CatalogDto {
  ingredients: Ingredient[]
  dishes: Dish[]
  supplierProducts: SupplierProductDto[]
}

export interface SupplierProductDto {
  id: string
  name: string
  supplierId: string
  supplierName: string
  contact: string
  unit: string
  unitCost: number
  ingredientId: string
}

export interface KpisDto {
  ordersMonth: number
  pendingAgreements: number
  spendPeriod: number
  shortageIngredients: number
}

export type HistoryDto = HistoryEntry[]

export type CalculatedItemsDto = OrderItem[]
