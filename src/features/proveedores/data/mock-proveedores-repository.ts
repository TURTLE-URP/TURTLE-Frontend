import type { DatosFiscales, EstadoProveedor, FiltrosProveedores, ListadoProveedores, Proveedor, ProveedorInput } from './types'
import type { ProveedoresRepository } from './proveedores-repository'
import { ProveedorNoEncontradoError, ProveedoresError, RucDuplicadoError } from './proveedores-repository'

function clonar<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const RUC_PATTERN = /^\d{11}$/

const SEED: Proveedor[] = [
  { id: 'p01', nombreComercial: 'Agro Andina', ruc: '20123456789', razonSocial: 'Agro Andina S.A.C.', contactoNombre: 'María López', contactoTelefono: '+51 1 555 0101', contactoEmail: 'maria@agroandina.pe', direccion: 'Av. Industrial 120', ciudad: 'Arequipa', fechaRegistro: '2026-01-15T10:00:00Z', estado: 'Activo' },
  { id: 'p02', nombreComercial: 'Textiles Lima', ruc: '20500112233', razonSocial: 'Textiles Lima S.A.C.', contactoNombre: 'Carlos Díaz', contactoTelefono: '+51 1 555 0102', contactoEmail: 'carlos@textileslima.pe', direccion: 'Jr. Unión 45', ciudad: 'Lima', fechaRegistro: '2026-02-03T09:30:00Z', estado: 'Activo' },
  { id: 'p03', nombreComercial: 'Frutas del Valle', ruc: '20602223344', razonSocial: 'Frutas del Valle E.I.R.L.', contactoNombre: 'Ana Torres', contactoTelefono: '+51 44 555 0103', contactoEmail: 'ana@frutasvalle.pe', direccion: 'Panamericana Km 10', ciudad: 'Trujillo', fechaRegistro: '2026-02-18T14:00:00Z', estado: 'Inactivo' },
  { id: 'p04', nombreComercial: 'Importadora Sur', ruc: '20403334455', razonSocial: 'Importadora Sur S.A.C.', contactoNombre: 'Luis Rojas', contactoTelefono: '+51 84 555 0104', contactoEmail: 'luis@importadorasur.pe', direccion: 'Av. Los Incas 300', ciudad: 'Cusco', fechaRegistro: '2026-03-02T11:15:00Z', estado: 'Activo' },
  { id: 'p05', nombreComercial: 'Tecnología Perú', ruc: '20504445566', razonSocial: 'Tecnología Perú S.A.', contactoNombre: 'Rosa Huamán', contactoTelefono: '+51 1 555 0105', contactoEmail: 'rosa@tecnologiaperu.pe', direccion: 'Calle Los Pinos 88', ciudad: 'Lima', fechaRegistro: '2026-03-11T08:45:00Z', estado: 'Activo' },
  { id: 'p06', nombreComercial: 'Comercial Norte', ruc: '20605556677', razonSocial: 'Comercial Norte S.A.C.', contactoNombre: 'José Flores', contactoTelefono: '+51 74 555 0106', contactoEmail: 'jose@comercialnorte.pe', direccion: 'Av. Balta 210', ciudad: 'Chiclayo', fechaRegistro: '2026-03-20T16:20:00Z', estado: 'Inactivo' },
  { id: 'p07', nombreComercial: 'Distribuidora Pacífico', ruc: '20506667788', razonSocial: 'Distribuidora Pacífico S.A.C.', contactoNombre: 'Elena Castillo', contactoTelefono: '+51 1 555 0107', contactoEmail: 'elena@pacifico.pe', direccion: 'Muelle Norte, MZ B', ciudad: 'Callao', fechaRegistro: '2026-04-01T10:00:00Z', estado: 'Activo' },
  { id: 'p08', nombreComercial: 'Minería Andahuaylas', ruc: '20407778899', razonSocial: 'Minería Andahuaylas S.A.C.', contactoNombre: 'Pedro Quispe', contactoTelefono: '+51 83 555 0108', contactoEmail: 'pedro@mineriaand.pe', direccion: 'Carretera Abancay Km 5', ciudad: 'Andahuaylas', fechaRegistro: '2026-04-06T09:10:00Z', estado: 'Activo' },
  { id: 'p09', nombreComercial: 'Bodega San Juan', ruc: '20508889900', razonSocial: 'Bodega San Juan E.I.R.L.', contactoNombre: 'Juana Paredes', contactoTelefono: '+51 52 555 0109', contactoEmail: 'juana@bodegasanjuan.pe', direccion: 'Pasaje Los Olivos 4', ciudad: 'Tacna', fechaRegistro: '2026-04-14T13:40:00Z', estado: 'Activo' },
  { id: 'p10', nombreComercial: 'Farmacia Central', ruc: '20509990011', razonSocial: 'Farmacia Central S.A.C.', contactoNombre: 'Miguel Salas', contactoTelefono: '+51 73 555 0110', contactoEmail: 'miguel@farmaciacentral.pe', direccion: 'Av. Grau 500', ciudad: 'Piura', fechaRegistro: '2026-04-22T15:55:00Z', estado: 'Inactivo' },
  { id: 'p11', nombreComercial: 'Alimentos Pura Vida', ruc: '20410001122', razonSocial: 'Alimentos Pura Vida S.A.C.', contactoNombre: 'Nadia Cárdenas', contactoTelefono: '+51 64 555 0111', contactoEmail: 'nadia@puravida.pe', direccion: 'Jr. Amazonas 77', ciudad: 'Huancayo', fechaRegistro: '2026-05-01T11:00:00Z', estado: 'Activo' },
  { id: 'p12', nombreComercial: 'Transportes El Sol', ruc: '20511112233', razonSocial: 'Transportes El Sol S.A.C.', contactoNombre: 'Óscar Ríos', contactoTelefono: '+51 65 555 0112', contactoEmail: 'oscar@transportessol.pe', direccion: 'Carretera a Punchana Km 2', ciudad: 'Iquitos', fechaRegistro: '2026-05-06T08:00:00Z', estado: 'Activo' },
  { id: 'p13', nombreComercial: 'Papelería Ideal', ruc: '20512223344', razonSocial: 'Papelería Ideal S.A.C.', contactoNombre: 'Sofía Vega', contactoTelefono: '+51 84 555 0113', contactoEmail: 'sofia@papeleriaideal.pe', direccion: 'Av. Sol 160', ciudad: 'Cusco', fechaRegistro: '2026-05-12T10:30:00Z', estado: 'Inactivo' },
  { id: 'p14', nombreComercial: 'Construcción Andina', ruc: '20113334455', razonSocial: 'Construcción Andina S.A.C.', contactoNombre: 'Ricardo Gómez', contactoTelefono: '+51 54 555 0114', contactoEmail: 'ricardo@construccionandina.pe', direccion: 'Av. Ejercito 1200', ciudad: 'Arequipa', fechaRegistro: '2026-05-20T09:25:00Z', estado: 'Activo' },
  { id: 'p15', nombreComercial: 'Veterinaria Campo', ruc: '20514445566', razonSocial: 'Veterinaria Campo S.A.C.', contactoNombre: 'Beatriz Salazar', contactoTelefono: '+51 76 555 0115', contactoEmail: 'beatriz@vetcampo.pe', direccion: 'Jr. Cajamarca 19', ciudad: 'Cajamarca', fechaRegistro: '2026-05-27T12:10:00Z', estado: 'Activo' },
  { id: 'p16', nombreComercial: 'Ferretería El Martillo', ruc: '20515556677', razonSocial: 'Ferretería El Martillo E.I.R.L.', contactoNombre: 'Héctor Nina', contactoTelefono: '+51 51 555 0116', contactoEmail: 'hector@martillo.pe', direccion: 'Av. Los Incas 22', ciudad: 'Puno', fechaRegistro: '2026-06-02T10:05:00Z', estado: 'Activo' },
  { id: 'p17', nombreComercial: 'Servicios GPS Norte', ruc: '20516667788', razonSocial: 'Servicios GPS Norte S.A.C.', contactoNombre: 'Pamela Ríos', contactoTelefono: '+51 74 555 0117', contactoEmail: 'pamela@gpsnorte.pe', direccion: 'MZ C Lt 3 Urb. Santa', ciudad: 'Chiclayo', fechaRegistro: '2026-06-08T15:00:00Z', estado: 'Inactivo' },
  { id: 'p18', nombreComercial: 'Joyería del Centro', ruc: '20417778899', razonSocial: 'Joyería del Centro S.A.C.', contactoNombre: 'Marcos Aldana', contactoTelefono: '+51 1 555 0118', contactoEmail: 'marcos@joyeriacentro.pe', direccion: 'Jirón Camaná 110', ciudad: 'Lima', fechaRegistro: '2026-06-15T09:50:00Z', estado: 'Activo' },
  { id: 'p19', nombreComercial: 'Calzados Sur Andino', ruc: '20518889900', razonSocial: 'Calzados Sur Andino S.A.C.', contactoNombre: 'Fátima Callata', contactoTelefono: '+51 51 555 0119', contactoEmail: 'fatima@calzadossur.pe', direccion: 'Jr. Apurímac 340', ciudad: 'Juliaca', fechaRegistro: '2026-06-22T11:30:00Z', estado: 'Inactivo' },
  { id: 'p20', nombreComercial: 'Muebles El Roble', ruc: '20519990011', razonSocial: 'Muebles El Roble S.A.C.', contactoNombre: 'Saúl Mendoza', contactoTelefono: '+51 62 555 0120', contactoEmail: 'saul@mueblesroble.pe', direccion: 'Av. 28 de Julio 419', ciudad: 'Huánuco', fechaRegistro: '2026-07-01T10:20:00Z', estado: 'Activo' },
  { id: 'p21', nombreComercial: 'Imprenta Veloz', ruc: '20520001122', razonSocial: 'Imprenta Veloz S.A.C.', contactoNombre: 'Inés Prado', contactoTelefono: '+51 66 555 0121', contactoEmail: 'ines@imprentaveloz.pe', direccion: 'Jr. 2 de Mayo 88', ciudad: 'Ayacucho', fechaRegistro: '2026-07-10T14:45:00Z', estado: 'Activo' },
  { id: 'p22', nombreComercial: 'Logística Portuaria', ruc: '20521112233', razonSocial: 'Logística Portuaria S.A.C.', contactoNombre: 'Rafael Dávila', contactoTelefono: '+51 1 555 0122', contactoEmail: 'rafael@logportuaria.pe', direccion: 'Puerto del Callao MZ D', ciudad: 'Callao', fechaRegistro: '2026-07-18T08:35:00Z', estado: 'Inactivo' },
  { id: 'p23', nombreComercial: 'Granja El Porvenir', ruc: '20522223344', razonSocial: 'Granja El Porvenir E.I.R.L.', contactoNombre: 'Mercedes Ticona', contactoTelefono: '+51 54 555 0123', contactoEmail: 'mercedes@granjaporvenir.pe', direccion: 'Fundo La Estancia', ciudad: 'Arequipa', fechaRegistro: '2026-07-27T13:00:00Z', estado: 'Activo' },
  { id: 'p24', nombreComercial: 'Medicamentos Vita', ruc: '20523334455', razonSocial: 'Medicamentos Vita S.A.C.', contactoNombre: 'Gabriel Peña', contactoTelefono: '+51 1 555 0124', contactoEmail: 'gabriel@medvita.pe', direccion: 'Av. Aviación 2201', ciudad: 'Lima', fechaRegistro: '2026-08-04T10:15:00Z', estado: 'Activo' },
  { id: 'p25', nombreComercial: 'Restaurante La Casona', ruc: '20524445566', razonSocial: 'Restaurante La Casona S.A.C.', contactoNombre: 'Carmen Bustamante', contactoTelefono: '+51 84 555 0125', contactoEmail: 'carmen@lacasona.pe', direccion: 'Plaza de Armas 15', ciudad: 'Cusco', fechaRegistro: '2026-08-12T19:30:00Z', estado: 'Inactivo' },
]

