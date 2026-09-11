import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createProveedoresRepository } from './proveedores-repository'
import type { EstadoProveedor, FiltrosProveedores, ProveedorInput } from './types'

const repository = createProveedoresRepository()

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

export function useProveedoresList(filtros: FiltrosProveedores) {
  return useQuery({
    queryKey: ['proveedores', { texto: filtros.texto, pagina: filtros.pagina }],
    queryFn: () => repository.listar(filtros),
    placeholderData: keepPreviousData,
  })
}

export function useDatosFiscales(ruc: string) {
  const rucLimpio = ruc.trim()
  const habilitado = /^\d{11}$/.test(rucLimpio)
  return useQuery({
    queryKey: ['datos-fiscales', rucLimpio],
    queryFn: () => repository.getDatosFiscales(rucLimpio),
    enabled: habilitado,
    retry: false,
    staleTime: 60_000,
  })
}

export function useCrearProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProveedorInput) => repository.crear(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}

export function useActualizarProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProveedorInput }) =>
      repository.actualizar(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}

export function useCambiarEstado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoProveedor }) =>
      repository.cambiarEstado(id, estado),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}