import React, { useState } from 'react'
import {
  X,
  Clock,
  CookingPot,
  CreditCard,
  Money,
  DeviceMobile,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
} from '@phosphor-icons/react'
import type { Mesa, PedidoLocal } from '../types/mesa'

interface GestionarMesaDialogProps {
  mesa: Mesa | null
  isOpen: boolean
  onClose: () => void
  onLiberarMesa: (id: number) => void
  onOcuparMesa: (id: number, nuevoPedido: PedidoLocal) => void
}

export const GestionarMesaDialog: React.FC<GestionarMesaDialogProps> = ({
  mesa,
  isOpen,
  onClose,
  onLiberarMesa,
  onOcuparMesa,
}) => {
  // Estados para Registro de Cliente (Anfitrión - Flujo Principal Paso 3)
  const [nuevoCliente, setNuevoCliente] = useState('')
  const [nuevoDni, setNuevoDni] = useState('')
  const [comensales, setComensales] = useState(2)
  const [mozo, setMozo] = useState('Roberto Sánchez')

  // Estados para Pago y Liberación (Mozo - Flujo Principal Paso 6 y 7, RN 2, RN 6)
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'yape'>('efectivo')
  const [comprobante, setComprobante] = useState<'boleta' | 'factura'>('boleta')
  const [mostrarConfirmacionPago, setMostrarConfirmacionPago] = useState(false)

  if (!isOpen || !mesa) return null

  const isOcupada = mesa.ocupado
  const pedido = mesa.pedidoActual

  // RN 4: Validación de aforo máximo
  const superaAforo = Number(comensales) > mesa.capacidad

  const handleOcupar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoCliente.trim()) return

    // RN 4: Bloquear si supera aforo
    if (superaAforo) {
      return
    }

    // Paso 4: Creación de pedido y ocupación automática
    const nuevoPedido: PedidoLocal = {
      idPedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente: nuevoCliente.trim(),
      dni: nuevoDni.trim() || 'No especificado',
      horaInicio: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      comensales: Number(comensales),
      mozo: mozo,
      tiempoMinutos: 5,
      subtotal: 42.37,
      igv: 7.63,
      total: 50.0,
      estadoComanda: 'en_preparacion',
      items: [
        {
          id: 'item-new-1',
          nombre: 'Plato del Día Ejecutivo',
          cantidad: Number(comensales),
          precio: 25.0,
          categoria: 'Plato de Fondo',
        },
      ],
    }

    onOcuparMesa(mesa.id, nuevoPedido)
    setNuevoCliente('')
    setNuevoDni('')
    onClose()
  }

  const handleProcesarPagoYLiberar = () => {
    // Paso 6 y 7: Confirmación de pago y cambio de estado a Desocupada
    onLiberarMesa(mesa.id)
    setMostrarConfirmacionPago(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-xs ${
                isOcupada ? 'bg-red-600 shadow-red-600/20' : 'bg-emerald-600 shadow-emerald-600/20'
              }`}
            >
              {mesa.numero}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Mesa {mesa.numero}</h3>
                {isOcupada ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase">
                    ● Ocupada
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    ● Desocupada
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {mesa.zona} · Capacidad máxima: <strong>{mesa.capacidad} personas</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {isOcupada && pedido ? (
            <>
              {/* Info Cliente y Mozo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Cliente Registrado
                  </span>
                  <span className="font-semibold text-slate-800 text-xs truncate block">
                    {pedido.cliente}
                  </span>
                  <span className="text-[10px] text-slate-500">DNI: {pedido.dni || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Comensales
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {pedido.comensales} de {mesa.capacidad} personas
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Hora Recepción
                  </span>
                  <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {pedido.horaInicio} ({pedido.tiempoMinutos}m)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Mozo Responsable
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">{pedido.mozo}</span>
                </div>
              </div>

              {/* Comanda en Cocina */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CookingPot className="w-4 h-4 text-emerald-600" />
                    Comanda de la Mesa
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      pedido.estadoComanda === 'servido'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {pedido.estadoComanda === 'servido' ? '✓ Servido en mesa' : '🍳 En cocina'}
                  </span>
                </div>

                {/* Tabla de Items */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                      <tr>
                        <th className="py-2 px-3">Cant.</th>
                        <th className="py-2 px-3">Platillo / Bebida</th>
                        <th className="py-2 px-3 text-right">P. Unit</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pedido.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-emerald-700">
                            {item.cantidad}x
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            {item.nombre}
                            <span className="text-[10px] text-slate-400 block">
                              {item.categoria}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-600">
                            S/ {item.precio.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                            S/ {(item.cantidad * item.precio).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen Financiero */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>S/ {pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>I.G.V. (18%):</span>
                  <span>S/ {pedido.igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Saldo Pendiente de Pago:</span>
                  <span className="text-red-600 text-base">S/ {pedido.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Sección de Pago / Cierre (RN 2 & RN 6 & Paso 6) */}
              {mostrarConfirmacionPago ? (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cobro y Cierre de Cuenta</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Método de Pago:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMetodoPago('efectivo')}
                          className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                            metodoPago === 'efectivo'
                              ? 'border-emerald-600 bg-white text-emerald-700 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600'
                          }`}
                        >
                          <Money className="w-4 h-4 mx-auto mb-0.5" />
                          Efectivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetodoPago('tarjeta')}
                          className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                            metodoPago === 'tarjeta'
                              ? 'border-emerald-600 bg-white text-emerald-700 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mx-auto mb-0.5" />
                          Tarjeta
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetodoPago('yape')}
                          className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                            metodoPago === 'yape'
                              ? 'border-emerald-600 bg-white text-emerald-700 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600'
                          }`}
                        >
                          <DeviceMobile className="w-4 h-4 mx-auto mb-0.5" />
                          Yape/Plin
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Comprobante de Pago:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setComprobante('boleta')}
                          className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                            comprobante === 'boleta'
                              ? 'border-emerald-600 bg-white text-emerald-700 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600'
                          }`}
                        >
                          Boleta
                        </button>
                        <button
                          type="button"
                          onClick={() => setComprobante('factura')}
                          className={`p-1.5 rounded-lg border text-center font-medium transition-all ${
                            comprobante === 'factura'
                              ? 'border-emerald-600 bg-white text-emerald-700 shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600'
                          }`}
                        >
                          Factura
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmacionPago(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 underline"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={handleProcesarPagoYLiberar}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmar Pago (S/ {pedido.total.toFixed(2)}) y Desocupar Mesa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmacionPago(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Procesar Pago de Cuenta →
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleOcupar} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Cliente / Comensal principal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mario Vargas"
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    DNI del Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="8 dígitos"
                    value={nuevoDni}
                    onChange={(e) => setNuevoDni(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Cantidad de comensales *
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Máx: {mesa.capacidad}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={comensales}
                    onChange={(e) => setComensales(Number(e.target.value))}
                    className={`w-full px-3.5 py-2 border rounded-xl text-sm outline-none ${
                      superaAforo
                        ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                </div>
              </div>

              {superaAforo && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium animate-in fade-in">
                  <WarningCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    La cantidad ingresada ({comensales} comensales) supera la capacidad máxima de la Mesa {mesa.numero} ({mesa.capacidad} personas).
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mozo asignado a la mesa
                </label>
                <select
                  value={mozo}
                  onChange={(e) => setMozo(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="Roberto Sánchez">Roberto Sánchez</option>
                  <option value="Patricia Vega">Patricia Vega</option>
                  <option value="Javier Morales">Javier Morales</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={superaAforo}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                >
                  Registrar Cliente y Ocupar Mesa {mesa.numero}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
