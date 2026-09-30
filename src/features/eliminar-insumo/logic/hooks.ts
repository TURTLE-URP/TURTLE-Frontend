import { useQuery } from '@tanstack/react-query'
import { fetchEvaluacionEliminarInsumo } from './api'

export function useEvaluacionEliminarInsumo(insumoId: string | undefined, habilitado: boolean) {
  return useQuery({
    queryKey: ['evaluacion-eliminar-insumo', insumoId],
    queryFn: ({ signal }) => fetchEvaluacionEliminarInsumo(insumoId as string, signal),
    enabled: habilitado && !!insumoId,
  })
}