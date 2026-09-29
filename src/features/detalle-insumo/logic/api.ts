import type { InsumoDetalle } from './types'

const MOCK_INSUMOS_DETALLE: Record<string, InsumoDetalle> = {
  '1': {
    id: '1',
    codigo: 'INS-0001',
    nombre: 'Filete de Lenguado',
    descripcion: 'Filete fresco de lenguado, corte para cebiche.',
    categoria: 'Pescados',
    unidadMedida: 'kg',
    stockActual: 8,
    stockMinimo: 5,
    estado: 'Activo',
  },
}

function insumoDetallePorDefecto(insumoId: string): InsumoDetalle {
  return (
    MOCK_INSUMOS_DETALLE[insumoId] ?? {
      id: insumoId,
      codigo: `INS-${insumoId.padStart(4, '0')}`,
      nombre: 'Insumo de ejemplo',
      descripcion: 'Datos de ejemplo mientras se conecta el endpoint real.',
      categoria: 'Mariscos',
      unidadMedida: 'kg',
      stockActual: 10,
      stockMinimo: 4,
      estado: 'Activo',
    }
  )
}

/**
 * TODO(Mauri): reemplazar este cuerpo por la llamada real al endpoint de
 * detalles de insumo (con `request<InsumoDetalle>` de `@/lib/http/http`)
 * en cuanto lo tengas. La firma de la función (recibe insumoId, devuelve
 * Promise<InsumoDetalle>) ya queda lista para el swap, así useInsumoDetalle
 * en hooks.ts no cambia.
 */
export async function fetchInsumoDetalle(insumoId: string): Promise<InsumoDetalle> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return insumoDetallePorDefecto(insumoId)
}
