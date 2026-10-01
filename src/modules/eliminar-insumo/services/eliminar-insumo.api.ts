import axiosInstance from '@/shared/api/axios.config'
import type { EliminableApi } from '@/modules/detalle-insumo/interfaces/types'
import type { CriterioEliminacion, EvaluacionEliminarInsumo, InsumoResumenDelete } from '../interfaces/types'

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
  const { data: raw } = await axiosInstance.get<InsumoDetalleApi>(`/supplies/${insumoId}`, {
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

export async function deleteInsumo(insumoId: string): Promise<void> {
  await axiosInstance.delete(`/supplies/${insumoId}`)
}

export async function fetchEvaluacionEliminarInsumo(
  insumoId: string,
  signal?: AbortSignal,
): Promise<EvaluacionEliminarInsumo> {
  const { data: raw } = await axiosInstance.get<EliminableApi>(
    `/supplies/${insumoId}/eliminable`,
    { signal },
  )
  return {
    insumoId: String(raw.id_insumo ?? insumoId),
    stockTotal: 0,
    numAlmacenes: 0,
    criterios: (raw.criterios ?? []).map((c) => mapCriterio(c.criterio, c.cumple, c.detalle)),
  }
}
