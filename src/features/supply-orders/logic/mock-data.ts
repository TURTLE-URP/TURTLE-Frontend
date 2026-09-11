export type OrderStatus = 'pendiente' | 'acordada' | 'entregada' | 'error'

export interface SupplyOrder {
  id: string
  provider: string
  date: string
  total: number
  status: OrderStatus
}

export interface SupplyOrderGroup {
  id: string
  isGroup: true
  modality: string
  date: string
  total: number
  status: OrderStatus
  orders: SupplyOrder[]
}

export type SupplyOrderRow = SupplyOrder | SupplyOrderGroup

export function isGroupRow(row: SupplyOrderRow): row is SupplyOrderGroup {
  return 'isGroup' in row && row.isGroup === true
}

export const mockKpis = {
  ordersThisMonth: { value: 7, delta: '+2 respecto al mes anterior' },
  pendingAgreement: { value: 2, note: 'Requieren seguimiento' },
  totalSpend: { value: 1108, note: 'Entre 4 proveedores' },
  lowStockInputs: { value: 8, note: 'Bajo stock deseado' },
}

export const mockOrders: SupplyOrderRow[] = [
  {
    id: 'G-001',
    isGroup: true,
    modality: 'Por escasez',
    date: '2026-07-20',
    total: 456.0,
    status: 'acordada',
    orders: [
      { id: 'OA-0011', provider: 'Agro Fresh SAC', date: '2026-07-20', total: 186.5, status: 'acordada' },
      { id: 'OA-0012', provider: 'Lácteos del Campo', date: '2026-07-20', total: 94.0, status: 'entregada' },
      { id: 'OA-0013', provider: 'Molinos del Norte', date: '2026-07-20', total: 175.5, status: 'entregada' },
    ],
  },
  { id: 'OA-0010', provider: 'Carnes Premium SRL', date: '2026-07-18', total: 216.0, status: 'entregada' },
  {
    id: 'G-002',
    isGroup: true,
    modality: 'Por platillos',
    date: '2026-07-15',
    total: 169.4,
    status: 'acordada',
    orders: [
      { id: 'OA-0014', provider: 'Verduras del Valle', date: '2026-07-15', total: 89.4, status: 'acordada' },
      { id: 'OA-0015', provider: 'Especias Andinas', date: '2026-07-15', total: 80.0, status: 'acordada' },
    ],
  },
  { id: 'OA-0007', provider: 'Importadora Mediterránea', date: '2026-07-10', total: 267.0, status: 'entregada' },
]