export const PROVEEDORES_SEMILLA: Proveedor[] = SEED

const DATOS_FISCALES_POR_RUC: Record<string, DatosFiscales> = {
  '20123456789': { razonSocial: 'Agro Andina S.A.C.', nombreComercial: 'Agro Andina', direccion: 'Av. Industrial 120', ciudad: 'Arequipa' },
  '20500112233': { razonSocial: 'Textiles Lima S.A.C.', nombreComercial: 'Textiles Lima', direccion: 'Jr. Unión 45', ciudad: 'Lima' },
  '20602223344': { razonSocial: 'Frutas del Valle E.I.R.L.', nombreComercial: 'Frutas del Valle', direccion: 'Panamericana Km 10', ciudad: 'Trujillo' },
  '20504445566': { razonSocial: 'Tecnología Perú S.A.', nombreComercial: 'Tecnología Perú', direccion: 'Calle Los Pinos 88', ciudad: 'Lima' },
  '20605556677': { razonSocial: 'Comercial Norte S.A.C.', nombreComercial: 'Comercial Norte', direccion: 'Av. Balta 210', ciudad: 'Chiclayo' },
  '20407778899': { razonSocial: 'Minería Andahuaylas S.A.C.', nombreComercial: 'Minería Andahuaylas', direccion: 'Carretera Abancay Km 5', ciudad: 'Andahuaylas' },
  '20511112233': { razonSocial: 'Transportes El Sol S.A.C.', nombreComercial: 'Transportes El Sol', direccion: 'Carretera a Punchana Km 2', ciudad: 'Iquitos' },
  '20113334455': { razonSocial: 'Construcción Andina S.A.C.', nombreComercial: 'Construcción Andina', direccion: 'Av. Ejercito 1200', ciudad: 'Arequipa' },
  // RUCs conocidos por la fuente fiscal pero aún no registrados como proveedores.
  '20900000001': { razonSocial: 'Nuevo Sol S.A.C.', nombreComercial: 'Nuevo Sol', direccion: 'Av. Nueva 100', ciudad: 'Lima' },
}

