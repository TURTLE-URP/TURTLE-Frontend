import { useQuery } from '@tanstack/react-query'
import { fetchEvaluacionEliminarInsumo } from './api'

export function useEvaluacionEliminarInsumo(insumoId: string | undefined, habilitado: boolean) {
  return useQuery({
    queryKey: ['evaluacion-eliminar-insumo', insumoId],
    queryFn: () => fetchEvaluacionEliminarInsumo(insumoId as string),
    enabled: habilitado && !!insumoId,
  })
}