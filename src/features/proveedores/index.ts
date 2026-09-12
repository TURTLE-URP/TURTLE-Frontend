// Barril público de la feature Gestionar Proveedores.
export * from './data/proveedores-repository'
export type {
  DatosFiscales,
  EstadoProveedor,
  FiltrosProveedores,
  ListadoProveedores,
  Proveedor,
  ProveedorInput,
} from './data/types'
export {
  useActualizarProveedor,
  useCambiarEstado,
  useCrearProveedor,
  useDatosFiscales,
  useDebouncedValue,
  useExisteRuc,
  useProveedoresList,
} from './data/proveedores-query'
export { getMockSesion, type Sesion } from './data/mock-session'
export { puedeGestionarProveedores, ROL_ADMIN, type Rol } from './logic/access'
export {
  anteriorPagina,
  crearFiltros,
  paginasVisibles,
  siguientePagina,
  TAMANO_PAGINA,
} from './logic/filters'
export { etiquetaEstado, formatearFecha } from './logic/format'
export {
  esEmailValido,
  esRucValido,
  esTelefonoValido,
  validarProveedor,
  type CampoProveedor,
  type ErroresProveedor,
} from './logic/validation'
export { ProveedoresPage } from './pages/proveedores-page'
export { ProveedorFormDialog } from './components/proveedor-form-dialog'