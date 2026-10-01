import type { AxiosRequestConfig } from 'axios'
import axiosInstance from './axios.config'
import type { APIResponse, Pagination } from '../interfaces/api-response'

export async function safeRequest<T>(config: AxiosRequestConfig): Promise<APIResponse<T>> {
  const response = await axiosInstance.request<APIResponse<T>>(config)
  return response.data
}

export async function safePagination<T>(config: AxiosRequestConfig): Promise<Pagination<T>> {
  const response = await axiosInstance.request<Pagination<T>>(config)
  return response.data
}
