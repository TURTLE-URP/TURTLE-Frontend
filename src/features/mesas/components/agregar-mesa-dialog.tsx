import React, { useState, useEffect, useMemo } from 'react'
import {
  X,
  Armchair,
  WarningCircle,
  Minus,
  Plus,
  CheckCircle,
} from '@phosphor-icons/react'
import type { Mesa } from '../types/mesa'

interface AgregarMesaDialogProps {
  isOpen: boolean
  mesaParaEditar: Mesa | null
  onClose: () => void
  onGuardar: (mesaData: Omit<Mesa, 'id'> & { id?: number }) => void
  mesasExistentes?: Mesa[]
}

const ZONAS_POR_PISO: Record<number, string[]> = {
  1: ['Salón Central', 'Salón Familiar', 'Rincón Terraza', 'Barra', 'Ventana'],
  2: ['Zona VIP', 'Balcón Vista', 'Zona Lounge', 'Terraza Panorámica VIP'],
}

const CAPACIDADES_RAPIDAS = [2, 4, 6, 8]

export const AgregarMesaDialog: React.FC<AgregarMesaDialogProps> = ({
  isOpen,
  mesaParaEditar,
  onClose,
  onGuardar,
  mesasExistentes = [],
}) => {
  const esEdicion = Boolean(mesaParaEditar)

  // ===== Estados del formulario =====
  const [numeroMesa, setNumeroMesa] = useState('')
  const [capacidad, setCapacidad] = useState(4)
  const [piso, setPiso] = useState<number>(1)
  const [zona, setZona] = useState('Salón Central')
  const [ocupado, setOcupado] = useState(false)
  const [observaciones, setObservaciones] = useState('')
  const [errorNumero, setErrorNumero] = useState<string | null>(null)

  // ===== Código autogenerado (solo informativo, no editable) =====
  const codigoAutogenerado = useMemo(() => {
    if (esEdicion && mesaParaEditar) {
      return `M-${String(mesaParaEditar.id).padStart(2, '0')}`
    }
    const maxId =
      mesasExistentes.length > 0
        ? Math.max(...mesasExistentes.map((m) => m.id))
        : 0
    return `M-${String(maxId + 1).padStart(2, '0')}`
  }, [esEdicion, mesaParaEditar, mesasExistentes])

  // ===== Precargar datos al abrir =====
  useEffect(() => {
    if (!isOpen) return

    if (mesaParaEditar) {
      setNumeroMesa(String(mesaParaEditar.numero))
      setCapacidad(mesaParaEditar.capacidad)
      setPiso(mesaParaEditar.piso)
      setZona(mesaParaEditar.zona)
      setOcupado(mesaParaEditar.ocupado)
      setObservaciones(mesaParaEditar.observaciones || '')
    } else {
      setNumeroMesa('')
      setCapacidad(4)
      setPiso(1)
      setZona(ZONAS_POR_PISO[1][0])
      setOcupado(false)
      setObservaciones('')
    }
    setErrorNumero(null)
  }, [isOpen, mesaParaEditar])

  // ===== Cambiar zona automáticamente al cambiar piso =====
  useEffect(() => {
    const zonasDelPiso = ZONAS_POR_PISO[piso] || []
    if (!zonasDelPiso.includes(zona)) {
      setZona(zonasDelPiso[0] || '')
    }
  }, [piso])

  // ===== Validación en tiempo real de número duplicado =====
  useEffect(() => {
    if (numeroMesa.trim() === '') {
      setErrorNumero(null)
      return
    }
    const num = Number(numeroMesa)

    if (isNaN(num) || num < 1 || num > 99) {
      setErrorNumero('El número debe estar entre 1 y 99')
      return
    }

    const duplicada = mesasExistentes.find(
      (m) => m.numero === num && m.id !== mesaParaEditar?.id
    )

    if (duplicada) {
      setErrorNumero(
        `El Nro ${num} ya existe (M-${String(duplicada.id).padStart(2, '0')})`
      )
    } else {
      setErrorNumero(null)
    }
  }, [numeroMesa, mesasExistentes, mesaParaEditar])

  if (!isOpen) return null

  // ===== Handlers =====
  const handleIncremento = () => {
    if (capacidad < 12) setCapacidad(capacidad + 1)
  }

  const handleDecremento = () => {
    if (capacidad > 1) setCapacidad(capacidad - 1)
  }

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    if (numeroMesa.trim() === '') {
      setErrorNumero('Este campo es obligatorio')
      return
    }
    if (errorNumero) return

    onGuardar({
      id: mesaParaEditar?.id,
      numero: Number(numeroMesa),
      capacidad,
      piso,
      zona,
      ocupado,
      observaciones: observaciones.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* ===== Header ===== */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Armchair className="w-6 h-6 text-emerald-600" weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {esEdicion ? `Editar Mesa ${codigoAutogenerado}` : 'Agregar Nueva Mesa'}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  {esEdicion ? 'Edición' : 'Borrador'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {esEdicion
                  ? 'Modifica la información y capacidad de la mesa'
                  : 'Configura la información y capacidad de la mesa'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ===== Body ===== */}
        <form
          onSubmit={handleGuardar}
          className="p-6 overflow-y-auto space-y-5 flex-1 text-sm"
        >
          {/* Código (solo lectura) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Código (auto, único, no editable)
            </label>
            <input
              type="text"
              value={codigoAutogenerado}
              disabled
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
            />
          </div>

          {/* Número de Mesa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Número de mesa (único 1-99) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
              placeholder="Ej: 13"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                errorNumero
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
              }`}
            />
            {errorNumero && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium mt-1.5 animate-in fade-in">
                <WarningCircle className="w-3.5 h-3.5" weight="fill" />
                <span>{errorNumero}</span>
              </div>
            )}
          </div>

          {/* Capacidad común (atajos rápidos) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Capacidad común (Comendales)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CAPACIDADES_RAPIDAS.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setCapacidad(cap)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    capacidad === cap
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: Math.min(cap, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border ${
                          capacidad === cap
                            ? 'border-emerald-500 bg-emerald-100'
                            : 'border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold">{cap} personas</span>
                </button>
              ))}
            </div>
          </div>

          {/* Capacidad (contador fino) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Capacidad (1-12 personas) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecremento}
                disabled={capacidad <= 1}
                className="w-11 h-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Minus className="w-4 h-4" weight="bold" />
              </button>

              <div className="w-20 h-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-800 font-bold text-lg bg-slate-50/60">
                {capacidad}
              </div>

              <button
                type="button"
                onClick={handleIncremento}
                disabled={capacidad >= 12}
                className="w-11 h-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" weight="bold" />
              </button>
            </div>
          </div>

          {/* Piso (radio estilo tarjeta) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Piso del restaurante <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {[1, 2].map((p) => (
                <label
                  key={p}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 cursor-pointer transition-all ${
                    piso === p
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="piso"
                    value={p}
                    checked={piso === p}
                    onChange={() => setPiso(p)}
                    className="sr-only"
                  />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      piso === p ? 'border-emerald-500' : 'border-slate-300'
                    }`}
                  >
                    {piso === p && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <span className="font-semibold text-sm">Piso {p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Zona / Ubicación */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Zona / Ubicación <span className="text-red-500">*</span>
            </label>
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              {(ZONAS_POR_PISO[piso] || []).map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Estado inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Estado inicial
            </label>
            <select
              value={ocupado ? 'ocupada' : 'desocupada'}
              onChange={(e) => setOcupado(e.target.value === 'ocupada')}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="desocupada">Desocupada (Disponible para clientes)</option>
              <option value="ocupada">Ocupada (Con clientes actualmente)</option>
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observaciones adicionales
            </label>
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Ubicada cerca al jardín, adecuada para niños o eventos..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* ===== Footer ===== */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleGuardar}
            disabled={Boolean(errorNumero) || numeroMesa.trim() === ''}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" weight="bold" />
            {esEdicion ? 'Guardar Cambios' : 'Registrar Mesa'}
          </button>
        </div>
      </div>
    </div>
  )
}