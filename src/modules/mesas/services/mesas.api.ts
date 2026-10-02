import { useAuthStore } from '@/shared/stores/auth-store'
import { applyApiKey, getApiUrl } from '@/shared/lib/api-key'

const API_URL = getApiUrl()

export interface MesaApiPedidoDetalle {
  id: number
  cantidad: number
  subtotal: string | number
  plato: {
    id: number
    nombre: string
    precio: string | number
    categoria: string
  }
}

export interface MesaApiPedido {
  id: number
  codigo: string
  nombre_cliente_local: string | null
  documento_cliente_local: string | null
  comensales: number | null
  nombre_mozo: string | null
  created_at: string
  subtotal: string | number
  IGV: string | number
  detalles: MesaApiPedidoDetalle[]
}

export interface UpdateOcupadoPayload {
  ocupado: boolean
  nombreClienteLocal?: string
  documentoClienteLocal?: string
  comensales?: number
  mozo?: string
}

export interface MesaApi {
  id: number
  codigo: string
  numero_mesa: number
  capacidad: number
  ocupado: boolean
  piso: 'piso_1' | 'piso_2'
  pedidos: MesaApiPedido[]
}

export interface UpdateMesaPayload {
  numero: number
  capacidad: number
  piso: 'piso_1' | 'piso_2'
  ocupado: boolean
}

export type PisoMesa = 'piso_1' | 'piso_2'
export type EstadoRegistroMesa = 'activa' | 'inactiva'

export interface MesaGestionItem {
  id: number
  codigo: string
  numero: number
  piso: PisoMesa
  capacidad: number
  ocupado: boolean
  updatedAt: string | null
  updatedBy: number | null
  estado: EstadoRegistroMesa
  motivoBaja: string | null
}

export interface MesaGestionList {
  data: MesaGestionItem[]
  meta: { total: number; page: number; limit: number; totalPages: number }
  summary: { activas: number; piso1: number; piso2: number; inactivas: number }
}

export interface MesaGestionQuery {
  search?: string
  piso?: PisoMesa
  estado?: EstadoRegistroMesa
  page?: number
  limit?: number
}

export interface MesaGestionInput {
  numero: number
  capacidad: number
  piso: PisoMesa
}

function getHeaders() {
  const token = useAuthStore.getState().session?.token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return applyApiKey(headers)
}

async function readError(res: Response, fallback: string) {
  try {
    const data = (await res.json()) as { message?: string | string[] }
    if (Array.isArray(data.message)) return data.message.join('. ')
    if (data.message) return data.message
  } catch {
    // El cuerpo no es JSON.
  }
  return fallback
}

export const MesasApi = {
  async findAll(): Promise<MesaApi[]> {
    const res = await fetch(`${API_URL}/api/tables`, {
      method: 'GET',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al obtener las mesas'))
    return res.json() as Promise<MesaApi[]>
  },

  async update(tableNumber: number, dto: UpdateMesaPayload): Promise<MesaApi> {
    const res = await fetch(`${API_URL}/api/tables/${tableNumber}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al actualizar la mesa'))
    return res.json() as Promise<MesaApi>
  },

  async findManagement(query: MesaGestionQuery): Promise<MesaGestionList> {
    const params = new URLSearchParams()
    if (query.search) params.set('search', query.search)
    if (query.piso) params.set('piso', query.piso)
    if (query.estado) params.set('estado', query.estado)
    params.set('page', String(query.page ?? 1))
    params.set('limit', String(query.limit ?? 10))
    const res = await fetch(`${API_URL}/api/tables/management?${params}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al obtener las mesas'))
    return res.json() as Promise<MesaGestionList>
  },

  async findManagementById(id: number): Promise<MesaGestionItem> {
    const res = await fetch(`${API_URL}/api/tables/management/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al obtener la mesa'))
    return res.json() as Promise<MesaGestionItem>
  },

  async create(dto: MesaGestionInput): Promise<MesaGestionItem> {
    const res = await fetch(`${API_URL}/api/tables`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al crear la mesa'))
    return res.json() as Promise<MesaGestionItem>
  },

  async updateManagement(id: number, dto: Partial<MesaGestionInput>): Promise<MesaGestionItem> {
    const res = await fetch(`${API_URL}/api/tables/management/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al editar la mesa'))
    return res.json() as Promise<MesaGestionItem>
  },

  async deactivate(id: number, motivo: string): Promise<MesaGestionItem> {
    const res = await fetch(`${API_URL}/api/tables/management/${id}/baja`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ motivo }),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al dar de baja la mesa'))
    return res.json() as Promise<MesaGestionItem>
  },

  async reactivate(id: number): Promise<MesaGestionItem> {
    const res = await fetch(`${API_URL}/api/tables/management/${id}/alta`, {
      method: 'PATCH',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al reactivar la mesa'))
    return res.json() as Promise<MesaGestionItem>
  },

  async updateOcupado(tableNumber: number, dto: UpdateOcupadoPayload): Promise<MesaApi> {
    const res = await fetch(`${API_URL}/api/tables/${tableNumber}/ocupado`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error(await readError(res, 'Error al cambiar la ocupación'))
    return res.json() as Promise<MesaApi>
  },
}
