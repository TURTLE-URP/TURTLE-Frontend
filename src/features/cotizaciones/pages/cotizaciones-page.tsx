import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CotizacionesFilters } from '../components/cotizaciones-filters'
import { CotizacionesPagination } from '../components/cotizaciones-pagination'
import {
  ListadoCargando,
  ListadoError,
  ListadoVacio,
  SinResultados,
} from '../components/cotizaciones-states'
import { CotizacionesTable } from '../components/cotizaciones-table'
import { RowActions } from '../components/row-actions'
import { useCotizacionesList, useDebouncedValue } from '../data/cotizaciones-query'
import type { Cotizacion, FiltroEstado } from '../data/types'
import { crearFiltros, describirCriterios } from '../logic/filters'

const TIEMPO_DEBOUNCE_MS = 300

function criteriosAplicados(texto: string, estado: FiltroEstado, desde: string | null, hasta: string | null): boolean {
  return texto.trim() !== '' || estado !== 'todas' || desde !== null || hasta !== null
}

export function CotizacionesPage() {
  const [texto, setTexto] = useState('')
  const [estado, setEstado] = useState<FiltroEstado>('todas')
  const [desde, setDesde] = useState<string | null>(null)
  const [hasta, setHasta] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [cerrando, setCerrando] = useState<Cotizacion | null>(null)
  const textoDebounced = useDebouncedValue(texto, TIEMPO_DEBOUNCE_MS)

  const [criteriosPrevios, setCriteriosPrevios] = useState(
    () => `${textoDebounced}|${estado}|${desde ?? ''}|${hasta ?? ''}`,
  )
  const criteriosActuales = `${textoDebounced}|${estado}|${desde ?? ''}|${hasta ?? ''}`
  if (criteriosPrevios !== criteriosActuales) {
    setCriteriosPrevios(criteriosActuales)
    setPagina(1)
  }

  const filtros = crearFiltros(textoDebounced, estado, desde, hasta, pagina)
  const { data, isPending, isError, refetch } = useCotizacionesList(filtros)

  const paginaActual = data?.pagina ?? pagina
  const totalPaginas = data?.totalPaginas ?? 0

  const limpiarFiltros = () => {
    setTexto('')
    setEstado('todas')
    setDesde(null)
    setHasta(null)
    setPagina(1)
  }

  return (
    <section aria-labelledby="titulo-cotizaciones" className="space-y-6">
      <div>
        <h1 id="titulo-cotizaciones" className="text-2xl font-bold text-foreground">
          Cotizaciones
        </h1>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-4">
          <CotizacionesFilters
            texto={texto}
            onTextoChange={setTexto}
            estado={estado}
            onEstadoChange={setEstado}
            desde={desde}
            onDesdeChange={setDesde}
            hasta={hasta}
            onHastaChange={setHasta}
            onLimpiar={limpiarFiltros}
          />
        </div>

        <div className="p-4">
          {isPending ? (
            <ListadoCargando />
          ) : isError ? (
            <ListadoError onReintentar={() => void refetch()} />
          ) : data && data.items.length > 0 ? (
            <CotizacionesTable
              cotizaciones={data.items}
              renderAcciones={(cotizacion) => (
                <RowActions cotizacion={cotizacion} onCerrar={setCerrando} />
              )}
            />
          ) : criteriosAplicados(textoDebounced, estado, desde, hasta) ? (
            <SinResultados criterios={describirCriterios(filtros)} onLimpiar={limpiarFiltros} />
          ) : (
            <ListadoVacio />
          )}
        </div>

        {data && !isError && totalPaginas > 0 ? (
          <div className="border-t p-4">
            <CotizacionesPagination
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              onPaginaChange={setPagina}
            />
          </div>
        ) : null}
      </div>

      <Dialog open={cerrando !== null} onOpenChange={(abierto) => !abierto && setCerrando(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Cerrar cotización {cerrando?.folio ?? ''}</DialogTitle>
            <DialogDescription>
              El formulario de cierre pertenece al flujo Cerrar Cotización (fuera de alcance de
              esta vista) y se conectará aquí.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
