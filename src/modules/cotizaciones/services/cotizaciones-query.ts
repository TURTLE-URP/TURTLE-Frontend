import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createCotizacionesRepository } from './cotizaciones-repository'
import type { FiltrosCotizaciones } from '../interfaces/types'

const repository = createCotizacionesRepository()

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

export function useCotizacionesList(filtros: FiltrosCotizaciones) {
  return useQuery({
    queryKey: [
      'cotizaciones',
      {
        texto: filtros.texto,
        estado: filtros.estado,
        desde: filtros.desde,
        hasta: filtros.hasta,
        pagina: filtros.pagina,
      },
    ],
    queryFn: () => repository.listar(filtros),
    placeholderData: keepPreviousData,
  })
}
