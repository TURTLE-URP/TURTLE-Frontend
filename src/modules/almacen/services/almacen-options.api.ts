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
