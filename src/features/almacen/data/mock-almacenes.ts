import type { AlmacenArea } from '../types/almacen'

/** Plantillas predefinidas basadas en una cevichería */
export const PLANTILLAS_CEVICHERIA = [
  {
    nombre: 'Cámara Fría de Pescados y Mariscos',
    tipo: 'Congelado' as const,
    ubicacion: 'Cocina - Área Fría Principal',
    responsable: 'Maestro Cevichero / Chef Ejecutivo',
    capacidadMaxKg: 600,
    requiereTemperatura: true,
    temperaturaObjetivo: -18,
    descripcion:
      'Área donde se guardan filetes de pescado, pulpo, calamar, langostinos y conchas controlados a temperatura.',
  },
  {
    nombre: 'Refrigerador de Frescos y Vegetales',
    tipo: 'Refrigerado' as const,
    ubicacion: 'Mesa de Preparación - Zona A',
    responsable: 'Sous Chef',
    capacidadMaxKg: 350,
    requiereTemperatura: true,
    temperaturaObjetivo: 4,
    descripcion:
      'Área donde se guarda limón, cebolla roja, ají limo, cilantro, canchita cocida y base para leche de tigre.',
  },
  {
    nombre: 'Almacén Seco de Abarrotes',
    tipo: 'Temperatura Ambiente' as const,
    ubicacion: 'Depósito Posterior - Nivel 1',
    responsable: 'Almacenero Principal',
    capacidadMaxKg: 1500,
    requiereTemperatura: false,
    temperaturaObjetivo: undefined,
    descripcion:
      'Área donde se guarda camote, choclo, maíz chulpe, aceites, harinas, pastas de ají procesadas, condimentos y conservas.',
  },
  {
    nombre: 'Cava y Depósito de Barra',
    tipo: 'Refrigerado' as const,
    ubicacion: 'Barra Central - Nivel 1',
    responsable: 'Head Bartender',
    capacidadMaxKg: 500,
    requiereTemperatura: true,
    temperaturaObjetivo: 8,
    descripcion:
      'Zona para cajas de cerveza, pisco, insumos para chicha morada, gaseosas, jarabes y hieleras.',
  },
  {
    nombre: 'Almacén de Empaques y Delivery',
    tipo: 'Suministros' as const,
    ubicacion: 'Zona de Despacho / Expedición',
    responsable: 'Encargado de Delivery',
    capacidadMaxKg: 400,
    requiereTemperatura: false,
    temperaturaObjetivo: undefined,
    descripcion:
      'Área destinada a envases herméticos, bolsas térmicas, vasos y cubiertos descartables.',
  },
  {
    nombre: 'Bodega de Limpieza y Químicos',
    tipo: 'Suministros' as const,
    ubicacion: 'Patio Posterior - Módulo Separado',
    responsable: 'Supervisora de Higiene',
    capacidadMaxKg: 250,
    requiereTemperatura: false,
    temperaturaObjetivo: undefined,
    descripcion:
      'Ára designada a desinfectantes de verduras (cloro alimentario), desengrasantes de cocina, detergentes y artículos de aseo.',
  },
]

export const ALMACENES_MOCK: AlmacenArea[] = PLANTILLAS_CEVICHERIA.map(
  (plantilla, index) => ({
    id: (index + 1).toString(),
    codigo: `ALM-00${index + 1}`,
    ...plantilla,
    totalInsumos: [18, 12, 35, 22, 14, 8][index],
    estado: 'Activo' as const,
  })
)
