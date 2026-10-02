/**
 * DTOs espejo del Swagger (tag Almacenes).
 * `GET /stores/options` — lista ligera para combobox con infinite scroll.
 */

export interface StoreOptionEntity {
  id: number
  codigo: string
  nombre: string
}

export interface CursorPaginationMeta {
  limit: number
  nextCursor: number | null
  hasMore: boolean
}

export interface PaginatedStoreOptionsResponse {
  data: StoreOptionEntity[]
  meta: CursorPaginationMeta
}
