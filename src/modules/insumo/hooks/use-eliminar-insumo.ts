import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteInsumo, fetchEvaluacionEliminarInsumo, fetchInsumoResumen } from '../services/eliminar-insumo.api'

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

export function useEliminarInsumo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (insumoId: string) => deleteInsumo(insumoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['insumos'] })
      void queryClient.invalidateQueries({ queryKey: ['supplies'] })
    },
  })
}
