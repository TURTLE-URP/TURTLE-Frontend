import React from 'react'
import { Eye, PencilSimple, Trash, Users, MapPin, CaretLeft, CaretRight } from '@phosphor-icons/react'
import type { Mesa } from '../types/mesa'

interface MesasTableProps {
  mesas: Mesa[]
  onGestionar: (mesa: Mesa) => void
  onEditar: (mesa: Mesa) => void
  onEliminar: (id: number) => void
}

export const MesasTable: React.FC<MesasTableProps> = ({
  mesas,
  onGestionar,
  onEditar,
  onEliminar,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const totalPages = Math.max(1, Math.ceil(mesas.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedMesas = mesas.slice(startIndex, startIndex + pageSize)

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-4">Mesa</th>
              <th className="py-3.5 px-4">Capacidad</th>
              <th className="py-3.5 px-4">Ubicación / Piso</th>
              <th className="py-3.5 px-4 text-center">Estado</th>
              <th className="py-3.5 px-4">Pedido / Cliente Actual</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedMesas.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No se encontraron mesas con los filtros seleccionados
                </td>
              </tr>
            ) : (
              paginatedMesas.map((mesa) => {
                const isOcupada = mesa.ocupado
                return (
                  <tr
                    key={mesa.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-4 px-5 font-mono text-xs text-slate-400 font-medium">
                      #{mesa.id.toString().padStart(2, '0')}
                    </td>

                    {/* Mesa */}
                    <td className="py-4 px-4 font-bold text-slate-800">
                      Mesa {mesa.numero}
                    </td>

                    {/* Capacidad */}
                    <td className="py-4 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {mesa.capacidad} personas
                      </span>
                    </td>

                    {/* Ubicación */}
                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Piso {mesa.piso} · {mesa.zona}</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 text-center">
                      {isOcupada ? (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          Ocupada
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Desocupada
                        </span>
                      )}
                    </td>

                    {/* Pedido / Cliente Actual */}
                    <td className="py-4 px-4">
                      {isOcupada && mesa.pedidoActual ? (
                        <div>
                          <div className="font-medium text-slate-800 text-xs">
                            {mesa.pedidoActual.cliente}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {mesa.pedidoActual.idPedido} · Total: <strong className="text-slate-700 font-semibold">S/ {mesa.pedidoActual.total.toFixed(2)}</strong>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">— Sin comensales —</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Ver / Gestionar comanda */}
                        <button
                          type="button"
                          onClick={() => onGestionar(mesa)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Gestionar mesa y pedido"
                        >
                          <Eye className="w-4 h-4" weight="bold" />
                        </button>

                        {/* Editar */}
                        <button
                          type="button"
                          onClick={() => onEditar(mesa)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Editar capacidad / datos"
                        >
                          <PencilSimple className="w-4 h-4" weight="bold" />
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => onEliminar(mesa.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar mesa"
                        >
                          <Trash className="w-4 h-4" weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (idéntico al de las capturas de SWEFIRE / CUS) */}
      <div className="p-4 px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <span>Tamaño de Página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-slate-200 bg-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CaretLeft className="w-3.5 h-3.5" />
            Anterior
          </button>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            Siguiente
            <CaretRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <span>Página</span>
          <span className="font-semibold text-slate-800">{currentPage}</span>
          <span>de</span>
          <span className="font-semibold text-slate-800">{totalPages}</span>
        </div>
      </div>
    </div>
  )
}
