export type UserStatus = 'Activo' | 'Pendiente' | 'Suspendido';
export type UserRole = 
  | 'Anfitrion'
  | 'Mozo'
  | 'Cocinero'
  | 'Asistente_de_Cocina'
  | 'Almacenero'
  | 'Jefe'
  | 'Administrador';

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
  initials: string;
  color: string;
}

export interface UserFilters {
  busqueda: string;
  estado: 'Todos' | UserStatus;
}