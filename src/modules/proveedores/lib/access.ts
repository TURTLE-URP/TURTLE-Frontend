export type Rol = 'ADMIN' | 'INVITADO'

export const ROL_ADMIN: Rol = 'ADMIN'

export function puedeGestionarProveedores(rol: Rol | null | undefined): boolean {
  return rol === ROL_ADMIN
}