import axiosInstance from '@/shared/api/axios.config'

function readMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data?.message
  if (Array.isArray(message)) return message.join('. ')
  if (message) return message
  return fallback
}

export const WorkersApi = {
  async findAll(params?: { page?: number; limit?: number; search?: string; estado?: string }) {
    const cleanParams: Record<string, string> = {
      tipo: 'trabajador',
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 100),
    }

    if (params?.search) cleanParams.search = params.search

    const { data } = await axiosInstance.get('/users', { params: cleanParams })
    return data
  },

  async findOne(id: number) {
    const { data } = await axiosInstance.get(`/users/${id}`)
    return data
  },

  async create(dto: unknown) {
    try {
      const { data } = await axiosInstance.post('/users/worker', dto)
      return data
    } catch (error: unknown) {
      throw new Error(readMessage(error, 'Error al crear trabajador'))
    }
  },

  async updateActivo(id: number) {
    const { data } = await axiosInstance.patch(`/users/${id}/toggle-status`)
    return data as { id: number; activo: boolean; message: string }
  },

  async update(id: number, dto: unknown) {
    const { data } = await axiosInstance.patch(`/users/${id}`, dto)
    return data
  },

  async remove(id: number) {
    const { data } = await axiosInstance.delete(`/users/${id}`)
    return data
  },
}
