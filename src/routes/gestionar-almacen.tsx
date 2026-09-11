import { createFileRoute } from '@tanstack/react-router'
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
} from '@phosphor-icons/react'

export const Route = createFileRoute('/gestionar-almacen')({
  component: GestionarInsumosPage,
})

interface Insumo {
  id: string
  codigo: string
  nombre: string
  categoria: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  stockAbasto: number
  esPerecedero: boolean
  fechaVencimiento?: string
  proveedor: string
  estado: 'Activo' | 'Inactivo'
  estadoStock: 'OK' | 'Bajo' | 'Crítico'
}

const INSUMOS_MOCK: Insumo[] = [
  { id: '1', codigo: 'INS-0001', nombre: 'Filete de Lenguado', categoria: 'Pescados', unidadMedida: 'kg', stockActual: 8, stockMinimo: 10, stockAbasto: 25, esPerecedero: true, fechaVencimiento: '2026-09-15', proveedor: 'Pesquera Miramar S.A.C.', estado: 'Activo', estadoStock: 'Bajo' },
  { id: '2', codigo: 'INS-0002', nombre: 'Camarón Gigante', categoria: 'Mariscos', unidadMedida: 'kg', stockActual: 3, stockMinimo: 5, stockAbasto: 15, esPerecedero: true, fechaVencimiento: '2026-09-12', proveedor: 'Distribuidora Costa Azul', estado: 'Activo', estadoStock: 'Crítico' },
  { id: '3', codigo: 'INS-0003', nombre: 'Pulpo Rojo', categoria: 'Mariscos', unidadMedida: 'kg', stockActual: 12, stockMinimo: 8, stockAbasto: 30, esPerecedero: true, fechaVencimiento: '2026-09-20', proveedor: 'Distribuidora Costa Azul', estado: 'Activo', estadoStock: 'OK' },
  { id: '4', codigo: 'INS-0004', nombre: 'Ají Amarillo', categoria: 'Verduras', unidadMedida: 'kg', stockActual: 2, stockMinimo: 5, stockAbasto: 20, esPerecedero: true, fechaVencimiento: '2026-09-11', proveedor: 'Mercado Central Lima', estado: 'Activo', estadoStock: 'Crítico' },
  { id: '5', codigo: 'INS-0005', nombre: 'Limón Sutil', categoria: 'Verduras', unidadMedida: 'kg', stockActual: 15, stockMinimo: 10, stockAbasto: 40, esPerecedero: true, fechaVencimiento: '2026-09-18', proveedor: 'Mercado Central Lima', estado: 'Activo', estadoStock: 'OK' },
  { id: '6', codigo: 'INS-0006', nombre: 'Cerveza Cristal', categoria: 'Bebidas', unidadMedida: 'caja', stockActual: 6, stockMinimo: 5, stockAbasto: 20, esPerecedero: false, proveedor: 'Backus S.A.', estado: 'Activo', estadoStock: 'OK' },
  { id: '7', codigo: 'INS-0007', nombre: 'Culantro Fresco', categoria: 'Verduras', unidadMedida: 'kg', stockActual: 8, stockMinimo: 10, stockAbasto: 20, esPerecedero: true, fechaVencimiento: '2026-09-14', proveedor: 'Mercado Central Lima', estado: 'Activo', estadoStock: 'Bajo' },
  { id: '8', codigo: 'INS-0008', nombre: 'Envase Cevichero 32 oz', categoria: 'Envases', unidadMedida: 'caja', stockActual: 4, stockMinimo: 10, stockAbasto: 30, esPerecedero: false, proveedor: 'Proveedora Pack Perú', estado: 'Activo', estadoStock: 'Crítico' },
  { id: '9', codigo: 'INS-0009', nombre: 'Sal de Mesa', categoria: 'Condimentos', unidadMedida: 'kg', stockActual: 10, stockMinimo: 5, stockAbasto: 25, esPerecedero: false, proveedor: 'Alicorp S.A.', estado: 'Activo', estadoStock: 'OK' },
  { id: '10', codigo: 'INS-0010', nombre: 'Alga Marina Wakame', categoria: 'Abarrotes', unidadMedida: 'g', stockActual: 500, stockMinimo: 200, stockAbasto: 1000, esPerecedero: false, proveedor: 'Asia Foods Import', estado: 'Inactivo', estadoStock: 'OK' },
]

interface FormErrors {
  nombre?: string
  stockActual?: string
  stockMinimo?: string
  stockAbasto?: string
  proveedor?: string
  fechaVencimiento?: string
}

