export interface AlmacenArea {
  id: string
  codigo: string
  nombre: string
  tipo: 'Refrigerado' | 'Congelado' | 'Temperatura Ambiente' | 'Suministros' | 'Insumos'
  ubicacion: string
  responsable: string
  capacidadMaxKg: number
  requiereTemperatura: boolean
  temperaturaObjetivo?: number
  totalInsumos: number
  descripcion: string
  estado: 'Activo' | 'Inactivo' | 'ACTIVO' | 'INACTIVO'
  insumos?: unknown[]
  insumosContenidos?: unknown[]
}

export interface FormErrors {
  nombre?: string
  ubicacion?: string
  responsable?: string
  capacidadMaxKg?: string
  temperaturaObjetivo?: string
}
