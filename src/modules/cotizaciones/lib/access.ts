export type Rol = 'ADMIN' | 'INVITADO'

export const ROL_ADMIN: Rol = 'ADMIN'

export function puedeVerCotizaciones(rol: Rol | null | undefined): boolean {
  return rol === ROL_ADMIN
}
