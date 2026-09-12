import React from 'react'
import { Users, Clock } from '@phosphor-icons/react'
import type { Mesa } from '../types/mesa'

interface MesaCardProps {
  mesa: Mesa
  onGestionar: (mesa: Mesa) => void
}

export const MesaCard: React.FC<MesaCardProps> = ({ mesa, onGestionar }) => {
  const isOcupada = mesa.ocupado

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative ${isOcupada ? 'border-t-4 border-t-red-600' : 'border-t-4 border-t-emerald-600'
        }`}
    >
      <div className="p-5">
        {/* Header: Label + Number and Status Badge */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Mesa
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                Piso {mesa.piso}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none mt-1">
              {mesa.numero}
            </div>
          </div>

          <div>
            {isOcupada ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200/70 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                Ocupada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                Desocupada
              </span>
            )}
          </div>
        </div>

        {/* Capacity and details */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Capacidad: {mesa.capacidad} personas</span>
          </div>

          {/* If Ocupada, show client and time */}
          {isOcupada && mesa.pedidoActual ? (
            <div className="pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {mesa.pedidoActual.horaInicio} · {mesa.pedidoActual.comensales} personas
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800 truncate">
                {mesa.pedidoActual.cliente}
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-xs text-slate-400 italic">Mesa lista para recibir clientes</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onGestionar(mesa)}
          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer text-white text-center shadow-xs active:scale-[0.99] ${isOcupada
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
        >
          Gestionar
        </button>
      </div>
    </div>
  )
}