export interface MockOptions {
  latenciaMs?: number
  semillas?: Proveedor[]
}

export class MockProveedoresRepository implements ProveedoresRepository {
  private readonly items: Proveedor[]
  private readonly latencia: number

  constructor(opts: MockOptions = {}) {
    this.items = (opts.semillas ?? PROVEEDORES_SEMILLA).map(clonar)
    this.latencia = opts.latenciaMs ?? Math.floor(300 + Math.random() * 400)
  }

  private demorar(): Promise<void> {
    if (this.latencia <= 0) return Promise.resolve()
    return new Promise((resolver) => setTimeout(resolver, this.latencia))
  }

  async listar(filtros: FiltrosProveedores): Promise<ListadoProveedores> {
    await this.demorar()
    const texto = filtros.texto.trim().toLowerCase()
    const tamano = filtros.tamano > 0 ? filtros.tamano : 10
    const filtrados = texto
      ? this.items.filter((p) =>
          [p.nombreComercial, p.ruc, p.contactoNombre].some((campo) =>
            campo.toLowerCase().includes(texto),
          ),
        )
      : this.items
    const total = filtrados.length
    const totalPaginas = total === 0 ? 0 : Math.ceil(total / tamano)
    const pagina = Math.min(Math.max(1, filtros.pagina), Math.max(1, totalPaginas))
    const inicio = (pagina - 1) * tamano
    return {
      items: filtrados.slice(inicio, inicio + tamano).map(clonar),
      pagina,
      tamano,
      total,
      totalPaginas,
    }
  }

