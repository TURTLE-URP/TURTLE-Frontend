export type EstadoProveedor = 'Activo' | 'Inactivo'

export interface Proveedor {
  id: string
  nombreComercial: string
  ruc: string
  razonSocial: string
  contactoNombre: string
  contactoTelefono: string
  contactoEmail: string
  direccion: string
  ciudad: string
  fechaRegistro: string
  estado: EstadoProveedor
}

export type ProveedorInput = Pick<
  Proveedor,
  | 'nombreComercial'
  | 'ruc'
  | 'razonSocial'
  | 'contactoNombre'
  | 'contactoTelefono'
  | 'contactoEmail'
  | 'direccion'
  | 'ciudad'
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