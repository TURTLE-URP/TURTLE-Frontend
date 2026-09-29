import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ManagedUser, UserFilters } from './types';
import type { UserInviteFormValues } from './schema';
import { WorkersApi } from './workers.api';
import { useAuthStore } from '@/stores/auth-store';

export function useUsuarios() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<number[]>([]);
  const [filtros, setFiltros] = useState<UserFilters>({
    busqueda: '',
    estado: 'Todos',
  });
  const [notice, setNotice] = useState<string>('');

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Transformar respuesta del Backend (WorkerResponseEntity) al ManagedUser del Frontend.
  // El backend devuelve { id, email, trabajador: { nombre, apellido, rol, activo } },
  // no los campos planos que se leían antes (worker.nombre, worker.correo, etc.
  // nunca existieron en la respuesta real — siempre caían al fallback "Sin Nombre").
  const mapWorkerToManagedUser = useCallback((worker: any): ManagedUser => {
    const trabajador = worker.trabajador ?? worker;
    const fullName = `${trabajador.nombre || ''} ${trabajador.apellido || ''}`.trim() || 'Sin Nombre';
    const email = worker.email || worker.correo || '';
    const isActivo = trabajador.activo ?? (worker.status === 'Activo');

    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'US';

    return {
      id: worker.id,
      name: fullName,
      email: email,
      role: trabajador.rol || trabajador.role || 'Trabajador',
      status: isActivo ? 'Activo' : 'Suspendido',
      lastAccess: worker.updatedAt ? new Date(worker.updatedAt).toLocaleDateString() : 'No disponible',
      initials: initials,
      color: isActivo ? 'bg-[#e0f2fe] text-[#0284c7]' : 'bg-[#f1f5f9] text-[#64748b]',
    };
  }, []);

  // Cargar lista de trabajadores desde el backend
  const fetchUsuarios = useCallback(async () => {
    
    if (!useAuthStore.getState().session?.token) {
      // Sin sesión no tiene sentido llamar al backend: evita el 401 en
      // consola que salía en cada mount mientras el usuario ni siquiera
      // había iniciado sesión todavía.
      setUsers([]);
      setError('Inicia sesión para ver el listado de trabajadores.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await WorkersApi.findAll({
        search: filtros.busqueda,
        estado: filtros.estado !== 'Todos' ? filtros.estado : undefined,
      });

      // Si la API devuelve un array directo o un objeto paginado { data: [...], total: ... }
      const items = Array.isArray(data) ? data : (data.data || data.items || []);
      const mapped = items.map(mapWorkerToManagedUser);
      setUsers(mapped);
    } catch (err: any) {
      console.error('Error al cargar trabajadores:', err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [filtros.busqueda, filtros.estado, mapWorkerToManagedUser]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Filtrado local
  const visibleUsers = useMemo(() => {
    const query = filtros.busqueda.toLowerCase().trim();
    return users.filter((user) => {
      const matchesQuery =
        !query || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query);
      const matchesStatus = filtros.estado === 'Todos' || user.status === filtros.estado;
      return matchesQuery && matchesStatus;
    });
  }, [filtros, users]);

  // Paginados
  const usuariosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    return visibleUsers.slice(inicio, inicio + elementosPorPagina);
  }, [visibleUsers, paginaActual]);

  const totalPaginas = Math.ceil(visibleUsers.length / elementosPorPagina) || 1;

  // KPIs
  const kpis = useMemo(() => ({
    total: users.length,
    activos: users.filter((u) => u.status === 'Activo').length,
    pendientes: users.filter((u) => u.status === 'Pendiente').length,
  }), [users]);

  // Acciones
  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.length === visibleUsers.length ? [] : visibleUsers.map((u) => u.id)
    );
  };

  // Cambiar estado activo/inactivo mediante API NestJS
  const toggleStatus = async (id: number) => {
    const currentUser = users.find((u) => u.id === id);
    if (!currentUser) return;

    const newActivoState = currentUser.status !== 'Activo';

    try {
      await WorkersApi.updateActivo(id, newActivoState);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: newActivoState ? 'Activo' : 'Suspendido' }
            : u
        )
      );
      setNotice('Estado del usuario actualizado correctamente');
    } catch (err: any) {
      console.error(err);
      setNotice('Error al actualizar estado en el servidor');
    }
  };

  // Crear o Invitar trabajador mediante API NestJS
  const invitarUsuario = async (data: UserInviteFormValues) => {
    try {
      // CreateWorkerDto real: { name, lastName, email, role } — antes se
      // mandaba { nombre, apellido, correo, rol } y el backend no reconocía
      // ninguno de esos campos (400 Bad Request).
      const dto = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      };

      await WorkersApi.create(dto);
      setNotice('Trabajador registrado exitosamente');
      await fetchUsuarios(); // Recargar datos del backend
    } catch (err: any) {
      console.error(err);
      setNotice(err.message || 'Error al invitar trabajador');
    }
  };

  // Baja lógica de un trabajador
  const eliminarUsuario = async (id: number) => {
    try {
      await WorkersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setNotice('Usuario eliminado correctamente');
    } catch (err: any) {
      console.error(err);
      setNotice('Error al eliminar usuario');
    }
  };

  // Actualizar datos de un trabajador (Edición)
  const actualizarUsuario = async (id: number, data: { name: string; lastName: string; role?: string }) => {
    try {
      // UpdateWorkerDto real solo acepta name/lastName — no tiene "rol"
      // editable por este endpoint (por diseño del backend).
      const dto = {
        name: data.name,
        lastName: data.lastName,
      };
      await WorkersApi.update(id, dto);
      setNotice('Usuario actualizado correctamente');
      await fetchUsuarios();
    } catch (err: any) {
      console.error(err);
      setNotice('Error al actualizar datos del usuario');
    }
  };

  const archivarSeleccionados = async () => {
    try {
      await Promise.all(selected.map((id) => WorkersApi.remove(id)));
      setUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
      setSelected([]);
      setNotice('Usuarios archivados correctamente');
    } catch (err: any) {
      console.error(err);
      setNotice('Error al archivar usuarios seleccionados');
    }
  };

  return {
    users,
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
    refetch: fetchUsuarios,
  };
}