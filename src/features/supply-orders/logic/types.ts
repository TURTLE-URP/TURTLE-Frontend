export type OrderStatus = 'Emitida' | 'Pendiente' | 'Acordada' | 'Entregada' | 'Error'

export type Modality = 'platillos' | 'escasez' | 'libre'

export type WizardStep = 'modality' | 'configure' | 'assign' | 'summary' | 'done'

export type SendStatus = 'sent' | 'error'

export type Role = 'admin' | 'staff'

export interface Ingredient {
  id: string
  name: string
  unit: string
  currentStock: number
  desiredStock: number
  category: string
}

export interface RecipeLine {
  ingredientId: string
  qty: number
}

export interface Dish {
  id: string
  name: string
  ingredients: RecipeLine[]
}

export interface SupplierProduct {
  id: string
  name: string
  supplierId: string
  supplierName: string
  contact: string
  unit: string
  unitCost: number
  ingredientId: string
}

export interface OrderItem {
  ingredient: Ingredient
  qty: number
  selectedProduct?: SupplierProduct
}

export interface SingleOrder {
  id: string
  supplier: string
  date: string
  status: OrderStatus
  total: number
  products: number
}

export interface OrderGroup {
  groupId: string
  date: string
  modality: string
  orders: SingleOrder[]
}

export type HistoryEntry = OrderGroup | SingleOrder

export interface SupplyKpis {
  ordersMonth: number
  pendingAgreements: number
  spendPeriod: number
  shortageIngredients: number
}

export interface ApiError {
  status: number
  message: string
}

export function isGroup(entry: HistoryEntry): entry is OrderGroup {
  return 'groupId' in entry
}
