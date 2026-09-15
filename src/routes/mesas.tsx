import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Plus } from '@phosphor-icons/react'

import { MesasKPIs } from '../features/mesas/components/mesas-kpis'
import { MesaCard } from '../features/mesas/components/mesa-card'
import { MesasTable } from '../features/mesas/components/mesas-table'
import { GestionarMesaDialog } from '../features/mesas/components/gestionar-mesa-dialog'
import { AgregarMesaDialog } from '../features/mesas/components/agregar-mesa-dialog'
import { INITIAL_MESAS } from '../features/mesas/data/mock-mesas'
import type { Mesa, FiltroEstado, VistaModo, PedidoLocal } from '../features/mesas/types/mesa'

export const Route = createFileRoute('/mesas')({
  component: MesasPage,
})

function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>(INITIAL_MESAS)
  const [pisoActivo, setPisoActivo] = useState<number>(1)
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas')
  const [busqueda, setBusqueda] = useState<string>('')
  const [vistaModo, setVistaModo] = useState<VistaModo>('cuadricula')

  // Modales
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null)
  const [isGestionarOpen, setIsGestionarOpen] = useState(false)
  const [isAgregarOpen, setIsAgregarOpen] = useState(false)
  const [mesaParaEditar, setMesaParaEditar] = useState<Mesa | null>(null)

  // Mensaje de notificación / toast temporal
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtrado por piso seleccionado (Piso 1 o Piso 2)
  const mesasDelPiso = useMemo(() => {
    return mesas.filter((m) => m.piso === pisoActivo)
  }, [mesas, pisoActivo])

  const totalMesasPiso = mesasDelPiso.length
  const disponiblesPiso = mesasDelPiso.filter((m) => !m.ocupado).length
  const ocupadasPiso = mesasDelPiso.filter((m) => m.ocupado).length

  const mesasFiltradas = useMemo(() => {
    return mesasDelPiso.filter((m) => {
      // Filtro de estado
      if (filtroEstado === 'desocupadas' && m.ocupado) return false
      if (filtroEstado === 'ocupadas' && !m.ocupado) return false

      // Filtro de búsqueda
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

  // Handlers
  const handleAbrirGestionar = (mesa: Mesa) => {
    setMesaSeleccionada(mesa)
    setIsGestionarOpen(true)
  }

  const handleLiberarMesa = (id: number) => {
    setMesas((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            ocupado: false,
            pedidoActual: undefined,
          }
        }
        return m
      })
    )
    showToast(`✓ Mesa liberada y lista para nuevos comensales`)
  }

  const handleOcuparMesa = (id: number, nuevoPedido: PedidoLocal) => {
    setMesas((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            ocupado: true,
            pedidoActual: nuevoPedido,
          }
        }
        return m
      })
    )
    showToast(`✓ Mesa ocupada por ${nuevoPedido.cliente} (${nuevoPedido.comensales} personas)`)
  }

  const handleAbrirCrear = () => {
    setMesaParaEditar(null)
    setIsAgregarOpen(true)
  }

  const handleAbrirEditar = (mesa: Mesa) => {
    setMesaParaEditar(mesa)
    setIsAgregarOpen(true)
  }

  const handleGuardarMesa = (mesaData: Omit<Mesa, 'id'> & { id?: number }) => {
    if (mesaData.id) {
      // Editar
      setMesas((prev) =>
        prev.map((m) => (m.id === mesaData.id ? { ...m, ...mesaData } : m))
      )
      showToast(`✓ Mesa ${mesaData.numero} actualizada correctamente`)
    } else {
      // Crear nueva
      const newId = Math.max(0, ...mesas.map((m) => m.id)) + 1
      const nuevaMesa: Mesa = {
        id: newId,
        numero: mesaData.numero,
        capacidad: mesaData.capacidad,
        ocupado: mesaData.ocupado,
        piso: mesaData.piso,
        zona: mesaData.zona,
        observaciones: mesaData.observaciones,
      }
      setMesas((prev) => [...prev, nuevaMesa])
      setPisoActivo(nuevaMesa.piso)
      showToast(`✓ Nueva Mesa ${nuevaMesa.numero} registrada en Piso ${nuevaMesa.piso}`)
    }
  }

  const handleEliminarMesa = (id: number) => {
    const mesaAEliminar = mesas.find((m) => m.id === id)
    if (!mesaAEliminar) return

    if (mesaAEliminar.ocupado) {
      showToast('⚠️ No puedes eliminar una mesa que se encuentra actualmente ocupada')
      return
    }

    setMesas((prev) => prev.filter((m) => m.id !== id))
    showToast(`Mesa ${mesaAEliminar.numero} eliminada del sistema`)
  }

  return (
    <div className="min-h-full bg-slate-50/70 font-sans text-slate-800 antialiased">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-2 md:px-4">
          {/* Header Superior */}
          <div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Estado de Mesas
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Consulta y gestión de las mesas del restaurante
            </p>
          </div>

          {/* Barra Integrada: Buscador, Pisos, Refrescar, Vista y Disponibilidad 4/6 */}
          <MesasKPIs
            total={totalMesasPiso}
            disponibles={disponiblesPiso}
            ocupadas={ocupadasPiso}
            pisoActivo={pisoActivo}
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            onPisoChange={setPisoActivo}
            onActualizar={() => showToast('Lista de mesas sincronizada')}
            vistaModo={vistaModo}
            onVistaModoChange={setVistaModo}
          />

          {/* Barra de Filtros de Estado y Leyenda */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltroEstado('todas')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filtroEstado === 'todas'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Todas ({totalMesasPiso})
              </button>

              <button
                type="button"
                onClick={() => setFiltroEstado('desocupadas')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filtroEstado === 'desocupadas'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Desocupadas ({disponiblesPiso})
              </button>

              <button
                type="button"
                onClick={() => setFiltroEstado('ocupadas')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filtroEstado === 'ocupadas'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Ocupadas ({ocupadasPiso})
              </button>
            </div>

            {/* Botón + Nueva Mesa */}
            <button
              type="button"
              onClick={handleAbrirCrear}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-600/20 active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" weight="bold" />
              <span>Nueva Mesa</span>
            </button>
          </div>

          {/* Área de Visualización: Cuadrícula o Tabla */}
          {vistaModo === 'cuadricula' ? (
            mesasFiltradas.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
                <p className="font-semibold text-slate-600">No hay mesas en Piso {pisoActivo} con este filtro</p>
                <p className="text-xs mt-1">Prueba cambiando al Piso {pisoActivo === 1 ? 2 : 1} o ajustando los filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mesasFiltradas.map((mesa) => (
                  <MesaCard
                    key={mesa.id}
                    mesa={mesa}
                    onGestionar={handleAbrirGestionar}
                  />
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
        </div>

        {/* Toast Flotante */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
            {toastMessage}
          </div>
        )}

      {/* Diálogo emergente Gestionar Mesa */}
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

      {/* Diálogo emergente Agregar / Editar Mesa */}
      <AgregarMesaDialog
        isOpen={isAgregarOpen}
        mesaParaEditar={mesaParaEditar}
        onClose={() => {
          setIsAgregarOpen(false)
          setMesaParaEditar(null)
        }}
        onGuardar={handleGuardarMesa}
      />
    </div>
  )
}
