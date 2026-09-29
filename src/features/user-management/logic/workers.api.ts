import { useAuthStore } from '@/stores/auth-store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function getHeaders() {
  // La sesión vive en el store de Zustand (useAuthStore), no en localStorage:
  // nada en la app escribe el token ahí, así que localStorage.getItem('token')
  // siempre devolvía null.
  const token = useAuthStore.getState().session?.token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ASANCIÓN: Asegúrate de tener "export const WorkersApi"
export const WorkersApi = {
  async findAll(params?: { page?: number; limit?: number; search?: string; estado?: string }) {
    const cleanParams: Record<string, string> = {};

    if (params?.search) cleanParams.search = params.search;
    // El backend (FindWorkersQueryDto) no tiene un campo "estado": filtra por
    // `activo: boolean`. Traducimos aquí para que el filtro sí funcione en
    // el servidor (antes se mandaba "estado" y el backend simplemente lo ignoraba).
    if (params?.estado === 'Activo') cleanParams.activo = 'true';
    if (params?.estado === 'Suspendido') cleanParams.activo = 'false';
    // Límite generoso por defecto: la tabla sigue paginando en el cliente,
    // así que traemos todo de una vez en vez de quedarnos solo con los
    // primeros 10 (default del backend) y perder trabajadores silenciosamente.
    cleanParams.page = String(params?.page ?? 1);
    cleanParams.limit = String(params?.limit ?? 100);

    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `${API_URL}/workers?${query}` : `${API_URL}/workers`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Error al obtener la lista de trabajadores');
    return res.json();
  },

  async findOne(id: number) {
    const res = await fetch(`${API_URL}/workers/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener el trabajador');
    return res.json();
  },

  async create(dto: any) {
    const res = await fetch(`${API_URL}/workers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear trabajador');
    }
    return res.json();
  },

  async updateActivo(id: number, activo: boolean) {
    const res = await fetch(`${API_URL}/workers/${id}/activo`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ activo }),
    });
    if (!res.ok) throw new Error('Error al cambiar estado del trabajador');
    return res.json();
  },

  async update(id: number, dto: any) {
    const res = await fetch(`${API_URL}/workers/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al actualizar datos del trabajador');
    return res.json();
  },

  async remove(id: number) {
    const res = await fetch(`${API_URL}/workers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al eliminar trabajador');
    return res.json();
  },
};