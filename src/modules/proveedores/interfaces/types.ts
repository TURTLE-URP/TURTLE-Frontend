export type CondicionProveedor =
  | 'Habido'
  | 'No habido'
  | 'No hallado'
  | 'En proceso de verificación'

export interface Contacto {
  nombre: string
  telefono: string
  email: string
}

export interface Proveedor {
  id: string
  nombreComercial: string
  ruc: string
  razonSocial: string
  contactos: Contacto[]
  direccion: string
  fechaRegistro: string
  condicion: CondicionProveedor
}

export type ProveedorInput = Pick<
  Proveedor,
  'nombreComercial' | 'ruc' | 'razonSocial' | 'contactos' | 'direccion'
>

export interface DatosFiscales {
  razonSocial: string
  nombreComercial: string
  direccion: string
}

export interface FiltrosProveedores {
  texto: string
  pagina: number
  tamano: number
}

export interface ListadoProveedores {
  items: Proveedor[]
  pagina: number
  tamano: number
  total: number
  totalPaginas: number
}