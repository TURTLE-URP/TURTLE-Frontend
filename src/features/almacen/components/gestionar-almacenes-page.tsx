import { useState, useMemo, type FormEvent } from 'react'
import {
  Plus,
  PencilSimple,
  Prohibit,
  MagnifyingGlass,
  X,
  Warning,
  CheckCircle,
  CaretDown,
  Warehouse,
  ThermometerCold,
  Info,
} from '@phosphor-icons/react'

import type { AlmacenArea, FormErrors } from '../types/almacen'
import { ALMACENES_MOCK, PLANTILLAS_CEVICHERIA } from '../data/mock-almacenes'

export function GestionarAlmacenesPage() {
  const [almacenes, setAlmacenes] = useState<AlmacenArea[]>(ALMACENES_MOCK)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('Todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos')
  const [busqueda, setBusqueda] = useState<string>('')

  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'alerta'; texto: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [almacenEdit, setAlmacenEdit] = useState<AlmacenArea | null>(null)

  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Refrigerado' as AlmacenArea['tipo'],
    ubicacion: '',
    responsable: '',
    capacidadMaxKg: '500',
    requiereTemperatura: false,
    temperaturaObjetivo: '4',
    descripcion: '',
  })

  const totalAlmacenes = almacenes.length
  const totalActivos = almacenes.filter((a) => a.estado === 'Activo').length
  const totalClimatizados = almacenes.filter((a) => a.requiereTemperatura && a.estado === 'Activo').length
  const totalInsumosAlojados = almacenes.reduce((acc, curr) => acc + curr.totalInsumos, 0)

  const tiposConteo = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: almacenes.length,
      Refrigerado: 0,
      Congelado: 0,
      'Temperatura Ambiente': 0,
      Suministros: 0,
    }
    almacenes.forEach((a) => {
      if (counts[a.tipo] !== undefined) counts[a.tipo]++
    })
    return counts
  }, [almacenes])

  const almacenesFiltrados = useMemo(() => {
    return almacenes.filter((item) => {
      const coincideBusqueda =
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.responsable.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(busqueda.toLowerCase())

      const coincideTipo =
        tipoSeleccionado === 'Todos' || item.tipo === tipoSeleccionado

      const coincideEstado =
        filtroEstado === 'Todos' || item.estado === filtroEstado

      return coincideBusqueda && coincideTipo && coincideEstado
    })
  }, [almacenes, busqueda, tipoSeleccionado, filtroEstado])

  const handleOpenCreate = () => {
    setAlmacenEdit(null)
    setFormData({
      nombre: '',
      tipo: 'Refrigerado',
      ubicacion: '',
      responsable: '',
      capacidadMaxKg: '500',
      requiereTemperatura: false,
      temperaturaObjetivo: '4',
      descripcion: '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleSeleccionarPlantilla = (nombrePlantilla: string) => {
    const plantilla = PLANTILLAS_CEVICHERIA.find((p) => p.nombre === nombrePlantilla)
    if (plantilla) {
      setFormData({
        nombre: plantilla.nombre,
        tipo: plantilla.tipo,
        ubicacion: plantilla.ubicacion,
        responsable: plantilla.responsable,
        capacidadMaxKg: plantilla.capacidadMaxKg.toString(),
        requiereTemperatura: plantilla.requiereTemperatura,
        temperaturaObjetivo: plantilla.temperaturaObjetivo?.toString() || '4',
        descripcion: plantilla.descripcion,
      })
      setErrors({})
    }
  }

  const handleOpenEdit = (almacen: AlmacenArea) => {
    setAlmacenEdit(almacen)
    setFormData({
      nombre: almacen.nombre,
      tipo: almacen.tipo,
      ubicacion: almacen.ubicacion,
      responsable: almacen.responsable,
      capacidadMaxKg: almacen.capacidadMaxKg.toString(),
      requiereTemperatura: almacen.requiereTemperatura,
      temperaturaObjetivo: almacen.temperaturaObjetivo?.toString() || '4',
      descripcion: almacen.descripcion || '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleToggleEstado = (almacen: AlmacenArea) => {
    const nuevoEstado = almacen.estado === 'Activo' ? 'Inactivo' : 'Activo'
    setAlmacenes(almacenes.map((a) => (a.id === almacen.id ? { ...a, estado: nuevoEstado } : a)))
    setMensaje({
      tipo: nuevoEstado === 'Inactivo' ? 'alerta' : 'ok',
      texto: `Área/Almacén "${almacen.nombre}" marcada como ${nuevoEstado.toLowerCase()}.`,
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const capacidadNum = Number(formData.capacidadMaxKg)
    const tempNum = Number(formData.temperaturaObjetivo)

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

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'Asigna un encargado o responsable de área.'
    }

    if (formData.capacidadMaxKg === '' || isNaN(capacidadNum)) {
      newErrors.capacidadMaxKg = 'Ingresa un valor numérico válido.'
    } else if (capacidadNum <= 0) {
      newErrors.capacidadMaxKg = 'La capacidad máxima debe ser mayor a 0.'
    }

    if (formData.requiereTemperatura) {
      if (formData.temperaturaObjetivo === '' || isNaN(tempNum)) {
        newErrors.temperaturaObjetivo = 'Ingresa la temperatura en °C.'
      } else if (tempNum < -30 || tempNum > 30) {
        newErrors.temperaturaObjetivo = 'La temperatura debe estar entre -30°C y 30°C.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const capacidadNum = Number(formData.capacidadMaxKg)
    const tempNum = Number(formData.temperaturaObjetivo)

    if (almacenEdit) {
      setAlmacenes(
        almacenes.map((a) =>
          a.id === almacenEdit.id
            ? {
                ...a,
                nombre: formData.nombre.trim(),
                tipo: formData.tipo,
                ubicacion: formData.ubicacion.trim(),
                responsable: formData.responsable.trim(),
                capacidadMaxKg: capacidadNum,
                requiereTemperatura: formData.requiereTemperatura,
                temperaturaObjetivo: formData.requiereTemperatura ? tempNum : undefined,
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
        tipo: formData.tipo,
        ubicacion: formData.ubicacion.trim(),
        responsable: formData.responsable.trim(),
        capacidadMaxKg: capacidadNum,
        requiereTemperatura: formData.requiereTemperatura,
        temperaturaObjetivo: formData.requiereTemperatura ? tempNum : undefined,
        descripcion: formData.descripcion.trim(),
        totalInsumos: 0,
        estado: 'Activo',
      }
      setAlmacenes([nuevo, ...almacenes])
      setMensaje({ tipo: 'ok', texto: 'Nueva área de almacén creada con éxito.' })
    }

    setIsModalOpen(false)
  }

  const getTipoBadgeClass = (tipo: AlmacenArea['tipo']) => {
    switch (tipo) {
      case 'Congelado':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200'
      case 'Refrigerado':
        return 'bg-sky-50 text-sky-600 border-sky-200'
      case 'Temperatura Ambiente':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Suministros':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      

      {/* Content Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-48 p-4 border-r border-slate-200 min-h-[calc(100vh-3rem)] bg-white space-y-6">
          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">TIPO DE ÁREA</h3>
            <ul className="space-y-1">
              {Object.entries(tiposConteo).map(([tipo, count]) => {
                const isSelected = tipoSeleccionado === tipo
                return (
                  <li key={tipo}>
                    <button
                      onClick={() => setTipoSeleccionado(tipo)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left ${
                        isSelected ? 'bg-cyan-50 text-cyan-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-600' : 'bg-slate-300'}`}></span>
                        {tipo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">ESTADO DEL ÁREA</h3>
            <ul className="space-y-1">
              {[
                { name: 'Todos', color: 'bg-slate-300' },
                { name: 'Activo', color: 'bg-emerald-500' },
                { name: 'Inactivo', color: 'bg-slate-400' },
              ].map((st) => {
                const isSelected = filtroEstado === st.name
                return (
                  <li key={st.name}>
                    <button
                      onClick={() => setFiltroEstado(st.name)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left ${
                        isSelected ? 'bg-cyan-50 text-cyan-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${st.color}`}></span>
                      <span>{st.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                INFRAESTRUCTURA • CEVICHERÍA
              </p>
              <h1 className="text-xl font-serif font-bold text-slate-800">Áreas de Almacenamiento</h1>
              <p className="text-slate-500 text-[11px]">
                {totalActivos} áreas activas configuradas para resguardo e inocuidad de alimentos
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-3.5 py-2 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} weight="bold" />
              <span>Registrar Nueva Área</span>
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
                {mensaje.tipo === 'ok' ? <CheckCircle size={16} /> : <Warning size={16} />}
                <span>{mensaje.texto}</span>
              </div>
              <button onClick={() => setMensaje(null)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-cyan-600 font-mono">{totalAlmacenes}</div>
              <div className="font-semibold text-slate-700 text-[11px]">Total Áreas</div>
              <div className="text-[10px] text-slate-400">registradas en el local</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-emerald-600 font-mono">{totalActivos}</div>
              <div className="font-semibold text-slate-700 text-[11px]">Áreas Operativas</div>
              <div className="text-[10px] text-slate-400">disponibles</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-indigo-600 font-mono">{totalClimatizados}</div>
              <div className="font-semibold text-indigo-700 text-[11px]">Cadena de Frío</div>
              <div className="text-[10px] text-slate-400">cámaras y cavas</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-slate-700 font-mono">{totalInsumosAlojados}</div>
              <div className="font-semibold text-slate-700 text-[11px]">Insumos Distribuidos</div>
              <div className="text-[10px] text-slate-400">en inventario</div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded p-2">
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlass size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por área, insumo resguardado, ubicación o responsable..."
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

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 w-1/3">ÁREA / INSUMOS GUARDADOS</th>
                  <th className="py-2.5 px-4">TIPO</th>
                  <th className="py-2.5 px-4">UBICACIÓN</th>
                  <th className="py-2.5 px-4">RESPONSABLE</th>
                  <th className="py-2.5 px-4">CAPACIDAD</th>
                  <th className="py-2.5 px-4">TEMP. CONTROL</th>
                  <th className="py-2.5 px-4">ESTADO</th>
                  <th className="py-2.5 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {almacenesFiltrados.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      item.estado === 'Inactivo' ? 'opacity-50 bg-slate-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                          <Warehouse size={14} />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-800">{item.nombre}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.codigo} • {item.totalInsumos} insumos registrados
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug bg-slate-50 p-1.5 rounded border border-slate-100">
                            <span className="font-semibold text-slate-600">Insumos:</span> {item.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium border rounded-full ${getTipoBadgeClass(
                          item.tipo
                        )}`}
                      >
                        {item.tipo}
                      </span>
                    </td>

                    <td className="py-3 px-4 align-top text-slate-600 text-[11px]">{item.ubicacion}</td>

                    <td className="py-3 px-4 align-top text-slate-600 text-[11px]">{item.responsable}</td>

                    <td className="py-3 px-4 align-top font-mono text-slate-700 font-medium">
                      {item.capacidadMaxKg} kg
                    </td>

                    <td className="py-3 px-4 align-top">
                      {item.requiereTemperatura ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600 font-medium font-mono">
                          <ThermometerCold size={14} />
                          {item.temperaturaObjetivo}°C
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    <td className="py-3 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.estado === 'Activo' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        ></span>
                        {item.estado}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="Editar Área"
                        >
                          <PencilSimple size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleEstado(item)}
                          className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title={item.estado === 'Activo' ? 'Desactivar Área' : 'Activar Área'}
                        >
                          <Prohibit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-800">
                {almacenEdit ? `Editar Área (${almacenEdit.codigo})` : 'Registrar Nueva Área de Almacén'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selector de plantilla si se está creando */}
            {!almacenEdit && (
              <div className="bg-cyan-50/60 border border-cyan-100 p-3 rounded-lg space-y-1.5">
                <label className="block font-semibold text-cyan-900 text-xs flex items-center gap-1.5">
                  <Info size={14} className="text-cyan-600" /> Cargar Plantilla de Cevichería:
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleSeleccionarPlantilla(e.target.value)}
                    defaultValue=""
                    className="w-full p-2 bg-white border border-cyan-200 rounded text-xs text-slate-700 focus:outline-none cursor-pointer pr-8"
                  >
                    <option value="" disabled>-- Selecciona un tipo de almacén estándar --</option>
                    {PLANTILLAS_CEVICHERIA.map((p) => (
                      <option key={p.nombre} value={p.nombre}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <CaretDown size={14} className="absolute right-2.5 top-2.5 text-cyan-600 pointer-events-none" />
                </div>
              </div>
            )}

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
                  Insumos Resguardados / Descripción del Área
                </label>
                <textarea
                  rows={2}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-600 focus:bg-white text-slate-700"
                  placeholder="Especifique qué insumos se guardan en esta área..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">Tipo de Ambiente</label>
                  <div className="relative">
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as AlmacenArea['tipo'] })}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:border-cyan-600 focus:bg-white pr-8 text-slate-700 cursor-pointer"
                    >
                      <option value="Refrigerado">Refrigerado</option>
                      <option value="Congelado">Congelado</option>
                      <option value="Temperatura Ambiente">Temperatura Ambiente</option>
                      <option value="Suministros">Suministros</option>
                    </select>
                    <CaretDown size={14} className="absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Capacidad Máx. (Kg) <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacidadMaxKg}
                    onChange={(e) => {
                      setFormData({ ...formData, capacidadMaxKg: e.target.value })
                      if (errors.capacidadMaxKg) setErrors({ ...errors, capacidadMaxKg: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.capacidadMaxKg
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                  />
                  {errors.capacidadMaxKg && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.capacidadMaxKg}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Responsable / Encargado <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={(e) => {
                      setFormData({ ...formData, responsable: e.target.value })
                      if (errors.responsable) setErrors({ ...errors, responsable: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.responsable
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                    placeholder="Ej. Maestro Cevichero"
                  />
                  {errors.responsable && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.responsable}</p>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.requiereTemperatura}
                    onChange={(e) => {
                      setFormData({ ...formData, requiereTemperatura: e.target.checked })
                      if (!e.target.checked && errors.temperaturaObjetivo) {
                        setErrors({ ...errors, temperaturaObjetivo: undefined })
                      }
                    }}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-700">
                    Requiere Control de Temperatura (°C)
                  </span>
                </label>
              </div>

              {formData.requiereTemperatura && (
                <div className="pl-6 pt-1">
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Temperatura Objetivo (°C) <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.temperaturaObjetivo}
                    onChange={(e) => {
                      setFormData({ ...formData, temperaturaObjetivo: e.target.value })
                      if (errors.temperaturaObjetivo) setErrors({ ...errors, temperaturaObjetivo: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.temperaturaObjetivo
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                    placeholder="Ej. -18 o 4"
                  />
                  {errors.temperaturaObjetivo && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.temperaturaObjetivo}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0092B8] hover:bg-[#007A9A] text-white font-medium rounded-lg shadow-sm transition-colors"
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
