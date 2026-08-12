import type { HistoryEntry, OrderStatus, OrderItem, SendStatus, SingleOrder } from '../types'
import type { CatalogDto, EmitResponseDto, KpisDto } from './dtos'
import { ApiError } from './client'
import type { OrderGroup } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNonNegative(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'Emitida' || value === 'Pendiente' || value === 'Acordada' || value === 'Entregada' || value === 'Error'
}

function isSendStatus(value: unknown): value is SendStatus {
  return value === 'sent' || value === 'error'
}

function isIngredient(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.unit === 'string' &&
    isNonNegative(value.currentStock) &&
    isNonNegative(value.desiredStock) &&
    typeof value.category === 'string'
  )
}

function isOrderItem(value: unknown): value is OrderItem {
  if (!isRecord(value) || !isIngredient(value.ingredient) || !(isFiniteNumber(value.qty) && value.qty > 0)) {
    return false
  }
  return value.selectedProduct === undefined || isSupplierProduct(value.selectedProduct)
}

function isSupplierProduct(value: unknown): boolean {
  if (!isRecord(value)) {
    return false
  }
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.supplierId === 'string' &&
    typeof value.supplierName === 'string' &&
    typeof value.contact === 'string' &&
    typeof value.unit === 'string' &&
    isNonNegative(value.unitCost) &&
    typeof value.ingredientId === 'string'
  )
}

function isSingleOrder(value: unknown): value is SingleOrder {
  if (!isRecord(value)) {
    return false
  }
  return (
    typeof value.id === 'string' &&
    typeof value.supplier === 'string' &&
    typeof value.date === 'string' &&
    isOrderStatus(value.status) &&
    isNonNegative(value.total) &&
    isFiniteNumber(value.products)
  )
}

function isOrderGroup(value: unknown): value is OrderGroup {
  if (!isRecord(value) || typeof value.groupId !== 'string' || typeof value.date !== 'string' || typeof value.modality !== 'string') {
    return false
  }
  return Array.isArray(value.orders) && value.orders.every((o) => isSingleOrder(o))
}

function fail(message: string): never {
  throw new ApiError(422, message)
}

export function fromCalculatedItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value) || !value.every((item) => isOrderItem(item))) {
    fail('Invalid calculated items payload')
  }
  return value
}

export function fromKpis(value: unknown): KpisDto {
  if (
    !isRecord(value) ||
    !isNonNegative(value.ordersMonth) ||
    !isNonNegative(value.pendingAgreements) ||
    !isNonNegative(value.spendPeriod) ||
    !isNonNegative(value.shortageIngredients)
  ) {
    fail('Invalid KPIs payload')
  }
  return value as unknown as KpisDto
}

export function fromCatalog(value: unknown): CatalogDto {
  if (
    !isRecord(value) ||
    !Array.isArray(value.ingredients) ||
    !Array.isArray(value.dishes) ||
    !Array.isArray(value.supplierProducts)
  ) {
    fail('Invalid catalog payload')
  }
  return value as unknown as CatalogDto
}

export function fromHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value) || !value.every((entry) => isSingleOrder(entry) || isOrderGroup(entry))) {
    fail('Invalid history payload')
  }
  return value as HistoryEntry[]
}

export function fromEmitResult(value: unknown): EmitResponseDto & { group: OrderGroup } {
  if (
    !isRecord(value) ||
    !Array.isArray(value.orders) ||
    !value.orders.every((o) => isSingleOrder(o)) ||
    !isRecord(value.sendStatus) ||
    !Object.values(value.sendStatus).every((s) => isSendStatus(s)) ||
    !isOrderGroup(value.group)
  ) {
    fail('Invalid emit result payload')
  }
  return value as unknown as EmitResponseDto & { group: OrderGroup }
}
