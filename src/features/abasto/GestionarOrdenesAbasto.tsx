import { useState, useMemo } from 'react';
import { MOCK_ORDENES_ABASTO, type OrdenAbasto, type EstadoOrden } from './types';

export function GestionarOrdenesAbasto() {
  const [ordenes] = useState<OrdenAbasto[]>(MOCK_ORDENES_ABASTO);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  
  // Controles de navegación / paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((orden) => {
      const matchTexto = 
        orden.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        orden.proveedor.toLowerCase().includes(filtroTexto.toLowerCase());
      
      const matchEstado = filtroEstado === 'TODOS' || orden.estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [ordenes, filtroTexto, filtroEstado]);

  const totalPaginas = Math.ceil(ordenesFiltradas.length / elementosPorPagina) || 1;
  const ordenesPaginadas = ordenesFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const getBadgeStyle = (estado: EstadoOrden) => {
    switch (estado) {
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Aprobada': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En Tránsito': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Recibida': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelada': return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Órdenes de Abasto</h1>
          <p className="text-sm text-slate-500">Lista y controles de navegación de órdenes a proveedores.</p>
        </div>
        <button
          onClick={() => alert('Mockup: Abrir formulario de nueva orden')}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Nueva Orden
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por código o proveedor..."
            value={filtroTexto}
            onChange={(e) => {
              setFiltroTexto(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            aria-label="Filtrar por estado"
            title="Filtrar por estado"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="En Tránsito">En Tránsito</option>
            <option value="Recibida">Recibida</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-700">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Proveedor</th>
                <th className="px-6 py-3">F. Emisión</th>
                <th className="px-6 py-3">F. Esperada</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ordenesPaginadas.length > 0 ? (
                ordenesPaginadas.map((orden) => (
                  <tr key={orden.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{orden.codigo}</td>
                    <td className="px-6 py-4">{orden.proveedor}</td>
                    <td className="px-6 py-4">{orden.fechaEmision}</td>
                    <td className="px-6 py-4">{orden.fechaEsperada}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">S/. {orden.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(orden.estado)}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert(`Mockup: Ver detalle de ${orden.codigo}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de Navegación / Paginación */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-500">
            Página <span className="font-medium text-slate-800">{paginaActual}</span> de{' '}
            <span className="font-medium text-slate-800">{totalPaginas}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700"
            >
              Anterior
            </button>
            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}