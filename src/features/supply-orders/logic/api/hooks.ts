import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DISHES, INGREDIENTS, KPIS, ORDER_HISTORY, SUPPLIER_PRODUCTS } from '../__fixtures__'
import { calculate, calculateShortageItems, emitOrders, type EmitResult } from './mock'
import { fromCalculatedItems, fromCatalog, fromEmitResult, fromHistory, fromKpis } from './mappers'
import type { CalculateRequest, CatalogDto, EmitRequest } from './dtos'
import type { HistoryEntry, OrderItem, SupplyKpis } from '../types'

const CATALOG: CatalogDto = {
  ingredients: INGREDIENTS,
  dishes: DISHES,
  supplierProducts: SUPPLIER_PRODUCTS,
}

export function useSupplyOrders() {
  return useQuery<HistoryEntry[]>({
    queryKey: ['supply-orders'],
    queryFn: async () => fromHistory(ORDER_HISTORY),
  })
}

export function useKpis() {
  return useQuery<SupplyKpis>({
    queryKey: ['supply-orders', 'kpis'],
    queryFn: async () => fromKpis(KPIS),
  })
}

export function useCatalog() {
  return useQuery<CatalogDto>({
    queryKey: ['catalog'],
    queryFn: async () => fromCatalog(CATALOG),
  })
}

export function useCalculateItems() {
  return useMutation<OrderItem[], unknown, CalculateRequest>({
    mutationFn: async (request) => fromCalculatedItems(calculate(request)),
  })
}

export function useShortageItems() {
  return useQuery<OrderItem[]>({
    queryKey: ['supply-orders', 'shortage'],
    queryFn: async () => fromCalculatedItems(calculateShortageItems()),
  })
}

export function useEmitOrders() {
  const queryClient = useQueryClient()
  return useMutation<EmitResult, unknown, EmitRequest>({
    mutationFn: async (request) =>
      fromEmitResult(emitOrders(request.items, { modality: request.modality })),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['supply-orders'] })
    },
  })
}
