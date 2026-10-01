import axiosInstance from '@/shared/api/axios.config'

export const WorkersApi = {
  async findAll(params?: { page?: number; limit?: number; search?: string; estado?: string }) {
    const cleanParams: Record<string, string> = {}

    if (params?.search) cleanParams.search = params.search
    if (params?.estado === 'Activo') cleanParams.activo = 'true'
    if (params?.estado === 'Suspendido') cleanParams.activo = 'false'
    cleanParams.page = String(params?.page ?? 1)
    cleanParams.limit = String(params?.limit ?? 100)

    const { data } = await axiosInstance.get('/workers', { params: cleanParams })
    return data
  },

  async findOne(id: number) {
    const { data } = await axiosInstance.get(`/workers/${id}`)
    return data
  },

  async create(dto: unknown) {
    try {
      const { data } = await axiosInstance.post('/workers', dto)
      return data
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Error al crear trabajador'
      throw new Error(message)
    }
  },

  async updateActivo(id: number, activo: boolean) {
    const { data } = await axiosInstance.patch(`/workers/${id}/activo`, { activo })
    return data
  },

  async update(id: number, dto: unknown) {
    const { data } = await axiosInstance.patch(`/workers/${id}`, dto)
    return data
  },

  async remove(id: number) {
    const { data } = await axiosInstance.delete(`/workers/${id}`)
    return data
  },
}
