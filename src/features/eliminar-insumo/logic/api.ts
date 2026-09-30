import { request } from '@/lib/http/http'
import { useAuthStore } from '@/stores/auth-store'
import type { CriterioEliminacion, EvaluacionEliminarInsumo } from './types'
import type { EliminableApi } from '@/features/detalle-insumo/logic/types'

function requireBaseUrl(): string {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL no configurado. Configura la URL del API (ej. http://localhost:3000).')
  }
  return baseUrl
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().session?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const TITULOS_CRITERIO: Record<string, string> = {
  stock_en_cero: 'Stock en cero en todos los almacenes',
  sin_ordenes_pendientes: 'Sin órdenes de abasto pendientes',
  sin_recetas_activas: 'Sin recetas activas',
}

function mapCriterio(criterio: string, cumple: boolean, detalle: string): CriterioEliminacion {
  return {
    id: criterio,
    titulo: TITULOS_CRITERIO[criterio] ?? criterio,
    cumple,
    ...(detalle ? { detalle } : {}),
  }
}

/**
 * Evalúa si un insumo puede eliminarse usando GET /supplies/{id}/eliminable.
 * Sin VITE_API_BASE_URL lanza error (sin fallback a mock).
 */
export async function fetchEvaluacionEliminarInsumo(
  insumoId: string,
  signal?: AbortSignal,
): Promise<EvaluacionEliminarInsumo> {
  const baseUrl = requireBaseUrl()
  const raw = await request<EliminableApi>(`/supplies/${insumoId}/eliminable`, {
    baseUrl,
    headers: authHeaders(),
    signal,
  })
  return {
    insumoId: String(raw.id_insumo ?? insumoId),
    stockTotal: 0,
    numAlmacenes: 0,
    criterios: (raw.criterios ?? []).map((c) => mapCriterio(c.criterio, c.cumple, c.detalle)),
  }
}
