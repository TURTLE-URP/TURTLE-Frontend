import { request } from '@/lib/http/http'
import { useAuthStore } from '@/stores/auth-store'
import type { CriterioEliminacion, EvaluacionEliminarInsumo, InsumoResumenDelete } from './types'
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
 * Jala el resumen del insumo para el encabezado del modal usando
 * GET /supplies/{id}. Sin VITE_API_BASE_URL lanza error (sin fallback a mock).
 */
type InsumoDetalleApi = Record<string, unknown> & {
  codigo?: string
  nombre?: string
  stock_total?: number | string
  stocks?: Array<{ stock_actual?: number | string }>
  unidad_base?: { abreviatura?: string }
}

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'string' ? Number(value) : (value as number)
  return Number.isFinite(n) ? n : fallback
}

export async function fetchInsumoResumen(
  insumoId: string,
  signal?: AbortSignal,
): Promise<InsumoResumenDelete> {
  const baseUrl = requireBaseUrl()
  const raw = await request<InsumoDetalleApi>(`/supplies/${insumoId}`, {
    baseUrl,
    headers: authHeaders(),
    signal,
  })
  const stocks = Array.isArray(raw.stocks) ? raw.stocks : []
  const sumaStocks = stocks.reduce((acc, s) => acc + toNumber(s.stock_actual, 0), 0)
  return {
    codigo: typeof raw.codigo === 'string' ? raw.codigo : '',
    nombre: typeof raw.nombre === 'string' ? raw.nombre : '',
    stockTotal: toNumber(raw.stock_total, sumaStocks),
    numAlmacenes: stocks.length,
    unidad:
      typeof raw.unidad_base?.abreviatura === 'string' && raw.unidad_base.abreviatura
        ? raw.unidad_base.abreviatura
        : '',
  }
}

/**
 * Elimina el insumo (borrado lógico) usando DELETE /supplies/{id}.
 * Sin VITE_API_BASE_URL lanza error (sin fallback a mock).
 */
export async function deleteInsumo(insumoId: string): Promise<void> {
  const baseUrl = requireBaseUrl()
  await request<void>(`/supplies/${insumoId}`, {
    method: 'DELETE',
    baseUrl,
    headers: authHeaders(),
  })
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
