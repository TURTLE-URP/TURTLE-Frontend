import { useState } from 'react';
import { type Mesa, MOCK_MESAS } from './types';

export function GestionMesas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [motivoBaja, setMotivoBaja] = useState('');

  const abrirModalBaja = (mesa: Mesa) => {
    // Según el requerimiento, si el pedido está abierto (mesa ocupada), se bloquea la acción[cite: 5].
    if (mesa.ocupada === 'Ocupada') {
      alert('No se puede dar de baja una mesa con un pedido abierto.');
      return;
    }
    setMesaSeleccionada(mesa);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setMesaSeleccionada(null);
    setMotivoBaja('');
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mesas</h1>
          <p className="text-slate-500 text-sm">Administración de registros</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium shadow-sm">
          + Nueva mesa
        </button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">12</h2>
          <p className="text-slate-500 text-sm">Activas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">7 / 5</h2>
          <p className="text-slate-500 text-sm">Piso 1 / Piso 2</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">2</h2>
          <p className="text-slate-500 text-sm">Inactivas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Buscar</label>
          <input type="text" placeholder="M-07 / 7..." className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div className="w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Piso</label>
          <select aria-label="Filtrar por piso" className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
            <option>Todos</option>
            <option>Piso 1</option>
            <option>Piso 2</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Registro</label>
          <select aria-label="Filtrar por registro" className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
            <option>Activas</option>
            <option>Inactivas</option>
          </select>
        </div>
        <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
              <th className="p-3 font-medium">Codigo</th>
              <th className="p-3 font-medium">Nro</th>
              <th className="p-3 font-medium">Piso</th>
              <th className="p-3 font-medium">Cap</th>
              <th className="p-3 font-medium">Ocupada</th>
              <th className="p-3 font-medium">Updated</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {MOCK_MESAS.map((mesa) => (
              <tr key={mesa.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{mesa.codigo}</td>
                <td className="p-3">{mesa.nro}</td>
                <td className="p-3">{mesa.piso}</td>
                <td className="p-3">{mesa.capacidad}</td>
                <td className={`p-3 font-medium ${mesa.ocupada === 'Libre' ? 'text-green-600' : mesa.ocupada === 'Ocupada' ? 'text-orange-500' : 'text-slate-400'}`}>
                  {mesa.ocupada}
                </td>
                <td className="p-3 text-slate-500">{mesa.updated}</td>
                <td className="p-3">{mesa.estado}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors">Ver</button>
                  <button className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors">Edit</button>
                  {mesa.estado === 'Activa' ? (
                    <button 
                      onClick={() => abrirModalBaja(mesa)}
                      className={`px-3 py-1 border rounded transition-colors ${mesa.ocupada === 'Ocupada' ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'}`}
                    >
                      Baja
                    </button>
                  ) : (
                    <button className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors">Alta</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
        <span>Nota: columna Ocupada es solo lectura (viene de Mesa.ocupado). Baja = soft delete.</span>
        <span>Mostrando 1-4 de 14 &lt; 1 / 2 &gt;</span>
      </div>

      {/* Modal de Baja Lógica */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border-t-4 border-rose-500">
            <h3 className="text-xl font-bold text-rose-600 mb-4">Desactivar (baja lógica)</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Motivo *</label>
              <input 
                type="text" 
                placeholder="Ej: silla rota..." 
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Guarda deleted_at + deleted_by. Con Pedido abierto el botón se bloquea.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={cerrarModal}
                className="px-4 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-900 transition-colors"
              >
                Confirmar baja
              </button>
              <button 
                onClick={cerrarModal}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}