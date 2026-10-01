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
