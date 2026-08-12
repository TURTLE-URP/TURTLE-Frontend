import { HttpError, request } from '@/lib/http/http'
import { validateEnv } from '@/lib/env/env'
import type { HttpMethod } from '@/lib/http/http'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = validateEnv().VITE_API_BASE_URL

  try {
    return await request<T>(path, { ...options, baseUrl: baseUrl || undefined })
  } catch (error) {
    if (error instanceof HttpError) {
      throw new ApiError(error.status ?? 0, error.message)
    }
    throw error
  }
}
