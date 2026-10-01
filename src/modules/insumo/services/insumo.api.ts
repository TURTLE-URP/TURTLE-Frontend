import axiosInstance from '@/shared/api/axios.config'
import type {
  AlertaStock,
  CrearMedidaInput,
  InsumoDetalle,
  MedidaAlterna,
  UpsertAlertaAlmacenInput,
  UpsertAlertaGlobalInput,
} from '../interfaces/insumo.types'

// TODO(auth): reemplazar por el id real del usuario en sesión cuando el
// backend lo provea. Valor temporal acordado.
const USUARIO_SISTEMA_ID = 999999

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'string' ? Number(value) : (value as number)
  return Number.isFinite(n) ? n : fallback
}

function toStringId(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value) return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return fallback
}

// ---------------------------------------------------------------------------
// Detalle del insumo: GET /supplies/{id}
// ---------------------------------------------------------------------------

type InsumoDetalleApi = Record<string, unknown> & {
  id?: number | string
  codigo?: string
  nombre?: string
  descripcion?: string | null
  categoria?: string
  unidad_medida?: string
  unidadMedida?: string
  unidad?: string
  stock_actual?: number
  stockActual?: number
  stock_minimo?: number
  stockMinimo?: number
  estado?: string
  activo?: boolean
}

function mapInsumoDetalle(raw: InsumoDetalleApi, insumoId: string): InsumoDetalle {
  const stockActual = toNumber(raw.stock_actual ?? raw.stockActual, 0)
  const stockMinimo = toNumber(raw.stock_minimo ?? raw.stockMinimo, 0)
  const unidadMedida =
    (typeof raw.unidad_medida === 'string' && raw.unidad_medida) ||
    (typeof raw.unidadMedida === 'string' && raw.unidadMedida) ||
    (typeof raw.unidad === 'string' && raw.unidad) ||
    ''
  const estadoRaw = typeof raw.estado === 'string' ? raw.estado.toLowerCase() : ''
  const estado: InsumoDetalle['estado'] =
    estadoRaw === 'inactivo' || raw.activo === false ? 'Inactivo' : 'Activo'
  return {
    id: toStringId(raw.id, insumoId),
    codigo: typeof raw.codigo === 'string' ? raw.codigo : '',
    nombre: typeof raw.nombre === 'string' ? raw.nombre : '',
    descripcion:
      typeof raw.descripcion === 'string' && raw.descripcion ? raw.descripcion : undefined,
    categoria: typeof raw.categoria === 'string' ? raw.categoria : '',
    unidadMedida,
    stockActual,
    stockMinimo,
    estado,
  }
}

export async function fetchInsumoDetalle(insumoId: string, signal?: AbortSignal): Promise<InsumoDetalle> {
  const { data } = await axiosInstance.get<InsumoDetalleApi>(`/supplies/${insumoId}`, { signal })
  return mapInsumoDetalle(data, insumoId)
}

// ---------------------------------------------------------------------------
// Medidas alternas: GET / POST /supplies/{id}/medidas
// ---------------------------------------------------------------------------

type MedidaApi = Record<string, unknown> & {
  id?: number | string
  nombre?: string
  abreviatura?: string
  factor_a_base?: number | string
  factorABase?: number | string
  uso?: string
}

function mapMedida(raw: MedidaApi, fallbackId: string): MedidaAlterna {
  const factor = toNumber(raw.factor_a_base ?? raw.factorABase, 0)
  const esBase = factor === 1
  return {
    id: toStringId(raw.id, fallbackId),
    nombre: typeof raw.nombre === 'string' ? raw.nombre : '',
    abreviatura: typeof raw.abreviatura === 'string' ? raw.abreviatura : '',
    factorABase: factor,
    uso: typeof raw.uso === 'string' ? raw.uso : '',
    ...(esBase ? { esBase: true as const } : {}),
  }
}

export async function fetchMedidas(insumoId: string, signal?: AbortSignal): Promise<MedidaAlterna[]> {
  const { data } = await axiosInstance.get<MedidaApi[] | { items?: MedidaApi[] }>(
    `/supplies/${insumoId}/medidas`,
    { signal },
  )
  const lista = Array.isArray(data) ? data : (data.items ?? [])
  return lista.map((m, i) => mapMedida(m, `medida-${i}`))
}

export async function createMedida(insumoId: string, input: CrearMedidaInput): Promise<MedidaAlterna> {
  const { data } = await axiosInstance.post<MedidaApi>(`/supplies/${insumoId}/medidas`, {
    nombre: input.nombre,
    abreviatura: input.abreviatura,
    factor_a_base: input.factorABase,
    uso: input.uso,
  })
  return mapMedida(data, `medida-${Date.now()}`)
}

// ---------------------------------------------------------------------------
// Alertas de stock
// ---------------------------------------------------------------------------

