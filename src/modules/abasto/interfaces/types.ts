export type EstadoOrden = 'Pendiente' | 'Aprobada' | 'En Tránsito' | 'Recibida' | 'Cancelada';

export interface OrdenAbasto {
  id: string;
  codigo: string;
  proveedor: string;
  fechaEmision: string;
  fechaEsperada: string;
  total: number;
  estado: EstadoOrden;
}

export const MOCK_ORDENES_ABASTO: OrdenAbasto[] = [
  { id: '1', codigo: 'ORD-2026-001', proveedor: 'Terminal Pesquero de Villa María', fechaEmision: '2026-09-10', fechaEsperada: '2026-09-11', total: 850.50, estado: 'Recibida' },
  { id: '2', codigo: 'ORD-2026-002', proveedor: 'Mercado Mayorista - Verduras y Limones', fechaEmision: '2026-09-11', fechaEsperada: '2026-09-12', total: 320.00, estado: 'Pendiente' },
  { id: '3', codigo: 'ORD-2026-003', proveedor: 'Distribuidora de Bebidas Norte', fechaEmision: '2026-09-11', fechaEsperada: '2026-09-13', total: 1200.20, estado: 'En Tránsito' },
  { id: '4', codigo: 'ORD-2026-004', proveedor: 'Comercializadora de Abarrotes', fechaEmision: '2026-09-12', fechaEsperada: '2026-09-14', total: 450.00, estado: 'Aprobada' },
  { id: '5', codigo: 'ORD-2026-005', proveedor: 'Pescadería El Buen Mar', fechaEmision: '2026-09-12', fechaEsperada: '2026-09-12', total: 600.00, estado: 'Cancelada' },
];