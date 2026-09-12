import React, { useState, useEffect } from 'react'
import { X, Users, Chair } from '@phosphor-icons/react'
import type { Mesa } from '../types/mesa'

interface AgregarMesaDialogProps {
  isOpen: boolean
  mesaParaEditar?: Mesa | null
  onClose: () => void
  onGuardar: (mesaData: Omit<Mesa, 'id'> & { id?: number }) => void
}

export const AgregarMesaDialog: React.FC<AgregarMesaDialogProps> = ({
  isOpen,
  mesaParaEditar,
  onClose,
  onGuardar,
}) => {
  const [numero, setNumero] = useState(1)
  const [capacidad, setCapacidad] = useState(4)
  const [piso, setPiso] = useState(1)
  const [zona, setZona] = useState('Salón Central')
  const [ocupado, setOcupado] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    if (mesaParaEditar) {
      setNumero(mesaParaEditar.numero)
      setCapacidad(mesaParaEditar.capacidad)
      setPiso(mesaParaEditar.piso)
      setZona(mesaParaEditar.zona)
      setOcupado(mesaParaEditar.ocupado)
      setObservaciones(mesaParaEditar.observaciones || '')
    } else {
      setNumero(9)
      setCapacidad(4)
      setPiso(1)
      setZona('Salón Central')
      setOcupado(false)
      setObservaciones('')
    }
  }, [mesaParaEditar, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGuardar({
      ...(mesaParaEditar ? { id: mesaParaEditar.id } : {}),
      numero: Number(numero),
      capacidad: Number(capacidad),
      piso: Number(piso),
      zona,
      ocupado,
      observaciones,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Chair className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {mesaParaEditar ? `Editar Mesa ${mesaParaEditar.numero}` : 'Agregar Nueva Mesa'}
              </h3>
              <p className="text-xs text-slate-500">
                Configura la información y capacidad de la mesa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Preset rápido de Capacidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Capacidad común (Comensales)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((cap) => (
                <button
                  type="button"
                  key={cap}
                  onClick={() => setCapacidad(cap)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    capacidad === cap
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-700 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{cap} personas</span>
                </button>
              ))}
            </div>
          </div>

          {/* Número de Mesa y Capacidad personalizada */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de Mesa *
              </label>
              <input
                type="number"
                min={1}
                required
                value={numero}
                onChange={(e) => setNumero(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capacidad (personas) *
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={capacidad}
                onChange={(e) => setCapacidad(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-semibold"
              />
            </div>
          </div>

          {/* Piso y Ubicación/Zona */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Piso del restaurante *
              </label>
              <select
                value={piso}
                onChange={(e) => setPiso(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
              >
                <option value={1}>Piso 1</option>
                <option value={2}>Piso 2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zona / Ubicación *
              </label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
              >
                <option value="Salón Central">Salón Central</option>
                <option value="Salón Familiar">Salón Familiar</option>
                <option value="Rincón Terraza">Rincón Terraza</option>
                <option value="Balcón Vista">Balcón Vista</option>
                <option value="Zona Lounge">Zona Lounge</option>
                <option value="Zona VIP">Zona VIP</option>
                <option value="Terraza Panorámica VIP">Terraza Panorámica VIP</option>
              </select>
            </div>
          </div>

          {/* Estado inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estado inicial
            </label>
            <select
              value={ocupado ? 'ocupada' : 'desocupada'}
              onChange={(e) => setOcupado(e.target.value === 'ocupada')}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
            >
              <option value="desocupada">Desocupada (Disponible para clientes)</option>
              <option value="ocupada">Ocupada</option>
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observaciones adicionales
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Ubicada cerca al jardín, adecuada para niños o eventos..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              {mesaParaEditar ? 'Guardar Cambios' : 'Registrar Mesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
