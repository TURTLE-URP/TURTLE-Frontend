import { safeRequest } from '@/shared/api/safe-request'
import type { EliminableResponse, SupplyResponse } from '../interfaces/insumo.dto'
import type {
  CriterioEliminacion,
  EvaluacionEliminarInsumo,
  InsumoResumenDelete,
} from '../interfaces/insumo.types'

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

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'string' ? Number(value) : (value as number)
  return Number.isFinite(n) ? n : fallback
}

export async function fetchInsumoResumen(
  insumoId: string,
  signal?: AbortSignal,
): Promise<InsumoResumenDelete> {
  const raw = await safeRequest<SupplyResponse>({
    method: 'GET',
    url: `/supplies/${insumoId}`,
    signal,
  })
  const stocks = Array.isArray(raw.stocks) ? raw.stocks : []
  const sumaStocks = stocks.reduce(
    (acc, s) => acc + toNumber((s as { stock_actual?: unknown }).stock_actual, 0),
    0,
  )
  const unidadBase = raw.unidad_base as { abreviatura?: unknown } | undefined
  return {
    codigo: typeof raw.codigo === 'string' ? raw.codigo : '',
    nombre: typeof raw.nombre === 'string' ? raw.nombre : '',
    stockTotal: toNumber(raw.stock_total, sumaStocks),
    numAlmacenes: stocks.length,
    unidad: typeof unidadBase?.abreviatura === 'string' ? unidadBase.abreviatura : '',
  }
}

export async function fetchEvaluacionEliminarInsumo(
  insumoId: string,
  signal?: AbortSignal,
): Promise<EvaluacionEliminarInsumo> {
  const raw = await safeRequest<EliminableResponse>({
    method: 'GET',
    url: `/supplies/${insumoId}/eliminable`,
    signal,
  })
  return {
    insumoId: String(raw.id_insumo ?? insumoId),
    stockTotal: 0,
    numAlmacenes: 0,
    criterios: (raw.criterios ?? []).map((c) => mapCriterio(c.criterio, c.cumple, c.detalle)),
  }
}