export function GestionarInsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>(INSUMOS_MOCK)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos')
  const [estadoStockSeleccionado, setEstadoStockSeleccionado] = useState<string>('Todos')
  const [filtroEstadoGeneral, setFiltroEstadoGeneral] = useState<string>('Todos')
  const [busqueda, setBusqueda] = useState<string>('')

  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error' | 'alerta'; texto: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [insumoEdit, setInsumoEdit] = useState<Insumo | null>(null)

  // Form State & Validation Errors
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Mariscos',
    unidadMedida: 'kg',
    stockActual: '0',
    stockMinimo: '5',
    stockAbasto: '20',
    esPerecedero: false,
    fechaVencimiento: '',
    proveedor: '',
  })

  // Conteo de métricas
  const totalInsumos = insumos.length
  const totalActivos = insumos.filter((i) => i.estado === 'Activo').length
  const totalStockBajo = insumos.filter((i) => i.estadoStock === 'Bajo' && i.estado === 'Activo').length
  const totalCritico = insumos.filter((i) => i.estadoStock === 'Crítico' && i.estado === 'Activo').length

  const categoriasConteo = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: insumos.length,
      Mariscos: 0,
      Pescados: 0,
      Verduras: 0,
      Condimentos: 0,
      Bebidas: 0,
      Envases: 0,
      Abarrotes: 0,
    }
    insumos.forEach((i) => {
      if (counts[i.categoria] !== undefined) counts[i.categoria]++
    })
    return counts
  }, [insumos])

  const insumosFiltrados = useMemo(() => {
    return insumos.filter((item) => {
      const coincideBusqueda =
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busqueda.toLowerCase())

      const coincideCategoria =
        categoriaSeleccionada === 'Todos' || item.categoria === categoriaSeleccionada

      const coincideEstadoStock =
        estadoStockSeleccionado === 'Todos' || item.estadoStock === estadoStockSeleccionado

      const coincideEstadoGeneral =
        filtroEstadoGeneral === 'Todos' || item.estado === filtroEstadoGeneral

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideEstadoStock &&
        coincideEstadoGeneral
      )
    })
  }, [insumos, busqueda, categoriaSeleccionada, estadoStockSeleccionado, filtroEstadoGeneral])

  const handleOpenCreate = () => {
    setInsumoEdit(null)
    setFormData({
      nombre: '',
      categoria: 'Mariscos',
      unidadMedida: 'kg',
      stockActual: '0',
      stockMinimo: '5',
      stockAbasto: '20',
      esPerecedero: false,
      fechaVencimiento: '',
      proveedor: '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleOpenEdit = (insumo: Insumo) => {
    setInsumoEdit(insumo)
    setFormData({
      nombre: insumo.nombre,
      categoria: insumo.categoria,
      unidadMedida: insumo.unidadMedida,
      stockActual: insumo.stockActual.toString(),
      stockMinimo: insumo.stockMinimo.toString(),
      stockAbasto: insumo.stockAbasto.toString(),
      esPerecedero: insumo.esPerecedero,
      fechaVencimiento: insumo.fechaVencimiento || '',
      proveedor: insumo.proveedor,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const handleToggleEstado = (insumo: Insumo) => {
    const nuevoEstado = insumo.estado === 'Activo' ? 'Inactivo' : 'Activo'
    setInsumos(insumos.map((i) => (i.id === insumo.id ? { ...i, estado: nuevoEstado } : i)))
    setMensaje({
      tipo: nuevoEstado === 'Inactivo' ? 'alerta' : 'ok',
      texto: `Insumo "${insumo.nombre}" marcado como ${nuevoEstado.toLowerCase()}.`,
    })
  }

  // Validaciones exhaustivas del formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const stockActualNum = Number(formData.stockActual)
    const stockMinimoNum = Number(formData.stockMinimo)
    const stockAbastoNum = Number(formData.stockAbasto)

    // 1. Nombre del insumo
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del insumo es obligatorio.'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.'
    } else {
      // Regla CUS06 / Flujo C: Validar insumo duplicado
      const existeDuplicado = insumos.some(
        (i) =>
          i.id !== insumoEdit?.id &&
          i.nombre.toLowerCase().trim() === formData.nombre.toLowerCase().trim()
      )
      if (existeDuplicado) {
        newErrors.nombre = 'Este insumo ya se encuentra registrado.'
      }
    }

    // 2. Stock Actual
    if (formData.stockActual === '' || isNaN(stockActualNum)) {
      newErrors.stockActual = 'Ingresa un valor válido.'
    } else if (stockActualNum < 0) {
      newErrors.stockActual = 'No se permite stock negativo.'
    }

    // 3. Stock Mínimo
    if (formData.stockMinimo === '' || isNaN(stockMinimoNum)) {
      newErrors.stockMinimo = 'Ingresa un valor válido.'
    } else if (stockMinimoNum < 0) {
      newErrors.stockMinimo = 'El stock mínimo no puede ser negativo.'
    }

    // 4. Stock Abasto
    if (formData.stockAbasto === '' || isNaN(stockAbastoNum)) {
      newErrors.stockAbasto = 'Ingresa un valor válido.'
    } else if (stockAbastoNum <= 0) {
      newErrors.stockAbasto = 'El stock de abasto debe ser mayor a 0.'
    } else if (!isNaN(stockMinimoNum) && stockAbastoNum < stockMinimoNum) {
      newErrors.stockAbasto = 'El stock de abasto debe ser mayor o igual al mínimo.'
    }

    // 5. Proveedor
    if (!formData.proveedor.trim()) {
      newErrors.proveedor = 'El proveedor es obligatorio.'
    } else if (formData.proveedor.trim().length < 2) {
      newErrors.proveedor = 'Ingresa un nombre de proveedor válido.'
    }

    // 6. Fecha de vencimiento si es perecedero
    if (formData.esPerecedero && !formData.fechaVencimiento) {
      newErrors.fechaVencimiento = 'Selecciona la fecha de vencimiento.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const stockActualNum = Number(formData.stockActual)
    const stockMinimoNum = Number(formData.stockMinimo)
    const stockAbastoNum = Number(formData.stockAbasto)

    let nivelStock: 'OK' | 'Bajo' | 'Crítico' = 'OK'
    if (stockActualNum <= stockMinimoNum / 2) {
      nivelStock = 'Crítico'
    } else if (stockActualNum <= stockMinimoNum) {
      nivelStock = 'Bajo'
    }

    if (insumoEdit) {
      setInsumos(
        insumos.map((i) =>
          i.id === insumoEdit.id
            ? {
                ...i,
                nombre: formData.nombre.trim(),
                categoria: formData.categoria,
                unidadMedida: formData.unidadMedida,
                stockActual: stockActualNum,
                stockMinimo: stockMinimoNum,
                stockAbasto: stockAbastoNum,
                esPerecedero: formData.esPerecedero,
                fechaVencimiento: formData.esPerecedero ? formData.fechaVencimiento : undefined,
                proveedor: formData.proveedor.trim(),
                estadoStock: nivelStock,
              }
            : i
        )
      )
      setMensaje({ tipo: 'ok', texto: 'Insumo actualizado con éxito.' })
    } else {
      const nuevo: Insumo = {
        id: Date.now().toString(),
        codigo: `INS-00${(insumos.length + 1).toString().padStart(2, '0')}`,
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        unidadMedida: formData.unidadMedida,
        stockActual: stockActualNum,
        stockMinimo: stockMinimoNum,
        stockAbasto: stockAbastoNum,
        esPerecedero: formData.esPerecedero,
        fechaVencimiento: formData.esPerecedero ? formData.fechaVencimiento : undefined,
        proveedor: formData.proveedor.trim(),
        estado: 'Activo',
        estadoStock: nivelStock,
      }
      setInsumos([nuevo, ...insumos])

      // Flujo D: Alerta si el stock registrado ingresa con estado crítico o bajo
      if (nivelStock === 'Crítico' || nivelStock === 'Bajo') {
        setMensaje({
          tipo: 'alerta',
          texto: `Insumo registrado exitosamente. ¡Alerta! El stock actual (${stockActualNum}) está en nivel ${nivelStock.toLowerCase()}.`,
        })
      } else {
        setMensaje({ tipo: 'ok', texto: 'Nuevo insumo registrado con éxito.' })
      }
    }

    setIsModalOpen(false)
  }

  const getCategoriaBadgeClass = (categoria: string) => {
    switch (categoria) {
      case 'Pescados':
      case 'Mariscos':
        return 'bg-sky-50 text-sky-600 border-sky-200'
      case 'Verduras':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'Bebidas':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'Envases':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'Condimentos':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'Abarrotes':
        return 'bg-orange-50 text-orange-600 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getStockBarColor = (item: Insumo) => {
    if (item.estadoStock === 'Crítico') return 'bg-amber-500'
    if (item.estadoStock === 'Bajo') return 'bg-amber-400'
    return 'bg-emerald-500'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      {/* Top Navbar */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">
              R
            </div>
            <span className="font-semibold text-slate-800 text-xs tracking-tight">
              RESTAURANTE <span className="font-normal text-slate-500">Almacén</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-800">Dashboard</a>
            <a href="#" className="text-cyan-600 font-semibold border-b-2 border-cyan-600 py-3">Insumos</a>
            <a href="#" className="hover:text-slate-800">Compras</a>
            <a href="#" className="hover:text-slate-800">Recetas</a>
            <a href="#" className="hover:text-slate-800">Reportes</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>3 alertas</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-[10px]">
            EA
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-48 p-4 border-r border-slate-200 min-h-[calc(100vh-3rem)] bg-white space-y-6">
          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">CATEGORÍAS</h3>
            <ul className="space-y-1">
              {Object.entries(categoriasConteo).map(([cat, count]) => {
                const isSelected = categoriaSeleccionada === cat
                return (
                  <li key={cat}>
                    <button
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left ${
                        isSelected ? 'bg-cyan-50 text-cyan-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-600' : 'bg-slate-300'}`}></span>
                        {cat}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">ESTADO DE STOCK</h3>
            <ul className="space-y-1">
              {[
                { name: 'Todos', color: 'bg-slate-300' },
                { name: 'OK', color: 'bg-emerald-500' },
                { name: 'Bajo', color: 'bg-amber-400' },
                { name: 'Crítico', color: 'bg-rose-500' },
              ].map((st) => {
                const isSelected = estadoStockSeleccionado === st.name
                return (
                  <li key={st.name}>
                    <button
                      onClick={() => setEstadoStockSeleccionado(st.name)}
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
                CUS06 • MÓDULO DE ALMACÉN
              </p>
              <h1 className="text-xl font-serif font-bold text-slate-800">Gestión de Insumos</h1>
              <p className="text-slate-500 text-[11px]">
                {totalActivos} insumos activos de {totalInsumos} registrados
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-3.5 py-2 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} weight="bold" />
              <span>Registrar Insumo</span>
            </button>
          </div>

          {/* Mensajes Globales */}
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
              <div className="text-lg font-semibold text-cyan-600 font-mono">{totalInsumos}</div>
              <div className="font-semibold text-slate-700 text-[11px]">Total insumos</div>
              <div className="text-[10px] text-slate-400">registrados</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-emerald-600 font-mono">{totalActivos}</div>
              <div className="font-semibold text-slate-700 text-[11px]">Activos</div>
              <div className="text-[10px] text-slate-400">disponibles</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-amber-500 font-mono">{totalStockBajo}</div>
              <div className="font-semibold text-amber-600 text-[11px]">Stock bajo</div>
              <div className="text-[10px] text-slate-400">alertas activas</div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-3">
              <div className="text-lg font-semibold text-rose-500 font-mono">{totalCritico}</div>
              <div className="font-semibold text-rose-600 text-[11px]">Crítico / sin stock</div>
              <div className="text-[10px] text-slate-400">requieren acción</div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded p-2">
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlass size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o proveedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-transparent border-none text-xs text-slate-700 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <select
                  value={filtroEstadoGeneral}
                  onChange={(e) => setFiltroEstadoGeneral(e.target.value)}
                  className="bg-transparent text-slate-600 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Activo">Solo Activos</option>
                  <option value="Inactivo">Solo Inactivos</option>
                </select>
                <CaretDown size={12} />
              </div>

              <span className="border-l border-slate-200 pl-3 font-mono">
                {insumosFiltrados.length} resultados
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4">INSUMO</th>
                  <th className="py-2.5 px-4">CATEGORÍA</th>
                  <th className="py-2.5 px-4 w-48">STOCK</th>
                  <th className="py-2.5 px-4">ESTADO</th>
                  <th className="py-2.5 px-4">PROVEEDOR</th>
                  <th className="py-2.5 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {insumosFiltrados.map((item) => {
                  const pct = Math.min(100, Math.round((item.stockActual / item.stockAbasto) * 100))

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.estado === 'Inactivo' ? 'opacity-50 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[9px] shrink-0">
                            {item.nombre.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{item.nombre}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.codigo}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-medium border rounded-full ${getCategoriaBadgeClass(
                            item.categoria
                          )}`}
                        >
                          {item.categoria}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1 font-mono">
                            <span className="font-bold text-slate-800 text-xs">{item.stockActual}</span>
                            <span className="text-[10px] text-slate-500">{item.unidadMedida}</span>
                            {item.estadoStock === 'Crítico' && (
                              <span className="text-amber-600 text-[10px]">↓</span>
                            )}
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getStockBarColor(item)}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
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

                      <td className="py-3 px-4 text-slate-600 text-[11px]">{item.proveedor}</td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-400">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Editar"
                          >
                            <PencilSimple size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleEstado(item)}
                            className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title={item.estado === 'Activo' ? 'Dar de baja' : 'Activar'}
                          >
                            <Prohibit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal Formulario con Validaciones de la imagen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-800">
                {insumoEdit ? `Editar Insumo (${insumoEdit.codigo})` : 'Registrar Nuevo Insumo'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
              {/* Nombre del Insumo * */}
              <div>
                <label className="block mb-1.5 font-semibold text-slate-700">
                  Nombre del Insumo <span className="text-cyan-600">*</span>
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
                  placeholder="Ej. Filete de Lenguado"
                />
                {errors.nombre && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.nombre}</p>
                )}
              </div>

              {/* Categoría & Unidad de Medida */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">Categoría</label>
                  <div className="relative">
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:border-cyan-600 focus:bg-white pr-8 text-slate-700 cursor-pointer"
                    >
                      <option value="Mariscos">Mariscos</option>
                      <option value="Pescados">Pescados</option>
                      <option value="Verduras">Verduras</option>
                      <option value="Condimentos">Condimentos</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Envases">Envases</option>
                      <option value="Abarrotes">Abarrotes</option>
                    </select>
                    <CaretDown size={14} className="absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">Unidad de Medida</label>
                  <div className="relative">
                    <select
                      value={formData.unidadMedida}
                      onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                      className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:border-cyan-600 focus:bg-white pr-8 text-slate-700 cursor-pointer"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="caja">caja</option>
                      <option value="Unidades">Unidades</option>
                    </select>
                    <CaretDown size={14} className="absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Stock Actual *, Stock Mínimo *, Stock Abasto * */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Stock Actual <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.stockActual}
                    onChange={(e) => {
                      setFormData({ ...formData, stockActual: e.target.value })
                      if (errors.stockActual) setErrors({ ...errors, stockActual: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.stockActual
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                  />
                  {errors.stockActual && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.stockActual}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Stock Mínimo <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.stockMinimo}
                    onChange={(e) => {
                      setFormData({ ...formData, stockMinimo: e.target.value })
                      if (errors.stockMinimo) setErrors({ ...errors, stockMinimo: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.stockMinimo
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                  />
                  {errors.stockMinimo && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.stockMinimo}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Stock Abasto <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={formData.stockAbasto}
                    onChange={(e) => {
                      setFormData({ ...formData, stockAbasto: e.target.value })
                      if (errors.stockAbasto) setErrors({ ...errors, stockAbasto: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.stockAbasto
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                  />
                  {errors.stockAbasto && (
                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.stockAbasto}</p>
                  )}
                </div>
              </div>

              {/* Proveedor * */}
              <div>
                <label className="block mb-1.5 font-semibold text-slate-700">
                  Proveedor <span className="text-cyan-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => {
                    setFormData({ ...formData, proveedor: e.target.value })
                    if (errors.proveedor) setErrors({ ...errors, proveedor: undefined })
                  }}
                  className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                    errors.proveedor
                      ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                  }`}
                  placeholder="Ej. Distribuidora Costa Azul"
                />
                {errors.proveedor && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.proveedor}</p>
                )}
              </div>

              {/* Es Perecedero */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.esPerecedero}
                    onChange={(e) => {
                      setFormData({ ...formData, esPerecedero: e.target.checked })
                      if (!e.target.checked && errors.fechaVencimiento) {
                        setErrors({ ...errors, fechaVencimiento: undefined })
                      }
                    }}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-700">Es Perecedero</span>
                </label>
              </div>

              {/* Fecha de vencimiento condicional */}
              {formData.esPerecedero && (
                <div className="pl-6 pt-1">
                  <label className="block mb-1.5 font-semibold text-slate-700">
                    Fecha de Vencimiento <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={(e) => {
                      setFormData({ ...formData, fechaVencimiento: e.target.value })
                      if (errors.fechaVencimiento) setErrors({ ...errors, fechaVencimiento: undefined })
                    }}
                    className={`w-full p-2.5 bg-slate-50/70 border rounded-lg focus:outline-none transition-colors ${
                      errors.fechaVencimiento
                        ? 'border-rose-500 bg-rose-50/20 text-rose-900'
                        : 'border-slate-200 focus:border-cyan-600 focus:bg-white'
                    }`}
                  />
                  {errors.fechaVencimiento && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">
                      {errors.fechaVencimiento}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}