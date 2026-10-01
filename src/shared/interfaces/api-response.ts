export type APIResponse<T> = T | { error: APIError }

export interface APIError {
  error: string
}

/** Espeja el PaginationMeta del backend (offset): { total, page, limit, totalPages }. */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Envelope paginado del backend: { data, meta }. */
export interface Pagination<T> {
  data: T
  meta: PaginationMeta
}
