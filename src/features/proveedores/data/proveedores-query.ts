import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createProveedoresRepository } from './proveedores-repository'
import type { FiltrosProveedores, ProveedorInput } from './types'

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

export function useDatosFiscales(ruc: string, opciones: { habilitado?: boolean } = {}) {
  const rucLimpio = ruc.trim()
  const habilitado = /^\d{11}$/.test(rucLimpio) && (opciones.habilitado ?? true)
  return useQuery({
    queryKey: ['datos-fiscales', rucLimpio],
    queryFn: () => repository.getDatosFiscales(rucLimpio),
    enabled: habilitado,
    retry: false,
    staleTime: 60_000,
  })
}

export function useExisteRuc(ruc: string, exceptoId?: string) {
  const rucLimpio = ruc.trim()
  const habilitado = /^\d{11}$/.test(rucLimpio)
  return useQuery({
    queryKey: ['proveedores', 'existe-ruc', rucLimpio, exceptoId ?? null],
    queryFn: () =>
      repository
        .listar({ texto: rucLimpio, pagina: 1, tamano: 10 })
        .then((listado) =>
          listado.items.some((p) => p.ruc === rucLimpio && p.id !== exceptoId),
        ),
    enabled: habilitado,
    retry: false,
    staleTime: 30_000,
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

export function useEliminarProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repository.eliminar(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}