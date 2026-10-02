import type { AxiosRequestConfig } from 'axios'
import axiosInstance from './axios.config'
import type { APIError, APIResponse, Pagination } from '../interfaces/api-response'

export function isApiError<T>(data: APIResponse<T>): data is { error: APIError } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as { error: unknown }).error !== 'undefined'
  )
}

export async function safeRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<APIResponse<T>>(config)
  const data = response.data
  if (isApiError(data)) {
    throw new Error(
      typeof data.error === 'string' ? data.error : (data.error.error ?? 'Error de la API'),
    )
  }
  return data
}

export async function safePagination<T>(config: AxiosRequestConfig): Promise<Pagination<T>> {
  const response = await axiosInstance.request<Pagination<T>>(config)
  return response.data
}
