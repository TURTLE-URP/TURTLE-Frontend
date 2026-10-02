import { useCallback, useEffect, useState } from 'react'
import {
  MesasApi,
  type MesaGestionInput,
  type MesaGestionItem,
  type MesaGestionList,
  type PisoMesa,
} from '../services/mesas.api'

const LIMIT = 10

const EMPTY_LIST: MesaGestionList = {
  data: [],
  meta: { total: 0, page: 1, limit: LIMIT, totalPages: 1 },
  summary: { activas: 0, piso1: 0, piso2: 0, inactivas: 0 },
}

type Dialogo = 'crear' | 'ver' | 'editar' | 'baja'

function ocupacion(mesa: MesaGestionItem) {
  if (mesa.estado === 'inactiva') return '—'
  return mesa.ocupado ? 'Ocupada' : 'Libre'
}

export function GestionMesas() {
  const [listado, setListado] = useState<MesaGestionList>(EMPTY_LIST)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const [busquedaInput, setBusquedaInput] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [piso, setPiso] = useState<'' | PisoMesa>('')
  const [estado, setEstado] = useState<'activa' | 'inactiva'>('activa')
  const [pagina, setPagina] = useState(1)

  const [dialogo, setDialogo] = useState<Dialogo | null>(null)
  const [mesaSeleccionada, setMesaSeleccionada] = useState<MesaGestionItem | null>(null)
  const [motivoBaja, setMotivoBaja] = useState('')
  const [form, setForm] = useState<MesaGestionInput>({ numero: 1, capacidad: 4, piso: 'piso_1' })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusqueda(busquedaInput.trim())
      setPagina(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [busquedaInput])

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await MesasApi.findManagement({
        search: busqueda || undefined,
        piso: piso || undefined,
        estado,
        page: pagina,
        limit: LIMIT,
      })
      setListado(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el servidor'
      setError(message)
      setListado(EMPTY_LIST)
    } finally {
      setLoading(false)
    }
  }, [busqueda, piso, estado, pagina])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const cerrarDialogo = () => {
    setDialogo(null)
    setMesaSeleccionada(null)
    setMotivoBaja('')
    setGuardando(false)
  }

  const abrirVer = async (mesa: MesaGestionItem) => {
    setError(null)
    try {
      const detalle = await MesasApi.findManagementById(mesa.id)
      setMesaSeleccionada(detalle)
      setDialogo('ver')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo ver la mesa')
    }
  }

  const abrirEditar = (mesa: MesaGestionItem) => {
    setMesaSeleccionada(mesa)
    setForm({ numero: mesa.numero, capacidad: mesa.capacidad, piso: mesa.piso })
    setDialogo('editar')
  }

  const abrirCrear = () => {
    setForm({ numero: 1, capacidad: 4, piso: 'piso_1' })
    setDialogo('crear')
  }

  const abrirBaja = (mesa: MesaGestionItem) => {
    if (mesa.ocupado) {
      setAviso('No se puede dar de baja una mesa con un pedido abierto.')
      return
    }
    setMesaSeleccionada(mesa)
    setMotivoBaja('')
    setDialogo('baja')
  }

  const confirmarBaja = async () => {
    if (!mesaSeleccionada || !motivoBaja.trim()) return
    setGuardando(true)
    setError(null)
    try {
      await MesasApi.deactivate(mesaSeleccionada.id, motivoBaja.trim())
      setAviso(`Mesa ${mesaSeleccionada.codigo} dada de baja`)
      cerrarDialogo()
      await cargar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo dar de baja')
      setGuardando(false)
    }
  }

  const confirmarAlta = async (mesa: MesaGestionItem) => {
    setError(null)
    try {
      await MesasApi.reactivate(mesa.id)
      setAviso(`Mesa ${mesa.codigo} reactivada`)
      await cargar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reactivar la mesa')
    }
  }

  const guardarForm = async () => {
    if (!Number.isInteger(form.numero) || form.numero < 1 || form.capacidad < 1) {
      setError('Número y capacidad deben ser enteros mayores a 0')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      if (dialogo === 'crear') {
        await MesasApi.create(form)
        setAviso('Mesa creada')
      } else if (dialogo === 'editar' && mesaSeleccionada) {
        await MesasApi.updateManagement(mesaSeleccionada.id, form)
        setAviso(`Mesa ${mesaSeleccionada.codigo} actualizada`)
      }
      cerrarDialogo()
      await cargar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la mesa')
      setGuardando(false)
    }
  }

  const limpiar = () => {
    setBusquedaInput('')
    setBusqueda('')
    setPiso('')
    setEstado('activa')
    setPagina(1)
  }

  const { summary, meta, data } = listado
  const desde = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const hasta = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mesas</h1>
          <p className="text-slate-500 text-sm">Administración de registros</p>
        </div>
        <button
          type="button"
          onClick={abrirCrear}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium shadow-sm"
        >
          + Nueva mesa
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">{summary.activas}</h2>
          <p className="text-slate-500 text-sm">Activas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">
            {summary.piso1} / {summary.piso2}
          </h2>
          <p className="text-slate-500 text-sm">Piso 1 / Piso 2</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">{summary.inactivas}</h2>
          <p className="text-slate-500 text-sm">Inactivas</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="M-07 / 7..."
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div className="w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Piso</label>
          <select
            aria-label="Filtrar por piso"
            value={piso}
            onChange={(e) => {
              setPiso(e.target.value as '' | PisoMesa)
              setPagina(1)
            }}
            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">Todos</option>
            <option value="piso_1">Piso 1</option>
            <option value="piso_2">Piso 2</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Eliminadas</label>
          <select
            aria-label="Filtrar eliminadas"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value as 'activa' | 'inactiva')
              setPagina(1)
            }}
            className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="activa">No</option>
            <option value="inactiva">Sí</option>
          </select>
        </div>
        <button
          type="button"
          onClick={limpiar}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>

      {aviso ? <p className="mb-3 text-sm text-teal-700">{aviso}</p> : null}
      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
              <th className="p-3 font-medium">Codigo</th>
              <th className="p-3 font-medium">Nro</th>
              <th className="p-3 font-medium">Piso</th>
              <th className="p-3 font-medium">Cap</th>
              <th className="p-3 font-medium">Ocupada</th>
              <th className="p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Cargando mesas
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No hay mesas con este filtro
                </td>
              </tr>
            ) : (
              data.map((mesa) => {
                const ocupada = ocupacion(mesa)
                return (
                  <tr key={mesa.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{mesa.codigo}</td>
                    <td className="p-3">{mesa.numero}</td>
                    <td className="p-3">{mesa.piso}</td>
                    <td className="p-3">{mesa.capacidad}</td>
                    <td
                      className={`p-3 font-medium ${
                        ocupada === 'Libre'
                          ? 'text-green-600'
                          : ocupada === 'Ocupada'
                            ? 'text-orange-500'
                            : 'text-slate-400'
                      }`}
                    >
                      {ocupada}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => void abrirVer(mesa)}
                        className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirEditar(mesa)}
                        className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </button>
                      {mesa.estado === 'activa' ? (
                        <button
                          type="button"
                          onClick={() => abrirBaja(mesa)}
                          className={`px-3 py-1 border rounded transition-colors ${
                            mesa.ocupado
                              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                          }`}
                        >
                          Baja
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void confirmarAlta(mesa)}
                          className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                        >
                          Alta
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
        <span>Nota: columna Ocupada es solo lectura (viene de Mesa.ocupado). Baja = soft delete.</span>
        <span className="flex items-center gap-2">
          Mostrando {desde}-{hasta} de {meta.total}
          <button
            type="button"
            disabled={pagina <= 1}
            onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
            className="px-2 disabled:opacity-40"
          >
            ‹
          </button>
          {meta.page} / {Math.max(meta.totalPages, 1)}
          <button
            type="button"
            disabled={pagina >= meta.totalPages}
            onClick={() => setPagina((actual) => actual + 1)}
            className="px-2 disabled:opacity-40"
          >
            ›
          </button>
        </span>
      </div>

      {dialogo === 'baja' && mesaSeleccionada ? (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border-t-4 border-rose-500">
            <h3 className="text-xl font-bold text-rose-600 mb-4">
              Desactivar mesa {mesaSeleccionada.codigo} (baja lógica)
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Motivo *</label>
              <input
                type="text"
                placeholder="Ej: silla rota..."
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Guarda deleted_at + deleted_by. Con Pedido abierto el botón se bloquea.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={guardando || motivoBaja.trim() === ''}
                onClick={() => void confirmarBaja()}
                className="px-4 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-900 transition-colors disabled:opacity-50"
              >
                Confirmar baja
              </button>
              <button
                type="button"
                onClick={cerrarDialogo}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {dialogo === 'ver' && mesaSeleccionada ? (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{mesaSeleccionada.codigo}</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm mb-6">
              <dt className="text-slate-500">Número</dt>
              <dd>{mesaSeleccionada.numero}</dd>
              <dt className="text-slate-500">Piso</dt>
              <dd>{mesaSeleccionada.piso}</dd>
              <dt className="text-slate-500">Capacidad</dt>
              <dd>{mesaSeleccionada.capacidad}</dd>
              <dt className="text-slate-500">Ocupada</dt>
              <dd>{ocupacion(mesaSeleccionada)}</dd>
              <dt className="text-slate-500">Estado</dt>
              <dd>{mesaSeleccionada.estado === 'activa' ? 'Activa' : 'Inactiva'}</dd>
              <dt className="text-slate-500">Motivo de baja</dt>
              <dd>{mesaSeleccionada.motivoBaja || '—'}</dd>
            </dl>
            <button
              type="button"
              onClick={cerrarDialogo}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}

      {(dialogo === 'crear' || dialogo === 'editar') && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {dialogo === 'crear' ? 'Nueva mesa' : `Editar ${mesaSeleccionada?.codigo}`}
            </h3>
            <div className="space-y-3 mb-6">
              <label className="block text-sm">
                <span className="text-slate-600">Número</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={form.numero}
                  onChange={(e) => setForm((actual) => ({ ...actual, numero: Number(e.target.value) }))}
                  className="mt-1 w-full border border-slate-300 rounded-md p-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Capacidad</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={form.capacidad}
                  onChange={(e) => setForm((actual) => ({ ...actual, capacidad: Number(e.target.value) }))}
                  className="mt-1 w-full border border-slate-300 rounded-md p-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Piso</span>
                <select
                  aria-label="Piso de la mesa"
                  value={form.piso}
                  onChange={(e) => setForm((actual) => ({ ...actual, piso: e.target.value as PisoMesa }))}
                  className="mt-1 w-full border border-slate-300 rounded-md p-2"
                >
                  <option value="piso_1">Piso 1</option>
                  <option value="piso_2">Piso 2</option>
                </select>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={guardando}
                onClick={() => void guardarForm()}
                className="px-4 py-2 bg-teal-600 text-white rounded-md font-medium disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={cerrarDialogo}
                className="px-4 py-2 border border-slate-300 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
