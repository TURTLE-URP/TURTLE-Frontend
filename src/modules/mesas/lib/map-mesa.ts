import type { ItemComanda, Mesa, PedidoLocal } from '../interfaces/mesa'
import type { MesaApi, MesaApiPedido, MesaApiPedidoDetalle } from '../services/mesas.api'

function toNumber(value: string | number | null | undefined): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function mapCategoria(categoria: string): ItemComanda['categoria'] {
  switch (categoria) {
    case 'entrada':
      return 'Entrada'
    case 'refresco':
      return 'Bebida'
    case 'postre':
      return 'Postre'
    default:
      return 'Plato de Fondo'
  }
}

function mapItem(detalle: MesaApiPedidoDetalle): ItemComanda {
  return {
    id: String(detalle.id),
    nombre: detalle.plato.nombre,
    cantidad: detalle.cantidad,
    precio: toNumber(detalle.plato.precio),
    categoria: mapCategoria(detalle.plato.categoria),
  }
}

function mapPedido(pedido: MesaApiPedido): PedidoLocal {
  const subtotal = toNumber(pedido.subtotal)
  const igv = toNumber(pedido.IGV)
  const inicio = new Date(pedido.created_at)
  const minutos = Number.isNaN(inicio.getTime())
    ? 0
    : Math.max(0, Math.round((Date.now() - inicio.getTime()) / 60000))

  return {
    idPedido: pedido.codigo,
    cliente: pedido.nombre_cliente_local?.trim() || 'Cliente',
    dni: pedido.documento_cliente_local ?? undefined,
    horaInicio: Number.isNaN(inicio.getTime())
      ? ''
      : inicio.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    comensales: pedido.comensales ?? 0,
    mozo: pedido.nombre_mozo?.trim() || '',
    tiempoMinutos: minutos,
    subtotal,
    igv,
    total: subtotal + igv,
    estadoComanda: 'pendiente',
    items: (pedido.detalles ?? []).map(mapItem),
  }
}

export function mapMesa(mesa: MesaApi): Mesa {
  const pedido = mesa.pedidos?.[0]
  return {
    id: mesa.id,
    numero: mesa.numero_mesa,
    capacidad: mesa.capacidad,
    ocupado: mesa.ocupado,
    piso: mesa.piso === 'piso_2' ? 2 : 1,
    zona: '',
    pedidoActual: pedido ? mapPedido(pedido) : undefined,
  }
}

export function toPisoApi(piso: number): 'piso_1' | 'piso_2' {
  return piso === 2 ? 'piso_2' : 'piso_1'
}
