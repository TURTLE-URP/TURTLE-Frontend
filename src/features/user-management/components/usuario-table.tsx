import { CaretLeft, CaretRight, CheckCircle, XCircle, PencilSimple, Trash } from '@phosphor-icons/react';
import type { ManagedUser, UserStatus } from '../logic/types';

const statusStyles: Record<UserStatus, string> = {
  Activo: 'bg-[#e2f5ee] text-[#19755e]',
  Pendiente: 'bg-[#fff0d9] text-[#9c681e]',
  Suspendido: 'bg-[#fbe5e7] text-[#aa4b5c]',
};

interface Props {
  usuarios: ManagedUser[];
  totalVisibles: number;
  selected: number[];
  onToggleSelection: (id: number) => void;
  onToggleAll: () => void;
  onToggleStatus: (id: number) => void;
  onEditUser: (user: ManagedUser) => void;
  onDeleteUser: (id: number) => void;
  paginaActual: number;
  totalPaginas: number;
  elementosPorPagina: number;
  setPaginaActual: React.Dispatch<React.SetStateAction<number>>;
}

export function UsuarioTable({
  usuarios,
  totalVisibles,
  selected,
  onToggleSelection,
  onToggleAll,
  onToggleStatus,
  onEditUser,
  onDeleteUser,
  paginaActual,
  totalPaginas,
  elementosPorPagina,
  setPaginaActual,
}: Props) {
  return (
    <div className="border border-[#e1e8e3] bg-white shadow-xs rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-[#fbfcfb] text-[10px] uppercase tracking-[0.12em] text-[#91a19b] border-b border-[#e8eeea]">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={totalVisibles > 0 && selected.length === totalVisibles}
                  onChange={onToggleAll}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="px-3 py-3 font-semibold">Usuario</th>
              <th className="px-3 py-3 font-semibold">Rol</th>
              <th className="px-3 py-3 font-semibold">Estado</th>
              <th className="px-3 py-3 font-semibold">Último acceso</th>
              <th className="w-28 px-3 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf1ee]">
            {usuarios.map((user) => {
              const isActivo = user.status === 'Activo';

              return (
                <tr key={user.id} className="group hover:bg-[#fcfdfc]">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => onToggleSelection(user.id)}
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 place-items-center rounded-full text-xs font-semibold ${user.color}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-medium text-[#2c4740]">{user.name}</p>
                        <p className="mt-0.5 text-xs text-[#91a19b]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-xs text-[#62746d] capitalize">{user.role}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-xs text-[#81918b]">{user.lastAccess}</td>
                  
                  {/* Botones de acción directa */}
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Editar */}
                      <button
                        onClick={() => onEditUser(user)}
                        title="Editar usuario"
                        className="grid size-8 place-items-center rounded-md text-[#62746d] hover:bg-[#edf6f1] hover:text-[#286c5c] transition-colors"
                      >
                        <PencilSimple size={18} />
                      </button>

                      {/* Activar / Desactivar */}
                      {isActivo ? (
                        <button
                          onClick={() => onToggleStatus(user.id)}
                          title="Desactivar usuario"
                          className="grid size-8 place-items-center rounded-md text-[#aa4b5c] hover:bg-[#fbe5e7] transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus(user.id)}
                          title="Activar usuario"
                          className="grid size-8 place-items-center rounded-md text-[#19755e] hover:bg-[#e2f5ee] transition-colors"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {/* Eliminar */}
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        title="Eliminar usuario"
                        className="grid size-8 place-items-center rounded-md text-[#aa4b5c] hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-[#71827b]">
            No encontramos usuarios con esos criterios.
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between border-t border-[#e8eeea] px-4 py-3 text-xs text-[#91a19b]">
        <span>
          Mostrando {usuarios.length === 0 ? 0 : (paginaActual - 1) * elementosPorPagina + 1} a{' '}
          {Math.min(paginaActual * elementosPorPagina, totalVisibles)} de {totalVisibles}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="p-1 border border-[#e1e8e3] rounded disabled:opacity-50"
          >
            <CaretLeft size={14} />
          </button>
          <span className="font-semibold text-[#286c5c]">
            {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="p-1 border border-[#e1e8e3] rounded disabled:opacity-50"
          >
            <CaretRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}