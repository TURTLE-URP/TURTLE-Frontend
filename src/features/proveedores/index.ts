// Barril público de la feature Gestionar Proveedores.
export * from './data/proveedores-repository'
export type {
  CondicionProveedor,
  Contacto,
  DatosFiscales,
  FiltrosProveedores,
  ListadoProveedores,
  Proveedor,
  ProveedorInput,
} from './data/types'
export {
  useActualizarProveedor,
  useCrearProveedor,
  useDatosFiscales,
  useDebouncedValue,
  useEliminarProveedor,
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
export { etiquetaCondicion, formatearFecha } from './logic/format'
export {
  esEmailValido,
  esRucValido,
  esTelefonoValido,
  validarProveedor,
  type ErroresProveedor,
} from './logic/validation'
export { ProveedoresPage } from './pages/proveedores-page'
export { ProveedorFormDialog } from './components/proveedor-form-dialog'
export { ProveedorConfirmDialog } from './components/proveedor-confirm-dialog'