  async getDatosFiscales(ruc: string): Promise<DatosFiscales> {
    await this.demorar()
    const limpio = ruc.trim()
    if (!RUC_PATTERN.test(limpio)) {
      throw new ProveedoresError('VALIDACION', 'Ingrese un RUC válido (11 dígitos).')
    }
    const datos = DATOS_FISCALES_POR_RUC[limpio]
    if (!datos) {
      throw new ProveedoresError(
        'NO_ENCONTRADO',
        `No se encontraron datos fiscales para el RUC ${limpio}.`,
      )
    }
    return clonar(datos)
  }

  async crear(input: ProveedorInput): Promise<Proveedor> {
    await this.demorar()
    this.asegurarRucDisponible(input.ruc)
    const proveedor: Proveedor = {
      ...clonar(input),
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
      estado: 'Activo',
    }
    this.items.push(proveedor)
    return clonar(proveedor)
  }

  async actualizar(id: string, input: ProveedorInput): Promise<Proveedor> {
    await this.demorar()
    const indice = this.items.findIndex((p) => p.id === id)
    if (indice === -1) throw new ProveedorNoEncontradoError()
    this.asegurarRucDisponible(input.ruc, id)
    const actualizado: Proveedor = { ...this.items[indice], ...clonar(input) }
    this.items[indice] = actualizado
    return clonar(actualizado)
  }

  async cambiarEstado(id: string, estado: EstadoProveedor): Promise<Proveedor> {
    await this.demorar()
    const indice = this.items.findIndex((p) => p.id === id)
    if (indice === -1) throw new ProveedorNoEncontradoError()
    const actualizado: Proveedor = { ...this.items[indice], estado }
    this.items[indice] = actualizado
    return clonar(actualizado)
  }

  private asegurarRucDisponible(ruc: string, exceptoId?: string): void {
    const existe = this.items.some((p) => p.ruc === ruc.trim() && p.id !== exceptoId)
    if (existe) throw new RucDuplicadoError()
  }
}