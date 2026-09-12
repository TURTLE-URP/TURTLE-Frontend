import { useState } from 'react'
import { ProveedoresFilters } from '../components/proveedores-filters'
import { ProveedoresPagination } from '../components/proveedores-pagination'
import {
  ListadoCargando,
  ListadoError,
  ListadoVacio,
  SinResultados,
} from '../components/proveedores-states'
import { ProveedoresTable } from '../components/proveedores-table'
import { useDebouncedValue, useProveedoresList } from '../data/proveedores-query'
import { crearFiltros } from '../logic/filters'

const TIEMPO_DEBOUNCE_MS = 300

export function ProveedoresPage() {
  const [texto, setTexto] = useState('')
  const [pagina, setPagina] = useState(1)
  const textoDebounced = useDebouncedValue(texto, TIEMPO_DEBOUNCE_MS)

  const [textoDebouncedPrevio, setTextoDebouncedPrevio] = useState(textoDebounced)
  if (textoDebouncedPrevio !== textoDebounced) {
    setTextoDebouncedPrevio(textoDebounced)
    setPagina(1)
  }

  const filtros = crearFiltros(textoDebounced, pagina)
  const { data, isPending, isError, refetch } = useProveedoresList(filtros)

  const paginaActual = data?.pagina ?? pagina
  const totalPaginas = data?.totalPaginas ?? 1
  const total = data?.total ?? 0
  const base = (paginaActual - 1) * filtros.tamano

  return (
    <section aria-labelledby="titulo-proveedores" className="space-y-6">
      <div>
        <h1 id="titulo-proveedores" className="text-2xl font-bold text-foreground">
          Gestionar Proveedores
        </h1>
        <p className="mt-2 text-muted-foreground">
          Administra el registro de proveedores: alta, actualización y desactivación.
        </p>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-4">
          <ProveedoresFilters texto={texto} onTextoChange={setTexto} total={total} />
        </div>

        <div className="p-4">
          {isPending ? (
            <ListadoCargando />
          ) : isError ? (
            <ListadoError onReintentar={() => void refetch()} />
          ) : data && data.items.length > 0 ? (
            <ProveedoresTable
              proveedores={data.items}
              base={base}
              onEditar={() => {}}
              onDesactivar={() => {}}
              onReactivar={() => {}}
            />
          ) : data?.total === 0 && texto.trim() === '' ? (
            <ListadoVacio onRegistrar={() => {}} />
          ) : (
            <SinResultados onLimpiar={() => setTexto('')} />
          )}
        </div>

        {data && !isError ? (
          <div className="border-t p-4">
            <ProveedoresPagination
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              total={total}
              tamano={filtros.tamano}
              onPaginaChange={setPagina}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}