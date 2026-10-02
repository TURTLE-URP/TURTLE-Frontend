import { safeRequest } from '@/shared/api/safe-request'
import type { PaginatedStoreOptionsResponse } from '../interfaces/almacen-options.dto'

export interface FetchAlmacenesOptionsParams {
  search?: string
  cursor?: number
  limit?: number
  signal?: AbortSignal
}

/** GET /stores/options?search=&cursor=&limit= — cursor del backend (default 5, máx 50). */
export async function fetchAlmacenesOptions({
  search,
  cursor,
  limit,
  signal,
}: FetchAlmacenesOptionsParams = {}): Promise<PaginatedStoreOptionsResponse> {
  return safeRequest<PaginatedStoreOptionsResponse>({
    method: 'GET',
    url: '/stores/options',
    params: {
      ...(search ? { search } : {}),
      ...(cursor !== undefined ? { cursor } : {}),
      ...(limit ? { limit } : {}),
    },
    signal,
  })
}

export interface GetAlmacenesListsParams {
  page?: number
  limit?: number
  search?: string
}

export async function getAlmacenesList({
  page = 1,
  limit = 10,
  search = '',
}: GetAlmacenesListsParams) {
  return safeRequest<GetAlmacenesListResponse>({
    method: 'GET',
    url: '/stores',
    params: { page, limit, search },
  })
}

export interface GetAlmacenesListResponse {
  data: Almacen[]
  meta: Meta
}

export interface Almacen {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  ubicacion: string
  cantidadInsumos: number
}

export interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}
