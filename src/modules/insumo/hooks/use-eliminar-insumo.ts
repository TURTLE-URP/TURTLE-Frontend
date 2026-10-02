import { useQuery } from '@tanstack/react-query'
import { fetchEvaluacionEliminarInsumo, fetchInsumoResumen } from '../services/eliminar-insumo.api'

export function useEvaluacionEliminarInsumo(insumoId: string | undefined, habilitado: boolean) {
  return useQuery({
    queryKey: ['evaluacion-eliminar-insumo', insumoId],
    queryFn: ({ signal }) => fetchEvaluacionEliminarInsumo(insumoId as string, signal),
    enabled: habilitado && !!insumoId,
  })
}

export function useInsumoResumen(insumoId: string | undefined, habilitado: boolean) {
  return useQuery({
    queryKey: ['insumo-resumen', insumoId],
    queryFn: ({ signal }) => fetchInsumoResumen(insumoId as string, signal),
    enabled: habilitado && !!insumoId,
  })
}

