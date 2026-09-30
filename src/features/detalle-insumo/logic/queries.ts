import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMedida,
  fetchAlertas,
  fetchInsumoDetalle,
  fetchMedidas,
  removeAlertaAlmacen,
  removeAlertaGlobal,
  upsertAlertaAlmacen,
  upsertAlertaGlobal,
} from './api'
import type {
  CrearMedidaInput,
  UpsertAlertaAlmacenInput,
  UpsertAlertaGlobalInput,
} from './types'

export const insumoKeys = {
  detalle: (insumoId: string) => ['insumo', insumoId] as const,
  medidas: (insumoId: string) => ['insumo', insumoId, 'medidas'] as const,
  alertas: (insumoId: string) => ['insumo', insumoId, 'alertas'] as const,
}

export function useInsumoDetalle(insumoId: string) {
  return useQuery({
    queryKey: insumoKeys.detalle(insumoId),
    queryFn: ({ signal }) => fetchInsumoDetalle(insumoId, signal),
    enabled: !!insumoId,
  })
}

export function useMedidas(insumoId: string) {
  return useQuery({
    queryKey: insumoKeys.medidas(insumoId),
    queryFn: ({ signal }) => fetchMedidas(insumoId, signal),
    enabled: !!insumoId,
  })
}

export function useCrearMedida(insumoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CrearMedidaInput) => createMedida(insumoId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: insumoKeys.medidas(insumoId) })
    },
  })
}

export function useAlertas(insumoId: string) {
  return useQuery({
    queryKey: insumoKeys.alertas(insumoId),
    queryFn: ({ signal }) => fetchAlertas(insumoId, signal),
    enabled: !!insumoId,
  })
}

function useInvalidarAlertas(insumoId: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: insumoKeys.alertas(insumoId) })
}

export function useUpsertAlertaGlobal(insumoId: string) {
  const invalidar = useInvalidarAlertas(insumoId)
  return useMutation({
    mutationFn: (input: UpsertAlertaGlobalInput) => upsertAlertaGlobal(insumoId, input),
    onSuccess: () => {
      void invalidar()
    },
  })
}

export function useRemoveAlertaGlobal(insumoId: string) {
  const invalidar = useInvalidarAlertas(insumoId)
  return useMutation({
    mutationFn: () => removeAlertaGlobal(insumoId),
    onSuccess: () => {
      void invalidar()
    },
  })
}

export function useUpsertAlertaAlmacen(insumoId: string) {
  const invalidar = useInvalidarAlertas(insumoId)
  return useMutation({
    mutationFn: (input: UpsertAlertaAlmacenInput) => upsertAlertaAlmacen(insumoId, input),
    onSuccess: () => {
      void invalidar()
    },
  })
}

export function useRemoveAlertaAlmacen(insumoId: string) {
  const invalidar = useInvalidarAlertas(insumoId)
  return useMutation({
    mutationFn: (almacenId: number) => removeAlertaAlmacen(insumoId, almacenId),
    onSuccess: () => {
      void invalidar()
    },
  })
}
