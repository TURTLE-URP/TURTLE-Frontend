import { ROL_ADMIN, type Rol } from '../logic/access'

export interface Sesion {
  rol: Rol
}

export function getMockSesion(): Sesion {
  return { rol: ROL_ADMIN }
}