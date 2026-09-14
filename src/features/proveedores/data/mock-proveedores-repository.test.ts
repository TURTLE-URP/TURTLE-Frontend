import { describe, expect, it } from 'vitest'
import { MockProveedoresRepository, PROVEEDORES_SEMILLA } from './mock-proveedores-repository'
import { ProveedorNoEncontradoError, RucDuplicadoError } from './proveedores-repository'

function crearRepo() {
  return new MockProveedoresRepository({ latenciaMs: 0, semillas: PROVEEDORES_SEMILLA })
}

function entrada(
  sobre: Partial<Omit<import('./types').Proveedor, 'id' | 'fechaRegistro' | 'condicion'>> = {},
) {
  return {
    nombreComercial: 'Compañía Demo',
    ruc: '20300112233',
    razonSocial: 'Compañía Demo S.A.C.',
    contactos: [{ nombre: 'Ada Pérez', telefono: '+51 1 555 0199', email: 'ada@companiademo.pe' }],
    direccion: 'Av. Prueba 1',
    ...sobre,
  }
}

describe('MockProveedoresRepository.listar', () => {
  it('paginación tamaño 10: página 1 devuelve 10 ítems y el envelope correcto', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: '', pagina: 1, tamano: 10 })
    expect(res.items).toHaveLength(10)
    expect(res.tamano).toBe(10)
    expect(res.total).toBe(PROVEEDORES_SEMILLA.length)
    expect(res.totalPaginas).toBe(Math.ceil(PROVEEDORES_SEMILLA.length / 10))
    expect(res.pagina).toBe(1)
    expect(res.items[0]?.id).toBe('p01')
  })

  it('paginación: la última página devuelve el resto', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: '', pagina: 3, tamano: 10 })
    expect(res.items).toHaveLength(PROVEEDORES_SEMILLA.length - 20)
    expect(res.pagina).toBe(3)
  })

  it('búsqueda parcial por nombre comercial sin distinguir mayúsculas', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: 'ANDINA', pagina: 1, tamano: 10 })
    expect(res.total).toBeGreaterThan(0)
    expect(res.items.every((p) => p.nombreComercial.toLowerCase().includes('andina'))).toBe(true)
  })

  it('búsqueda parcial por RUC', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: '20123', pagina: 1, tamano: 10 })
    expect(res.total).toBeGreaterThan(0)
    expect(res.items.every((p) => p.ruc.includes('20123'))).toBe(true)
  })

  it('búsqueda parcial por contacto', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: 'María', pagina: 1, tamano: 10 })
    expect(res.total).toBeGreaterThan(0)
    expect(
      res.items.every((p) => p.contactos.some((c) => c.nombre.includes('María'))),
    ).toBe(true)
  })

  it('búsqueda sin coincidencias devuelve lista vacía y total 0', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: 'zzzzz', pagina: 1, tamano: 10 })
    expect(res.items).toHaveLength(0)
    expect(res.total).toBe(0)
    expect(res.totalPaginas).toBe(0)
  })

  it('clausura la página fuera del rango', async () => {
    const repo = crearRepo()
    const res = await repo.listar({ texto: '', pagina: 99, tamano: 10 })
    expect(res.pagina).toBe(res.totalPaginas)
  })
})

describe('MockProveedoresRepository.getDatosFiscales', () => {
  it('devuelve datos fiscales para un RUC del seed', async () => {
    const repo = crearRepo()
    const datos = await repo.getDatosFiscales('20123456789')
    expect(datos.razonSocial).toBe('Agro Andina S.A.C.')
    expect(datos.nombreComercial).toBe('Agro Andina')
  })

  it('rechaza con código NO_ENCONTRADO para un RUC sin datos fiscales', async () => {
    const repo = crearRepo()
    await expect(repo.getDatosFiscales('29999999999')).rejects.toThrow(
      expect.objectContaining({ code: 'NO_ENCONTRADO' }),
    )
  })

  it('rechaza con código VALIDACION para un RUC que no cumple el formato', async () => {
    const repo = crearRepo()
    await expect(repo.getDatosFiscales('12345')).rejects.toThrow(
      expect.objectContaining({ code: 'VALIDACION' }),
    )
  })
})

describe('MockProveedoresRepository.crear', () => {
  it('crea el proveedor con condición En proceso de verificación y lo agrega al listado', async () => {
    const repo = crearRepo()
    const creado = await repo.crear(entrada())
    expect(creado.condicion).toBe('En proceso de verificación')
    expect(creado.id).toBeTruthy()
    expect(new Date(creado.fechaRegistro).getTime()).not.toBeNaN()

    const res = await repo.listar({ texto: 'Compañía Demo', pagina: 1, tamano: 10 })
    expect(res.items.some((p) => p.id === creado.id)).toBe(true)
  })

  it('rechaza con RucDuplicadoError si el RUC ya existe', async () => {
    const repo = crearRepo()
    await expect(repo.crear(entrada({ ruc: '20123456789' }))).rejects.toBeInstanceOf(
      RucDuplicadoError,
    )
  })
})

describe('MockProveedoresRepository.actualizar', () => {
  it('actualiza los campos editables y conserva fechaRegistro y condicion', async () => {
    const repo = crearRepo()
    const original = PROVEEDORES_SEMILLA.find((p) => p.id === 'p01')!
    const contactosActualizados = [{ nombre: 'Juan López', telefono: '+51 1 555 0000', email: 'juan@agroandina.pe' }]
    const actualizado = await repo.actualizar('p01', entrada({ contactos: contactosActualizados }))
    expect(actualizado.contactos[0]?.nombre).toBe('Juan López')
    expect(actualizado.fechaRegistro).toBe(original.fechaRegistro)
    expect(actualizado.condicion).toBe(original.condicion)
  })

  it('rechaza RUC duplicado de otro proveedor', async () => {
    const repo = crearRepo()
    await expect(repo.actualizar('p01', entrada({ ruc: '20504445566' }))).rejects.toBeInstanceOf(
      RucDuplicadoError,
    )
  })

  it('permite conservar el propio RUC', async () => {
    const repo = crearRepo()
    const actualizado = await repo.actualizar('p01', entrada({ ruc: '20123456789' }))
    expect(actualizado.ruc).toBe('20123456789')
  })

  it('rechaza con ProveedorNoEncontradoError para un id inexistente', async () => {
    const repo = crearRepo()
    await expect(repo.actualizar('nope', entrada())).rejects.toBeInstanceOf(
      ProveedorNoEncontradoError,
    )
  })
})

describe('MockProveedoresRepository.eliminar', () => {
  it('elimina físicamente el registro del mock', async () => {
    const repo = crearRepo()
    const totalAntes = (await repo.listar({ texto: '', pagina: 1, tamano: 100 })).total
    await repo.eliminar('p01')
    const totalDespues = (await repo.listar({ texto: '', pagina: 1, tamano: 100 })).total
    expect(totalDespues).toBe(totalAntes - 1)
    const listado = await repo.listar({ texto: '', pagina: 1, tamano: 100 })
    expect(listado.items.some((p) => p.id === 'p01')).toBe(false)
  })

  it('rechaza con ProveedorNoEncontradoError para un id inexistente', async () => {
    const repo = crearRepo()
    await expect(repo.eliminar('nope')).rejects.toBeInstanceOf(
      ProveedorNoEncontradoError,
    )
  })
})