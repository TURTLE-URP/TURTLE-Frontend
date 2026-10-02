import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { AgregarMesaDialog } from '@/modules/mesas/components/agregar-mesa-dialog'
import { GestionarMesaDialog } from '@/modules/mesas/components/gestionar-mesa-dialog'
import { MesaCard } from '@/modules/mesas/components/mesa-card'
import { MesasKPIs } from '@/modules/mesas/components/mesas-kpis'
import { MesasTable } from '@/modules/mesas/components/mesas-table'
import { useMesas } from '@/modules/mesas/hooks/use-mesas'
import type { DatosOcuparMesa, FiltroEstado, Mesa, VistaModo } from '@/modules/mesas/interfaces/mesa'

export const Route = createFileRoute('/mesas')({
  component: MesasPage,
})

function MesasPage() {
  const { mesas, loading, error, refresh, guardar, setOcupado } = useMesas()
  const [pisoActivo, setPisoActivo] = useState<number>(1)
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas')
  const [busqueda, setBusqueda] = useState<string>('')
  const [vistaModo, setVistaModo] = useState<VistaModo>('cuadricula')

  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null)
  const [isGestionarOpen, setIsGestionarOpen] = useState(false)
  const [isAgregarOpen, setIsAgregarOpen] = useState(false)
  const [mesaParaEditar, setMesaParaEditar] = useState<Mesa | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const mesasDelPiso = useMemo(() => {
    return mesas.filter((m) => m.piso === pisoActivo)
  }, [mesas, pisoActivo])

  const totalMesasPiso = mesasDelPiso.length
  const disponiblesPiso = mesasDelPiso.filter((m) => !m.ocupado).length
  const ocupadasPiso = mesasDelPiso.filter((m) => m.ocupado).length

  const mesasFiltradas = useMemo(() => {
    return mesasDelPiso.filter((m) => {
      if (filtroEstado === 'desocupadas' && m.ocupado) return false
      if (filtroEstado === 'ocupadas' && !m.ocupado) return false

      if (busqueda.trim() !== '') {
        const query = busqueda.toLowerCase()
        const matchNumero = `mesa ${m.numero}`.includes(query) || m.numero.toString() === query
        const matchCliente = m.pedidoActual?.cliente.toLowerCase().includes(query) || false
        const matchMozo = m.pedidoActual?.mozo.toLowerCase().includes(query) || false
        const matchZona = m.zona.toLowerCase().includes(query)
        return matchNumero || matchCliente || matchMozo || matchZona
      }

      return true
    })
  }, [mesasDelPiso, filtroEstado, busqueda])

  const handleAbrirGestionar = (mesa: Mesa) => {
    setMesaSeleccionada(mesa)
    setIsGestionarOpen(true)
  }

  const handleLiberarMesa = (id: number) => {
    void setOcupado(id, { ocupado: false })
      .then(() => showToast('Mesa liberada y lista para nuevos comensales'))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'No se pudo liberar la mesa'
        showToast(message)
      })
  }

  const handleOcuparMesa = (id: number, datos: DatosOcuparMesa) => {
    void setOcupado(id, {
      ocupado: true,
      nombreClienteLocal: datos.cliente,
      documentoClienteLocal: datos.dni || undefined,
      comensales: datos.comensales,
      mozo: datos.mozo || undefined,
    })
      .then(() => showToast(`Mesa ocupada por ${datos.cliente}`))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'No se pudo ocupar la mesa'
        showToast(message)
      })
  }

  const handleAbrirEditar = (mesa: Mesa) => {
    setMesaParaEditar(mesa)
    setIsAgregarOpen(true)
  }

  const handleGuardarMesa = (mesaData: Omit<Mesa, 'id'> & { id?: number }) => {
    void guardar(mesaData)
      .then(() => showToast(`Mesa ${mesaData.numero} actualizada correctamente`))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'No se pudo guardar la mesa'
        showToast(message)
      })
  }

  const handleEliminarMesa = (id: number) => {
    const mesaAEliminar = mesas.find((m) => m.id === id)
    if (!mesaAEliminar) return

    if (mesaAEliminar.ocupado) {
      showToast('No puedes eliminar una mesa que se encuentra actualmente ocupada')
      return
    }

    showToast('La eliminación de mesas no está disponible')
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50/70 font-sans text-slate-800 antialiased">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Estado de Mesas
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Anfitrión / mozo · Tiempo real</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVistaModo('cuadricula')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
              vistaModo === 'cuadricula'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Cuadrícula
          </button>
          <button
            type="button"
            onClick={() => setVistaModo('tabla')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
              vistaModo === 'tabla'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Tabla
          </button>
        </div>
      </div>

      <MesasKPIs
        total={totalMesasPiso}
        disponibles={disponiblesPiso}
        ocupadas={ocupadasPiso}
        pisoActivo={pisoActivo}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        onPisoChange={setPisoActivo}
        onActualizar={() => {
          void refresh().then(() => showToast('Lista de mesas sincronizada'))
        }}
        vistaModo={vistaModo}
        onVistaModoChange={setVistaModo}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
      />

      {error ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500">
          <p className="font-semibold text-slate-700">{error}</p>
        </div>
      ) : loading && mesas.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
          <p className="font-semibold text-slate-600">Cargando mesas</p>
        </div>
      ) : vistaModo === 'cuadricula' ? (
        mesasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
            <p className="font-semibold text-slate-600">
              No hay mesas en Piso {pisoActivo} con este filtro
            </p>
            <p className="text-xs mt-1">
              Prueba cambiando al Piso {pisoActivo === 1 ? 2 : 1} o ajustando los filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(26rem,1fr))] gap-4">
            {mesasFiltradas.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} onGestionar={handleAbrirGestionar} />
            ))}
          </div>
        )
      ) : (
        <MesasTable
          mesas={mesasFiltradas}
          onGestionar={handleAbrirGestionar}
          onEditar={handleAbrirEditar}
          onEliminar={handleEliminarMesa}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-xl text-xs font-semibold">
          {toastMessage}
        </div>
      )}

      <GestionarMesaDialog
        mesa={mesaSeleccionada}
        isOpen={isGestionarOpen}
        onClose={() => {
          setIsGestionarOpen(false)
          setMesaSeleccionada(null)
        }}
        onLiberarMesa={handleLiberarMesa}
        onOcuparMesa={handleOcuparMesa}
      />

      <AgregarMesaDialog
        isOpen={isAgregarOpen}
        mesaParaEditar={mesaParaEditar}
        mesasExistentes={mesas}
        onClose={() => {
          setIsAgregarOpen(false)
          setMesaParaEditar(null)
        }}
        onGuardar={handleGuardarMesa}
      />
    </div>
  )
}
