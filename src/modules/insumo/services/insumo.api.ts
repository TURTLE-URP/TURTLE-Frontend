import { safePagination, safeRequest } from '@/shared/api/safe-request'
import type {
  AlertaAlmacenResponseEntity,
  AlertaDeletedEntity,
  AlertaGlobalResponseEntity,
  CreateMedidaDto,
  CreateSupplyDto,
  EliminableResponseEntity,
  MedidaDeletedEntity,
  MedidaResponseEntity,
  SupplyAlertasResponseEntity,
  SupplyDeletedEntity,
  SupplyResponseEntity,
  SupplyUnitResponseEntity,
  UpdateMedidaDto,
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

/** GET /supplies/units/base?search= — catálogo de unidades (array directo). */
export async function fetchUnidadesBase(search?: string, signal?: AbortSignal) {
  return safeRequest<SupplyUnitResponseEntity[]>({
    method: 'GET',
    url: '/supplies/units/base',
    params: { ...(search ? { search } : {}) },
    signal,
  })
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

function mapMedida(raw: MedidaResponseEntity): MedidaAlterna {
  const esBase = raw.factorABase === 1
  return {
    id: toStringId(raw.id, `medida-${raw.id}`),
    nombre: raw.nombre,
    abreviatura: raw.abreviatura,
    factorABase: raw.factorABase,
    uso: raw.uso ?? '',
    ...(esBase ? { esBase: true as const } : {}),
  }
}

/** GET /supplies/{id}/medidas — devuelve array directo. */
export async function fetchMedidas(insumoId: string, signal?: AbortSignal): Promise<MedidaAlterna[]> {
  const data = await safeRequest<MedidaResponseEntity[]>({
    method: 'GET',
    url: `/supplies/${insumoId}/medidas`,
    signal,
  })
  return data.map(mapMedida)
}

export async function createMedida(insumoId: string, input: CrearMedidaInput): Promise<MedidaAlterna> {
  const payload: CreateMedidaDto = {
    nombre: input.nombre,
    abreviatura: input.abreviatura,
    factor_a_base: input.factorABase,
    ...(input.uso ? { uso: input.uso as UsoMedidaDto } : {}),
  }
  const raw = await safeRequest<MedidaResponseEntity>({
    method: 'POST',
    url: `/supplies/${insumoId}/medidas`,
    data: payload,
  })
  return mapMedida(raw)
}

export type ActualizarMedidaInput = Partial<{
  nombre: string
  abreviatura: string
  factorABase: number
  uso: UsoMedidaDto
}>

/** PATCH /supplies/{id}/medidas/{medidaId}. */
export async function updateMedida(
  insumoId: string,
  medidaId: string,
  input: ActualizarMedidaInput,
): Promise<MedidaAlterna> {
  const payload: UpdateMedidaDto = {
    ...(input.nombre !== undefined ? { nombre: input.nombre } : {}),
    ...(input.abreviatura !== undefined ? { abreviatura: input.abreviatura } : {}),
    ...(input.factorABase !== undefined ? { factor_a_base: input.factorABase } : {}),
    ...(input.uso !== undefined ? { uso: input.uso } : {}),
  }
  const raw = await safeRequest<MedidaResponseEntity>({
    method: 'PATCH',
    url: `/supplies/${insumoId}/medidas/${medidaId}`,
    data: payload,
  })
  return mapMedida(raw)
}

/** DELETE /supplies/{id}/medidas/{medidaId} — devuelve {id, message}. */
export async function deleteMedida(insumoId: string, medidaId: string): Promise<MedidaDeletedEntity> {
  return safeRequest<MedidaDeletedEntity>({
    method: 'DELETE',
    url: `/supplies/${insumoId}/medidas/${medidaId}`,
  })
}

// ---------------------------------------------------------------------------
// Evaluación de eliminable: GET /supplies/{id}/eliminable
// ---------------------------------------------------------------------------

export async function fetchEliminable(insumoId: string, signal?: AbortSignal) {
  return safeRequest<EliminableResponseEntity>({
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

function mapAlertaGlobal(raw: AlertaGlobalResponseEntity): AlertaStock {
  return {
    id: `global-${raw.id}`,
    alcance: 'GLOBAL',
    minimo: raw.stockMin,
    ...(raw.stockDeseado === null || raw.stockDeseado === undefined
      ? {}
      : { cantidadAReponer: raw.stockDeseado }),
    esGlobal: true,
  }
}

function mapAlertaAlmacen(raw: AlertaAlmacenResponseEntity): AlertaStock {
  return {
    id: `alm-${raw.idAlmacen}`,
    alcance: raw.codigoAlmacen,
    minimo: raw.minimoAlerta,
    ...(raw.cantidadReponer === null || raw.cantidadReponer === undefined
      ? {}
      : { cantidadAReponer: raw.cantidadReponer }),
    idAlmacen: raw.idAlmacen,
    esGlobal: false,
  }
}

/** GET /supplies/{id}/alertas — {global: …|null, porAlmacen: […]}. */
export async function fetchAlertas(insumoId: string, signal?: AbortSignal): Promise<AlertaStock[]> {
  const data = await safeRequest<SupplyAlertasResponseEntity>({
    method: 'GET',
    url: `/supplies/${insumoId}/alertas`,
    signal,
  })
  const filas: AlertaStock[] = []
  if (data.global) filas.push(mapAlertaGlobal(data.global))
  data.porAlmacen.forEach((a) => filas.push(mapAlertaAlmacen(a)))
  return filas
}

export async function upsertAlertaGlobal(
  insumoId: string,
  input: UpsertAlertaGlobalInput,
): Promise<void> {
  const payload: UpsertAlertaGlobalDto = {
    stock_min: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { stock_deseado: input.cantidadAReponer }),
  }
  await safeRequest<void>({ method: 'PUT', url: `/supplies/${insumoId}/alertas/global`, data: payload })
}

export async function removeAlertaGlobal(insumoId: string): Promise<AlertaDeletedEntity> {
  return safeRequest<AlertaDeletedEntity>({
    method: 'DELETE',
    url: `/supplies/${insumoId}/alertas/global`,
  })
}

export async function upsertAlertaAlmacen(
  insumoId: string,
  input: UpsertAlertaAlmacenInput,
): Promise<void> {
  const payload: UpsertAlertaAlmacenDto = {
    id_almacen: input.idAlmacen,
    minimo_alerta: input.minimo,
    ...(input.cantidadAReponer === undefined ? {} : { cantidad_reponer: input.cantidadAReponer }),
  }
  await safeRequest<void>({ method: 'PUT', url: `/supplies/${insumoId}/alertas/almacen`, data: payload })
}

export async function removeAlertaAlmacen(
  insumoId: string,
  almacenId: number,
): Promise<AlertaDeletedEntity> {
  return safeRequest<AlertaDeletedEntity>({
    method: 'DELETE',
    url: `/supplies/${insumoId}/alertas/almacen/${almacenId}`,
  })
}
