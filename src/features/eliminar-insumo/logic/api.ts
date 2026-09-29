import type { EvaluacionEliminarInsumo } from './types'

function evaluacionPorDefecto(insumoId: string): EvaluacionEliminarInsumo {
  return {
    insumoId,
    stockTotal: 41,
    numAlmacenes: 2,
    criterios: [
      {
        id: 'stock-almacenes',
        titulo: 'Stock en todos los almacenes (41)',
        cumple: false,
        detalle: 'Actualmente: 33 kg en Cocina y 8 kg en Piso 1',
      },
      {
        id: 'ordenes-abasto-pendientes',
        titulo: 'Órdenes de abasto emitidas en estado pendiente (0)',
        cumple: true,
      },
      {
        id: 'recetas-activas',
        titulo: 'Recetas activas (2)',
        cumple: false,
        detalle: 'Usado en: Pan (120g), Queque (200g)',
      },
    ],
  }
}

/**
 * TODO: reemplazar por la llamada real al endpoint que evalúa si un insumo
 * puede eliminarse (stock en almacenes, órdenes de abasto pendientes,
 * recetas activas...). La firma (insumoId -> Promise<EvaluacionEliminarInsumo>)
 * ya queda lista para el swap; nada más en el modal necesita cambiar.
 */
export async function fetchEvaluacionEliminarInsumo(insumoId: string): Promise<EvaluacionEliminarInsumo> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return evaluacionPorDefecto(insumoId)
}