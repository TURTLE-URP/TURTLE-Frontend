import { useState } from 'react'
import { useToastStore } from '@/stores/toast-store'
import { ProveedoresFilters } from '../components/proveedores-filters'
import { ProveedorConfirmDialog } from '../components/proveedor-confirm-dialog'
import { ProveedorFormDialog } from '../components/proveedor-form-dialog'
import { ProveedoresPagination } from '../components/proveedores-pagination'
import {
  ListadoCargando,
  ListadoError,
  ListadoVacio,
  SinResultados,
} from '../components/proveedores-states'
import { ProveedoresTable } from '../components/proveedores-table'
import { useDebouncedValue, useEliminarProveedor, useProveedoresList } from '../data/proveedores-query'
import type { Proveedor } from '../data/types'
import { crearFiltros } from '../logic/filters'

const TIEMPO_DEBOUNCE_MS = 300

export function ProveedoresPage() {
  const [texto, setTexto] = useState('')
  const [pagina, setPagina] = useState(1)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [eliminando, setEliminando] = useState<Proveedor | null>(null)
  const notificar = useToastStore((state) => state.notificar)
  const eliminar = useEliminarProveedor()
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
  const base = (paginaActual - 1) * filtros.tamano

  return (
    <section aria-labelledby="titulo-proveedores" className="space-y-6">
      <div>
        <h1 id="titulo-proveedores" className="text-2xl font-bold text-foreground">
          Gestión de proveedores
        </h1>
      </div>

      <div className="rounded-lg border bg-background">
        <div className="border-b p-4">
          <ProveedoresFilters
            texto={texto}
            onTextoChange={setTexto}
            onNuevo={() => setDialogoAbierto(true)}
          />
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
              onEditar={(proveedor) => setEditando(proveedor)}
              onEliminar={(proveedor) => setEliminando(proveedor)}
            />
          ) : data?.total === 0 && texto.trim() === '' ? (
            <ListadoVacio onRegistrar={() => setDialogoAbierto(true)} />
          ) : (
            <SinResultados onLimpiar={() => setTexto('')} />
          )}
        </div>

        {data && !isError ? (
          <div className="border-t p-4">
            <ProveedoresPagination
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              onPaginaChange={setPagina}
            />
          </div>
        ) : null}
      </div>

      {dialogoAbierto ? (
        <ProveedorFormDialog
          abierto
          onCerrar={() => setDialogoAbierto(false)}
          onExito={() => setDialogoAbierto(false)}
        />
      ) : null}
      {editando ? (
        <ProveedorFormDialog
          abierto
          proveedor={editando}
          onCerrar={() => setEditando(null)}
          onExito={() => setEditando(null)}
        />
      ) : null}
      {eliminando ? (
        <ProveedorConfirmDialog
          abierto
          proveedor={eliminando}
          onCerrar={() => setEliminando(null)}
          onConfirmar={() => {
            eliminar.mutate(eliminando.id, {
              onSuccess: () => {
                notificar('success', 'Proveedor eliminado correctamente.')
                setEliminando(null)
              },
              onError: (error) => {
                notificar(
                  'error',
                  error instanceof Error
                    ? error.message
                    : 'No se pudo eliminar el proveedor.',
                )
                setEliminando(null)
              },
            })
          }}
        />
      ) : null}
    </section>
  )
}