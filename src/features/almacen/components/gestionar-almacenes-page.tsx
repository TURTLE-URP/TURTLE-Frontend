import { useState, useMemo, type FormEvent } from 'react'
import {
  PlusIcon,
  PencilSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
  WarningIcon,
  CheckCircleIcon,
  WarehouseIcon,
  ProhibitIcon,
} from '@phosphor-icons/react'

import type { AlmacenArea, FormErrors } from '../types/almacen'
import { ALMACENES_MOCK } from '../data/mock-almacenes'

export function GestionarAlmacenesPage() {
  const [almacenes, setAlmacenes] = useState<AlmacenArea[]>(ALMACENES_MOCK)
  const [busqueda, setBusqueda] = useState<string>('')

  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'alerta'; texto: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [almacenEdit, setAlmacenEdit] = useState<AlmacenArea | null>(null)

  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
  })

  // Filtrado cruzado por nombre, código, ubicación e insumos guardados
  const almacenesFiltrados = useMemo(() => {
    return almacenes.filter((item) => {
      const query = busqueda.toLowerCase()
      const insumosList = (item.insumosContenidos || item.insumos || []) as any[]
      const coincideInsumo = insumosList.some((ins) => {
        const nombre = typeof ins === 'string' ? ins : ins.nombre
        return nombre?.toLowerCase().includes(query)
      })

      return (
        item.nombre.toLowerCase().includes(query) ||
        item.codigo.toLowerCase().includes(query) ||
        item.ubicacion.toLowerCase().includes(query) ||
        coincideInsumo
      )
    })
  }, [almacenes, busqueda])

  const handleOpenCreate = () => {
    setAlmacenEdit(null)
    setFormData({
      nombre: '',
      ubicacion: '',
      descripcion: '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEdit = (almacen: AlmacenArea) => {
    setAlmacenEdit(almacen)
    setFormData({
      nombre: almacen.nombre,
      ubicacion: almacen.ubicacion,
      descripcion: almacen.descripcion || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  // Cambiar estado del almacén completo (ACTIVO / INACTIVO)
const handleToggleEstado = (id: string) => {
  setAlmacenes((prev) =>
    prev.map((a) => {
      if (a.id === id) {
        const nuevoEstado: 'ACTIVO' | 'INACTIVO' =
          a.estado === 'INACTIVO' ? 'ACTIVO' : 'INACTIVO'

        setMensaje({
          tipo: 'ok',
          texto: `Área "\({a.nombre}"\){
            nuevoEstado === 'ACTIVO' ? 'activada' : 'inactivada'
          } correctamente.`,
        })

        return { ...a, estado: nuevoEstado }
      }
      return a
    })
  )
}
  // Cambiar estado individual de un insumo resguardado dentro de un almacén
  const handleToggleEstadoInsumo = (almacenId: string, nombreInsumo: string) => {
    setAlmacenes((prevAlmacenes) =>
      prevAlmacenes.map((almacen) => {
        if (almacen.id !== almacenId) return almacen

        const listaInsumos = (almacen.insumosContenidos || almacen.insumos || []) as any[]

        if (listaInsumos.length === 0) return almacen

        let estadoNuevo = false
        const nuevosInsumos = listaInsumos.map((ins) => {
          const nombre = typeof ins === 'string' ? ins : ins.nombre
          if (nombre === nombreInsumo) {
            const esActivoActual = typeof ins === 'string' ? true : ins.activo !== false
            estadoNuevo = !esActivoActual
            return typeof ins === 'string'
              ? { nombre: ins, activo: false }
              : { ...ins, activo: !ins.activo }
          }
          return ins
        })

        setMensaje({
          tipo: 'ok',
          texto: `Insumo "${nombreInsumo}" ${estadoNuevo ? 'activado' : 'inactivado'} en "${almacen.nombre}".`,
        })

        return {
          ...almacen,
          insumosContenidos: nuevosInsumos,
          insumos: nuevosInsumos,
        }
      })
    )
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del área o almacén es obligatorio.'
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.'
    } else {
      const existeDuplicado = almacenes.some(
        (a) =>
          a.id !== almacenEdit?.id &&
          a.nombre.toLowerCase().trim() === formData.nombre.toLowerCase().trim()
      )
      if (existeDuplicado) {
        newErrors.nombre = 'Ya existe un área registrada con este nombre.'
      }
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'Especifica la ubicación física dentro del local.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (almacenEdit) {
      setAlmacenes(
        almacenes.map((a) =>
          a.id === almacenEdit.id
            ? {
                ...a,
                nombre: formData.nombre.trim(),
                ubicacion: formData.ubicacion.trim(),
                descripcion: formData.descripcion.trim(),
              }
            : a
        )
      )
      setMensaje({ tipo: 'ok', texto: 'Área de almacén actualizada con éxito.' })
    } else {
      const nuevo: AlmacenArea = {
        id: Date.now().toString(),
        codigo: `ALM-00${almacenes.length + 1}`,
        nombre: formData.nombre.trim(),
        ubicacion: formData.ubicacion.trim(),
        descripcion: formData.descripcion.trim(),
        totalInsumos: 0,
        tipo: 'Insumos',
        responsable: 'Por asignar',
        capacidadMaxKg: 0,
        requiereTemperatura: false,
        estado: 'ACTIVO',
      }
      setAlmacenes([nuevo, ...almacenes])
      setMensaje({ tipo: 'ok', texto: 'Nueva área de almacén creada con éxito.' })
    }

    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            INFRAESTRUCTURA • CEVICHERÍA
          </p>
          <h1 className="text-xl font-serif font-bold text-slate-800">Almacenes</h1>
          <p className="text-slate-500 text-[11px]">
            {almacenes.length} áreas configuradas para resguardo e inocuidad de alimentos
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-3.5 py-2 rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusIcon size={14} weight="bold" />
          <span>Registrar Almacén</span>
        </button>
      </div>

      {/* Banner de mensajes */}
      {mensaje && (
        <div
          className={`p-3 rounded border text-xs flex justify-between items-center ${
            mensaje.tipo === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'ok' ? <CheckCircleIcon size={16} /> : <WarningIcon size={16} />}
            <span>{mensaje.texto}</span>
          </div>
          <button onClick={() => setMensaje(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <XIcon size={14} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded p-2">
        <div className="relative flex-1 max-w-lg">
          <MagnifyingGlassIcon size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, insumo resguardado, ubicación o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-transparent border-none text-xs text-slate-700 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="border-l border-slate-200 pl-3 font-mono">
            {almacenesFiltrados.length} resultados
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-4 w-2/3">ÁREA / INSUMOS GUARDADOS</th>
              <th className="py-2.5 px-4">UBICACIÓN</th>
              <th className="py-2.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {almacenesFiltrados.map((item) => {
              const listaInsumos = ((item.insumosContenidos || item.insumos || []) as any[])

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    item.estado === 'INACTIVO' ? 'opacity-60 bg-slate-50/50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                        <WarehouseIcon size={14} />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span>{item.nombre}</span>
                          {item.estado === 'INACTIVO' && (
                            <span className="text-[9px] bg-rose-100 text-rose-700 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                              Inactivo
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.codigo} • {item.totalInsumos || listaInsumos.length} insumos registrados
                        </div>
                        {item.descripcion && (
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {item.descripcion}
                          </p>
                        )}

                        {/* Listado interactivo de insumos */}
                        {listaInsumos.length > 0 && (
                          <div className="pt-2 space-y-1">
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                              Insumos resguardados:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {listaInsumos.map((ins, idx) => {
                                const nombreInsumo = typeof ins === 'string' ? ins : ins.nombre
                                const esActivo = typeof ins === 'string' ? true : ins.activo !== false

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleToggleEstadoInsumo(item.id, nombreInsumo)}
                                    title={
                                      esActivo
                                        ? `Haz clic para inactivar ${nombreInsumo}`
                                        : `Haz clic para activar ${nombreInsumo}`
                                    }
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer border ${
                                      esActivo
                                        ? 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                        : 'bg-slate-100 text-slate-400 border-slate-200 line-through hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 hover:no-underline'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        esActivo ? 'bg-cyan-500' : 'bg-slate-400'
                                      }`}
                                    />
                                    <span>{nombreInsumo}</span>
                                    {!esActivo && (
                                      <span className="text-[9px] font-bold text-rose-500 ml-0.5">
                                        (Inactivo)
                                      </span>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 align-top text-slate-600 text-[11px]">{item.ubicacion}</td>

                  <td className="py-3 px-4 text-right align-top">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                        title="Editar Área"
                      >
                        <PencilSimpleIcon size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleEstado(item.id)}
                        className={`p-1 rounded cursor-pointer transition-colors ${
                          item.estado === 'INACTIVO'
                            ? 'hover:text-emerald-600 hover:bg-emerald-50 text-slate-400'
                            : 'hover:text-rose-600 hover:bg-rose-50 text-slate-400'
                        }`}
                        title={item.estado === 'INACTIVO' ? 'Activar Área' : 'Inactivar Área'}
                      >
                        <ProhibitIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-800">
                {almacenEdit ? `Editar Área (${almacenEdit.codigo})` : 'Registrar Almacén'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              <div>
                <label className="block mb-1.5 font-semibold text-slate-700">
                  Nombre del Área / Almacén <span className="text-cyan-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value })
                    if (errors.nombre) setErrors({ ...errors, nombre: undefined })
                  }}
                  className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                    errors.nombre
                      ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                  }`}
                  placeholder="Ej. Cámara Fría de Pescados y Mariscos"
                />
                {errors.nombre && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-slate-700">
                  Descripción del Área
                </label>
                <textarea
                  rows={2}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-600 focus:bg-white text-slate-700"
                  placeholder="Especifique qué insumos se guardan en esta área..."
                />
              </div>

              <div>
                <label className="block mb-1.5 font-semibold text-slate-700">
                  Ubicación en Local <span className="text-cyan-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => {
                    setFormData({ ...formData, ubicacion: e.target.value })
                    if (errors.ubicacion) setErrors({ ...errors, ubicacion: undefined })
                  }}
                  className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                    errors.ubicacion
                      ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                  }`}
                  placeholder="Ej. Cocina - Área Fría Principal"
                />
                {errors.ubicacion && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.ubicacion}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0092B8] hover:bg-[#007A9A] text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Guardar Área
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}