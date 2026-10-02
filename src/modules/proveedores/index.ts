// Barril público de la feature Gestionar Proveedores.
export * from './services/proveedores-repository'
export type {
  CondicionProveedor,
  Contacto,
  DatosFiscales,
  FiltrosProveedores,
  ListadoProveedores,
  Proveedor,
  ProveedorInput,
} from './interfaces/types'
export {
  useActualizarProveedor,
  useCrearProveedor,
  useDatosFiscales,
  useDebouncedValue,
  useEliminarProveedor,
  useExisteRuc,
  useProveedoresList,
} from './services/proveedores-query'
export { getMockSesion, type Sesion } from './lib/mock-session'
export { puedeGestionarProveedores, ROL_ADMIN, type Rol } from './lib/access'
export {
  anteriorPagina,
  crearFiltros,
  paginasVisibles,
  siguientePagina,
  TAMANO_PAGINA,
} from './lib/filters'
export { etiquetaCondicion, formatearFecha } from './lib/format'
export {
  esEmailValido,
  esRucValido,
  esTelefonoValido,
  validarProveedor,
  type ErroresProveedor,
} from './schemas/validation.schema'
export { ProveedoresPage } from './pages/proveedores-page'
export { ProveedorFormDialog } from './components/proveedor-form-dialog'
export { ProveedorConfirmDialog } from './components/proveedor-confirm-dialog'