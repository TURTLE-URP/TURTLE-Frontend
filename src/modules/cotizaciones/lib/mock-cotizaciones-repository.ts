import type { Cotizacion, EstadoSolicitud, FiltrosCotizaciones, ListadoCotizaciones } from '../interfaces/types'
import type { CotizacionesRepository } from '../services/cotizaciones-repository'
import { CotizacionesError } from '../services/cotizaciones-repository'

function clonar<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

type Semilla = [id: string, folio: string, proveedor: string, fecha: string, estado: EstadoSolicitud, total: number, oc: string | null]

const SEMILLAS: Semilla[] = [
  ['c01', 'COT-2026-001', 'Agro Andina', '2026-09-02', 'en negociación', 1250.5, null],
  ['c02', 'COT-2026-002', 'Frutas del Valle', '2026-09-03', 'aprobada', 890.0, 'oc-101'],
  ['c03', 'COT-2026-003', 'Distribuidora Pacífico', '2026-09-04', 'rechazada', 2340.75, null],
  ['c04', 'COT-2026-004', 'Comercial Norte', '2026-09-05', 'rechazada', 410.2, null],
  ['c05', 'COT-2026-005', 'Agro Andina', '2026-09-06', 'aprobada', 1575.0, 'oc-102'],
  ['c06', 'COT-2026-006', 'Importadora Sur', '2026-09-07', 'en negociación', 3120.4, null],
  ['c07', 'COT-2026-007', 'Bodega San Juan', '2026-09-08', 'en negociación', 655.9, null],
  ['c08', 'COT-2026-008', 'Alimentos Pura Vida', '2026-09-09', 'aprobada', 990.0, 'oc-103'],
  ['c09', 'COT-2026-009', 'Transportes El Sol', '2026-09-10', 'en negociación', 1780.25, null],
  ['c10', 'COT-2026-010', 'Papelería Ideal', '2026-09-11', 'rechazada', 230.0, null],
  ['c11', 'COT-2026-011', 'Construcción Andina', '2026-09-12', 'aprobada', 4210.8, 'oc-104'],
  ['c12', 'COT-2026-012', 'Ferretería El Martillo', '2026-09-13', 'aprobada', 745.5, 'oc-109'],
  ['c13', 'COT-2026-013', 'Frutas del Valle', '2026-09-14', 'en negociación', 1320.0, null],
  ['c14', 'COT-2026-014', 'Muebles El Roble', '2026-09-15', 'aprobada', 2890.3, 'oc-105'],
  ['c15', 'COT-2026-015', 'Imprenta Veloz', '2026-09-16', 'rechazada', 510.75, null],
  ['c16', 'COT-2026-016', 'Granja El Porvenir', '2026-09-17', 'en negociación', 1940.0, null],
  ['c17', 'COT-2026-017', 'Medicamentos Vita', '2026-09-18', 'en negociación', 870.2, null],
  ['c18', 'COT-2026-018', 'Logística Portuaria', '2026-09-19', 'aprobada', 3560.0, 'oc-106'],
  ['c19', 'COT-2026-019', 'Tecnología Perú', '2026-09-20', 'en negociación', 2210.6, null],
  ['c20', 'COT-2026-020', 'Textiles Lima', '2026-09-21', 'rechazada', 640.4, null],
  ['c21', 'COT-2026-021', 'Veterinaria Campo', '2026-09-22', 'rechazada', 385.0, null],
  ['c22', 'COT-2026-022', 'Servicios GPS Norte', '2026-09-23', 'aprobada', 1495.9, 'oc-107'],
  ['c23', 'COT-2026-023', 'Calzados Sur Andino', '2026-09-24', 'en negociación', 980.0, null],
  ['c24', 'COT-2026-024', 'Joyería del Centro', '2026-09-25', 'aprobada', 2730.15, 'oc-110'],
  ['c25', 'COT-2026-025', 'Minería Andahuaylas', '2026-09-26', 'aprobada', 5120.0, 'oc-108'],
]

function aCotizacion([id, folio, proveedorNombre, fecha, solicitudEstado, total, ordenCompraId]: Semilla): Cotizacion {
  return {
    id,
    folio,
    proveedorNombre,
    fecha,
    solicitudId: `s-${id}`,
    solicitudEstado,
    total,
    moneda: 'PEN',
    ordenCompraId,
  }
}

export const COTIZACIONES_SEMILLA: Cotizacion[] = SEMILLAS.map(aCotizacion)

export interface MockOptions {
  latenciaMs?: number
  semillas?: Cotizacion[]
  fallar?: boolean
}

export class MockCotizacionesRepository implements CotizacionesRepository {
  private readonly items: Cotizacion[]
  private readonly latencia: number
  private readonly fallar: boolean

  constructor(opts: MockOptions = {}) {
    this.items = (opts.semillas ?? COTIZACIONES_SEMILLA).map(clonar)
    this.latencia = opts.latenciaMs ?? Math.floor(300 + Math.random() * 400)
    this.fallar = opts.fallar ?? false
  }

  private demorar(): Promise<void> {
    if (this.latencia <= 0) return Promise.resolve()
    return new Promise((resolver) => setTimeout(resolver, this.latencia))
  }

  async listar(filtros: FiltrosCotizaciones): Promise<ListadoCotizaciones> {
    await this.demorar()
    if (this.fallar) {
      throw new CotizacionesError('ERROR_INTERNO', 'No se pudo cargar el listado de cotizaciones.')
    }
    const texto = filtros.texto.trim().toLowerCase()
    const tamano = filtros.tamano > 0 ? filtros.tamano : 10
    const filtrados = this.items.filter((c) => {
      if (texto) {
        const coincide = [c.folio, c.proveedorNombre].some((campo) =>
          campo.toLowerCase().includes(texto),
        )
        if (!coincide) return false
      }
      if (filtros.estado !== 'todas' && c.solicitudEstado !== filtros.estado) return false
      if (filtros.desde && c.fecha < filtros.desde) return false
      if (filtros.hasta && c.fecha > filtros.hasta) return false
      return true
    })
    const total = filtrados.length
    const totalPaginas = total === 0 ? 0 : Math.ceil(total / tamano)
    const pagina = Math.min(Math.max(1, filtros.pagina), Math.max(1, totalPaginas))
    const inicio = (pagina - 1) * tamano
    return {
      items: filtrados.slice(inicio, inicio + tamano).map(clonar),
      pagina,
      tamano,
      total,
      totalPaginas,
    }
  }
}
