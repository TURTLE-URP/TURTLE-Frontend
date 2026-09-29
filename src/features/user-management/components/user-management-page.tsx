import { useState } from 'react';
import { Plus, MagnifyingGlass, Funnel, Check, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useUsuarios } from '../logic/hooks';
import { UsuarioKpiCards } from './usuario-kpi-cards';
import { UsuarioTable } from './usuario-table';
import { UsuarioInviteModal } from './usuario-invite-modal';
import { UsuarioEditModal } from './usuario-edit-modal';

import type { ManagedUser } from '../logic/types';

export function UserManagementPage() {
  const {
    loading,
    error,
    visibleUsers,
    usuariosPaginados,
    selected,
    filtros,
    setFiltros,
    kpis,
    notice,
    setNotice,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    elementosPorPagina,
    toggleSelection,
    toggleAll,
    toggleStatus,
    invitarUsuario,
    eliminarUsuario,
    actualizarUsuario,
    archivarSeleccionados,
  } = useUsuarios();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<ManagedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUserToEdit(user);
    setIsEditModalOpen(true);
  };

const handleSaveEdit = async (data: any) => {
    if (!selectedUserToEdit) return;
    await actualizarUsuario(selectedUserToEdit.id, data);
    setIsEditModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen flex-1 space-y-6 bg-[#f4f7f9] text-[#1e293b] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end w-full">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0088cc]">
            Administración
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1e293b]">Usuarios</h1>
          <p className="mt-1 text-xs text-[#64748b]">
            Gestiona los accesos y permisos del personal del restaurante.
          </p>
        </div>
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="h-9 rounded-md bg-[#0088cc] px-4 text-xs font-medium text-white hover:bg-[#0077b6] transition-colors"
        >
          <Plus weight="bold" /> Invitar trabajador
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="w-full">
        <UsuarioKpiCards kpis={kpis} />
      </div>

      {/* Sección principal (Buscador + Filtro + Tabla) */}
      <section className="w-full border border-[#e2e8f0] bg-white shadow-xs rounded-lg overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[#e2e8f0] p-4 sm:flex-row sm:items-center sm:justify-between bg-[#f8fafc]">
          <div>
            <h2 className="text-xs font-semibold text-[#1e293b] uppercase tracking-wider">
              Todos los usuarios
            </h2>
            <p className="mt-0.5 text-xs text-[#64748b]">{visibleUsers.length} resultados</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Buscador */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-2.5 text-[#94a3b8]" size={15} />
              <input
                value={filtros.busqueda}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))
                }
                placeholder="Buscar usuario..."
                className="h-8 w-full rounded-md border border-[#cbd5e1] bg-white pl-9 pr-3 text-xs text-[#1e293b] outline-none focus:border-[#0088cc] sm:w-64"
              />
            </div>

            {/* Filtro por estado */}
            <div className="relative">
              <Funnel className="pointer-events-none absolute left-3 top-2.5 text-[#94a3b8]" size={14} />
              <select
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    estado: e.target.value as any,
                  }))
                }
                className="h-8 w-full appearance-none rounded-md border border-[#cbd5e1] bg-white pl-9 pr-8 text-xs text-[#64748b] outline-none focus:border-[#0088cc] sm:w-40"
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Acciones masivas */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between bg-[#e0f2fe] border-b border-[#bae6fd] px-4 py-2 text-xs text-[#0369a1]">
            <span>{selected.length} seleccionados</span>
            <button onClick={archivarSeleccionados} className="font-semibold hover:underline">
              Archivar selección
            </button>
          </div>
        )}

        {/* Estado de Carga / Error / Tabla */}
        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748b]">Cargando trabajadores...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-[#b91c1c]">{error}</div>
        ) : (
          <UsuarioTable
            usuarios={usuariosPaginados}
            totalVisibles={visibleUsers.length}
            selected={selected}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
            onToggleStatus={toggleStatus}
            onEditUser={handleEditUser}
            onDeleteUser={eliminarUsuario}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            elementosPorPagina={elementosPorPagina}
            setPaginaActual={setPaginaActual}
          />
        )}
      </section>

      {/* Notificación Toast */}
      {notice && (
        <button
          onClick={() => setNotice('')}
          className="fixed bottom-6 right-6 flex items-center gap-3 rounded-md bg-[#0088cc] px-4 py-3 text-xs text-white shadow-lg z-50 hover:bg-[#0077b6] transition-colors"
        >
          <Check size={16} weight="bold" /> {notice}
          <X size={15} />
        </button>
      )}

      {/* Modal Invitar */}
      <UsuarioInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={async (data) => {
          await invitarUsuario(data);
          setIsInviteOpen(false);
        }}
      />

      {/* Modal Editar */}
      <UsuarioEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEdit}
        initialData={{
          name: selectedUserToEdit?.name.split(' ')[0] || '',
          lastName: selectedUserToEdit?.name.split(' ').slice(1).join(' ') || '',
        }}
      />
    </div>
  );
}