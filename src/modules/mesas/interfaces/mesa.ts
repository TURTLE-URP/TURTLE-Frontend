export type EstadoMesa = 'desocupada' | 'ocupada'

export interface ItemComanda {
  id: string
  nombre: string
  cantidad: number
  precio: number
  categoria: 'Entrada' | 'Plato de Fondo' | 'Bebida' | 'Postre'
}

export interface PedidoLocal {
  idPedido: string
  cliente: string
  dni?: string
  horaInicio: string
  comensales: number
  mozo: string
  tiempoMinutos: number
  subtotal: number
  igv: number
  total: number
  estadoComanda: 'pendiente' | 'en_preparacion' | 'servido'
  items: ItemComanda[]
}

export interface Mesa {
  id: number
  numero: number
  capacidad: number
  ocupado: boolean
  piso: number
  zona: string
  pedidoActual?: PedidoLocal
  observaciones?: string
}

export type FiltroEstado = 'todas' | 'desocupadas' | 'ocupadas'
export type VistaModo = 'cuadricula' | 'tabla'
