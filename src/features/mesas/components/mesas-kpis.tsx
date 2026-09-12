import React from 'react'
import {
  MagnifyingGlass,
  ArrowsClockwise,
  SquaresFour,
  Table,
} from '@phosphor-icons/react'
import type { VistaModo } from '../types/mesa'

interface MesasKPIsProps {
  total: number
  disponibles: number
  ocupadas: number
  pisoActivo: number
  busqueda: string
  onBusquedaChange: (val: string) => void
  onPisoChange: (piso: number) => void
  onActualizar: () => void
  vistaModo: VistaModo
  onVistaModoChange: (modo: VistaModo) => void
}

export const MesasKPIs: React.FC<MesasKPIsProps> = ({
  total,
  disponibles,
  ocupadas,
  pisoActivo,
  busqueda,
  onBusquedaChange,
  onPisoChange,
  onActualizar,
  vistaModo,
  onVistaModoChange,
}) => {
  const porcentaje = total > 0 ? Math.round((disponibles / total) * 100) : 0

  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
        {/* Lado izquierdo: Buscador primero, luego Pisos, Refrescar y Vista */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* 1. Buscador primero */}
          <div className="relative flex-1 min-w-[200px] max-w-xs sm:max-w-sm">
            <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar mesa o cliente..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
            />
          </div>

          {/* 2. Filtrado de pisos */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-2xs border border-slate-200/60">
            {[1, 2].map((piso) => (
              <button
                type="button"
                key={piso}
                onClick={() => onPisoChange(piso)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  pisoActivo === piso
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Piso {piso}
              </button>
            ))}
          </div>

          {/* 3. Botón de actualizar con icono de refrescar (ya no texto) */}
          <button
            type="button"
            onClick={onActualizar}
            className="p-2 border border-slate-200/90 bg-white hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Sincronizar mesas"
          >
            <ArrowsClockwise className="w-4 h-4 text-slate-600" />
          </button>

          {/* 4. Cambio de vista */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-1 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => onVistaModoChange('cuadricula')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                vistaModo === 'cuadricula'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vista de Salón (Tarjetas)"
            >
              <SquaresFour className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onVistaModoChange('tabla')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                vistaModo === 'tabla'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vista de Gestión (Tabla CUS)"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Todo a la derecha: Indicador de disponibilidad 4/6 */}
        <div className="flex items-center gap-3.5 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-4 border-slate-200/80 shrink-0 self-end lg:self-center">
          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {disponibles}/{total}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                disponibles
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              {ocupadas} {ocupadas === 1 ? 'ocupada' : 'ocupadas'} · Piso {pisoActivo}
            </p>
          </div>
          <div className="w-20 sm:w-24 bg-red-100 rounded-full h-2.5 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${porcentaje}%` }}
              title={`${disponibles} de ${total} disponibles`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
