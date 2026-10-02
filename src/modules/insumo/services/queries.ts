import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createInsumo,
  createMedida,
  deleteInsumoBackend,
  deleteMedida,
  fetchAlertas,
  fetchInsumoDetalle,
  fetchInsumos,
  fetchMedidas,
  fetchUnidadesBase,
  removeAlertaAlmacen,
  removeAlertaGlobal,
  updateInsumo,
  updateMedida,
  upsertAlertaAlmacen,
  upsertAlertaGlobal,
  type ActualizarInsumoInput,
  type ActualizarMedidaInput,
  type CrearInsumoInput,
} from './insumo.api'
import type {
  CrearMedidaInput,
  UpsertAlertaAlmacenInput,
  UpsertAlertaGlobalInput,
} from '../interfaces/insumo.types'

export const insumosKeys = {
  list: (search?: string, page?: number) => ['insumos', { search: search ?? '', page: page ?? 1 }] as const,
}

function useInvalidarListado() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['insumos'] })
}

export function useInsumosList(search?: string, page?: number) {
  return useQuery({
    queryKey: insumosKeys.list(search, page),
    queryFn: ({ signal }) => fetchInsumos({ search, page, signal }),
  })
}

/** Catálogo de unidades base para los selects (se cachea; cambia poco). */
export function useUnidadesBase() {
  return useQuery({
    queryKey: ['insumos', 'unidades-base'],
    queryFn: ({ signal }) => fetchUnidadesBase(undefined, signal),
    staleTime: 5 * 60_000,
  })
}

export function useCrearInsumo() {
  const invalidar = useInvalidarListado()
  return useMutation({
    mutationFn: (input: CrearInsumoInput) => createInsumo(input),
    onSuccess: () => {
      void invalidar()
    },
  })
}

export function useActualizarInsumo() {
  const invalidar = useInvalidarListado()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ActualizarInsumoInput }) =>
      updateInsumo(id, input),
    onSuccess: () => {
      void invalidar()
    },
  })
}

export function useEliminarInsumoBackend() {
  const invalidar = useInvalidarListado()
  return useMutation({
    mutationFn: (id: string) => deleteInsumoBackend(id),
    onSuccess: () => {
      void invalidar()
    },
  })
}

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

export function useActualizarMedida(insumoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ medidaId, input }: { medidaId: string; input: ActualizarMedidaInput }) =>
      updateMedida(insumoId, medidaId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: insumoKeys.medidas(insumoId) })
    },
  })
}

export function useEliminarMedida(insumoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (medidaId: string) => deleteMedida(insumoId, medidaId),
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
