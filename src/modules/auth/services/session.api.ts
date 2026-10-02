import axiosInstance from '@/shared/api/axios.config'

export interface LoginResponse {
  token: string
  email: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { email, password })
  return data
}
