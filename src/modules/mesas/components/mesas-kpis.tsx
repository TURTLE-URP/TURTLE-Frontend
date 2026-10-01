import React from 'react'
import {
  MagnifyingGlassIcon,
  ArrowsClockwiseIcon,
  SquaresFourIcon,
  TableIcon,
  MagnifyingGlass,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import type { FiltroEstado, VistaModo } from '../interfaces/mesa'

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
  // NUEVAS PROPS para los filtros
  filtroEstado: FiltroEstado
  onFiltroEstadoChange: (filtro: FiltroEstado) => void
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
  vistaModo: _vistaModo,
  onVistaModoChange: _onVistaModoChange,
  filtroEstado,
  onFiltroEstadoChange,
}) => {
  const porcentaje = total > 0 ? Math.round((disponibles / total) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center gap-2">

      {/* 1. Buscador */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <MagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar mesa o cliente..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
        />
      </div>

      {/* 2. Pisos */}
      <div className="flex items-center gap-1.5">
        {[1, 2].map((piso) => (
          <button
            key={piso}
            type="button"
            onClick={() => onPisoChange(piso)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              pisoActivo === piso
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Piso {piso}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onFiltroEstadoChange('todas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filtroEstado === 'todas'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todas ({total})
        </button>
        <button
          type="button"
          onClick={() => onFiltroEstadoChange('desocupadas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filtroEstado === 'desocupadas'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Libres ({disponibles})
        </button>
        <button
          type="button"
          onClick={() => onFiltroEstadoChange('ocupadas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            filtroEstado === 'ocupadas'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Ocupadas ({ocupadas})
        </button>
      </div>

    

      <div className="flex items-center gap-3 ml-auto pl-4 border-l border-slate-200">
        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
          {disponibles}/{total}{' '}
          <span className="font-normal text-slate-500">disponibles</span>
        </span>
        <div className="w-20 bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

    </div>
  )
}