type AlertaGlobalApi = Record<string, unknown> & {
  stock_min?: number
  stockMin?: number
  minimo?: number
  stock_deseado?: number | null
  stockDeseado?: number | null
  cantidad_reponer?: number | null
  cantidadAReponer?: number | null
}

type AlertaAlmacenApi = Record<string, unknown> & {
  id_almacen?: number
  almacenId?: number
  id?: number
  minimo_alerta?: number
  minimo?: number
  cantidad_reponer?: number | null
  cantidadAReponer?: number | null
}

type AlertasApi = Record<string, unknown> & {
  global?: AlertaGlobalApi | null
  porAlmacen?: AlertaAlmacenApi[]
  por_almacen?: AlertaAlmacenApi[]
  almacenes?: AlertaAlmacenApi[]
  alertas?: AlertaAlmacenApi[]
}

export function formatoAlcanceAlmacen(idAlmacen: number): string {
  return `ALM-${String(idAlmacen).padStart(3, '0')}`
}

export function parseIdAlmacen(alcance: string): number | null {
  const limpio = alcance.trim().toUpperCase()
  const conPrefijo = /^ALM-(\d+)$/.exec(limpio)
  if (conPrefijo) return Number(conPrefijo[1])
  if (/^\d+$/.test(limpio)) return Number(limpio)
  return null
}

export function esAlcanceGlobal(alcance: string): boolean {
  return alcance.trim().toUpperCase() === 'GLOBAL'
}

function mapAlertaGlobal(raw: AlertaGlobalApi): AlertaStock {
  const minimo = toNumber(raw.stock_min ?? raw.stockMin ?? raw.minimo, 0)
  const reponer: unknown =
    raw.stock_deseado ?? raw.stockDeseado ?? raw.cantidad_reponer ?? raw.cantidadAReponer
  return {
    id: 'global',
    alcance: 'GLOBAL',
    minimo,
    ...(reponer === null || reponer === undefined || reponer === ''
      ? {}
      : { cantidadAReponer: toNumber(reponer, 0) }),
    esGlobal: true,
  }
}

function mapAlertaAlmacen(raw: AlertaAlmacenApi, index: number): AlertaStock {
  const idAlmacen = toNumber(raw.id_almacen ?? raw.almacenId ?? raw.id, NaN)
  const idValido = Number.isFinite(idAlmacen) ? idAlmacen : index + 1
  const minimo = toNumber(raw.minimo_alerta ?? raw.minimo, 0)
  const reponer: unknown = raw.cantidad_reponer ?? raw.cantidadAReponer
  return {
    id: `alm-${idValido}`,
    alcance: formatoAlcanceAlmacen(idValido),
    minimo,
    ...(reponer === null || reponer === undefined || reponer === ''
      ? {}
      : { cantidadAReponer: toNumber(reponer, 0) }),
    idAlmacen: idValido,
    esGlobal: false,
  }
}

function listaAlmacenes(raw: AlertasApi): AlertaAlmacenApi[] {
  if (Array.isArray(raw.porAlmacen)) return raw.porAlmacen
  if (Array.isArray(raw.por_almacen)) return raw.por_almacen
  if (Array.isArray(raw.almacenes)) return raw.almacenes
  if (Array.isArray(raw.alertas)) return raw.alertas
  return []
}

export async function fetchAlertas(insumoId: string, signal?: AbortSignal): Promise<AlertaStock[]> {
  const { data } = await axiosInstance.get<AlertasApi>(`/supplies/${insumoId}/alertas`, { signal })
  const filas: AlertaStock[] = []
  if (data.global) filas.push(mapAlertaGlobal(data.global))
  listaAlmacenes(data).forEach((a, i) => filas.push(mapAlertaAlmacen(a, i)))
  return filas
}

export async function upsertAlertaGlobal(
  insumoId: string,
  input: UpsertAlertaGlobalInput,
): Promise<void> {
  await axiosInstance.put(`/supplies/${insumoId}/alertas/global`, {
    stock_min: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { stock_deseado: input.cantidadAReponer }),
    usuario_id: USUARIO_SISTEMA_ID,
  })
}

export async function removeAlertaGlobal(insumoId: string): Promise<void> {
  await axiosInstance.delete(`/supplies/${insumoId}/alertas/global`)
}

export async function upsertAlertaAlmacen(
  insumoId: string,
  input: UpsertAlertaAlmacenInput,
): Promise<void> {
  await axiosInstance.put(`/supplies/${insumoId}/alertas/almacen`, {
    id_almacen: input.idAlmacen,
    minimo_alerta: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { cantidad_reponer: input.cantidadAReponer }),
    usuario_id: USUARIO_SISTEMA_ID,
  })
}

export async function removeAlertaAlmacen(insumoId: string, almacenId: number): Promise<void> {
  await axiosInstance.delete(`/supplies/${insumoId}/alertas/almacen/${almacenId}`)
}
