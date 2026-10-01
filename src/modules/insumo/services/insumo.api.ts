import { safePagination, safeRequest } from '@/shared/api/safe-request'
import type {
  AlertasResponse,
  AlertaAlmacenResponse,
  AlertaGlobalResponse,
  CreateMedidaDto,
  CreateSupplyDto,
  EliminableResponse,
  MedidaResponse,
  SupplyDeletedEntity,
  SupplyResponseEntity,
  UpdateSupplyDto,
  UpsertAlertaAlmacenDto,
  UpsertAlertaGlobalDto,
  UsoMedidaDto,
} from '../interfaces/insumo.dto'
import type {
  AlertaStock,
  CrearMedidaInput,
  Insumo,
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
// Listar / crear / actualizar / eliminar: /supplies
// ---------------------------------------------------------------------------

export interface FetchInsumosParams {
  search?: string
  page?: number
  limit?: number
  signal?: AbortSignal
}

function mapInsumoListItem(raw: SupplyResponseEntity, fallbackId: string): Insumo {
  return {
    id: toStringId(raw.id, fallbackId),
    codigo: raw.codigo,
    nombre: raw.nombre,
    descripcion: raw.descripcion ?? undefined,
    id_unidad_base: raw.unidadBase.id,
    unidadBase: {
      id: raw.unidadBase.id,
      abreviatura: raw.unidadBase.abreviatura,
      nombre: raw.unidadBase.nombre,
    },
    stockActual: raw.stockActual,
  }
}

/** GET /supplies?search=&page=&limit= — offset del backend (default 10/pág, envelope {data, meta}). */
export async function fetchInsumos({ search, page, limit, signal }: FetchInsumosParams = {}) {
  const result = await safePagination<SupplyResponseEntity[]>({
    method: 'GET',
    url: '/supplies',
    params: {
      ...(search ? { search } : {}),
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
    },
    signal,
  })
  return {
    insumos: result.data.map((raw, i) => mapInsumoListItem(raw, `insumo-${i}`)),
    meta: result.meta,
  }
}

export type CrearInsumoInput = Pick<CreateSupplyDto, 'nombre' | 'descripcion' | 'id_unidad_base'>

/** POST /supplies — el backend genera el código (folio). */
export async function createInsumo(input: CrearInsumoInput): Promise<Insumo> {
  const payload: CreateSupplyDto = { ...input }
  const raw = await safeRequest<SupplyResponseEntity>({
    method: 'POST',
    url: '/supplies',
    data: payload,
  })
  return mapInsumoListItem(raw, `insumo-${Date.now()}`)
}

export type ActualizarInsumoInput = Partial<
  Pick<UpdateSupplyDto, 'nombre' | 'descripcion' | 'id_unidad_base'>
>

/** PATCH /supplies/{id}. */
export async function updateInsumo(id: string, input: ActualizarInsumoInput): Promise<Insumo> {
  const payload: UpdateSupplyDto = { ...input }
  const raw = await safeRequest<SupplyResponseEntity>({
    method: 'PATCH',
    url: `/supplies/${id}`,
    data: payload,
  })
  return mapInsumoListItem(raw, id)
}

/** DELETE /supplies/{id} — borrado lógico, devuelve {id, message}. */
export async function deleteInsumoBackend(id: string): Promise<SupplyDeletedEntity> {
  return safeRequest<SupplyDeletedEntity>({ method: 'DELETE', url: `/supplies/${id}` })
}

// ---------------------------------------------------------------------------
// Detalle del insumo: GET /supplies/{id}
// ---------------------------------------------------------------------------

function mapInsumoDetalle(raw: SupplyResponseEntity, insumoId: string): InsumoDetalle {
  return {
    id: toStringId(raw.id, insumoId),
    codigo: raw.codigo,
    nombre: raw.nombre,
    descripcion: raw.descripcion ?? undefined,
    unidadBase: {
      id: raw.unidadBase.id,
      abreviatura: raw.unidadBase.abreviatura,
      nombre: raw.unidadBase.nombre,
    },
    unidadMedida: raw.unidadBase.abreviatura,
    stockActual: raw.stockActual,
  }
}

export async function fetchInsumoDetalle(insumoId: string, signal?: AbortSignal): Promise<InsumoDetalle> {
  const raw = await safeRequest<SupplyResponseEntity>({
    method: 'GET',
    url: `/supplies/${insumoId}`,
    signal,
  })
  return mapInsumoDetalle(raw, insumoId)
}

// ---------------------------------------------------------------------------
// Medidas alternas: GET / POST /supplies/{id}/medidas
// ---------------------------------------------------------------------------

function mapMedida(raw: MedidaResponse, fallbackId: string): MedidaAlterna {
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
  const data = await safeRequest<MedidaResponse[] | { items?: MedidaResponse[] }>({
    method: 'GET',
    url: `/supplies/${insumoId}/medidas`,
    signal,
  })
  const lista = Array.isArray(data) ? data : (data.items ?? [])
  return lista.map((m, i) => mapMedida(m, `medida-${i}`))
}

export async function createMedida(insumoId: string, input: CrearMedidaInput): Promise<MedidaAlterna> {
  const payload: CreateMedidaDto = {
    nombre: input.nombre,
    abreviatura: input.abreviatura,
    factor_a_base: input.factorABase,
    ...(input.uso ? { uso: input.uso as UsoMedidaDto } : {}),
  }
  const raw = await safeRequest<MedidaResponse>({
    method: 'POST',
    url: `/supplies/${insumoId}/medidas`,
    data: payload,
  })
  return mapMedida(raw, `medida-${Date.now()}`)
}

// ---------------------------------------------------------------------------
// Evaluación de eliminable: GET /supplies/{id}/eliminable
// ---------------------------------------------------------------------------

export async function fetchEliminable(insumoId: string, signal?: AbortSignal) {
  return safeRequest<EliminableResponse>({
    method: 'GET',
    url: `/supplies/${insumoId}/eliminable`,
    signal,
  })
}

// ---------------------------------------------------------------------------
// Alertas de stock
// ---------------------------------------------------------------------------

export function formatoAlcanceAlmacen(idAlmacen: number): string {
  return `ALM-${String(idAlmacen).padStart(3, '0')}`
}

/** Acepta "ALM-005", "ALM-5" o "5" y devuelve el id numérico. null si no es un almacén. */
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

function mapAlertaGlobal(raw: AlertaGlobalResponse): AlertaStock {
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

function mapAlertaAlmacen(raw: AlertaAlmacenResponse, index: number): AlertaStock {
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

function listaAlmacenes(raw: AlertasResponse): AlertaAlmacenResponse[] {
  if (Array.isArray(raw.porAlmacen)) return raw.porAlmacen
  if (Array.isArray(raw.por_almacen)) return raw.por_almacen
  if (Array.isArray(raw.almacenes)) return raw.almacenes
  if (Array.isArray(raw.alertas)) return raw.alertas
  return []
}

export async function fetchAlertas(insumoId: string, signal?: AbortSignal): Promise<AlertaStock[]> {
  const data = await safeRequest<AlertasResponse>({
    method: 'GET',
    url: `/supplies/${insumoId}/alertas`,
    signal,
  })
  const filas: AlertaStock[] = []
  if (data.global) filas.push(mapAlertaGlobal(data.global))
  listaAlmacenes(data).forEach((a, i) => filas.push(mapAlertaAlmacen(a, i)))
  return filas
}

export async function upsertAlertaGlobal(
  insumoId: string,
  input: UpsertAlertaGlobalInput,
): Promise<void> {
  const payload: UpsertAlertaGlobalDto = {
    stock_min: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { stock_deseado: input.cantidadAReponer }),
    usuario_id: USUARIO_SISTEMA_ID,
  }
  await safeRequest<void>({ method: 'PUT', url: `/supplies/${insumoId}/alertas/global`, data: payload })
}

export async function removeAlertaGlobal(insumoId: string): Promise<void> {
  await safeRequest<void>({ method: 'DELETE', url: `/supplies/${insumoId}/alertas/global` })
}

export async function upsertAlertaAlmacen(
  insumoId: string,
  input: UpsertAlertaAlmacenInput,
): Promise<void> {
  const payload: UpsertAlertaAlmacenDto = {
    id_almacen: input.idAlmacen,
    minimo_alerta: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { cantidad_reponer: input.cantidadAReponer }),
    usuario_id: USUARIO_SISTEMA_ID,
  }
  await safeRequest<void>({ method: 'PUT', url: `/supplies/${insumoId}/alertas/almacen`, data: payload })
}

export async function removeAlertaAlmacen(insumoId: string, almacenId: number): Promise<void> {
  await safeRequest<void>({
    method: 'DELETE',
    url: `/supplies/${insumoId}/alertas/almacen/${almacenId}`,
  })
}
