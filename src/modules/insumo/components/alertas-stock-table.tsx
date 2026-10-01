import { useState } from 'react'
import { Check, PencilSimple, Plus, X } from '@phosphor-icons/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useToastStore } from '@/shared/stores/toast-store'
import { alertaStockSchema } from '../schemas/insumo.schema'
import { esAlcanceGlobal, parseIdAlmacen } from '../services/insumo.api'
import { AlcanceCombobox, type AlcanceSeleccionado } from './alcance-combobox'
import {
  useAlertas,
  useRemoveAlertaAlmacen,
  useRemoveAlertaGlobal,
  useUpsertAlertaAlmacen,
  useUpsertAlertaGlobal,
} from '../services/queries'
import type { AlertaStock } from '../interfaces/insumo.types'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'

interface Props {
  insumoId: string
}

interface Borrador {
  alcance: string
  minimo: string
  cantidadAReponer: string
}

const BORRADOR_VACIO: Borrador = { alcance: '', minimo: '', cantidadAReponer: '' }
const TEMP_ID = 'temp-nueva-alerta'
const VALOR_GLOBAL = 'GLOBAL'

export function AlertasStockTable({ insumoId }: Props) {
  const { data: alertas = [], isLoading, isError, refetch } = useAlertas(insumoId)
  const upsertGlobal = useUpsertAlertaGlobal(insumoId)
  const removeGlobal = useRemoveAlertaGlobal(insumoId)
  const upsertAlmacen = useUpsertAlertaAlmacen(insumoId)
  const removeAlmacen = useRemoveAlertaAlmacen(insumoId)
  const notificar = useToastStore((s) => s.notificar)

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [alertaAEliminar, setAlertaAEliminar] = useState<AlertaStock | null>(null)

  const guardando = upsertGlobal.isPending || upsertAlmacen.isPending

  // --- Reglas de disponibilidad -------------------------------------------
  // Solo existe una alerta global por insumo y una alerta por almacén.
  const tieneGlobal = alertas.some((a) => a.esGlobal ?? esAlcanceGlobal(a.alcance))
  const codigosConAlerta = new Set(
    alertas.filter((a) => !(a.esGlobal ?? esAlcanceGlobal(a.alcance))).map((a) => a.alcance),
  )
  // La lista de almacenes es infinita (cursor del backend): el botón siempre
  // está disponible y el combobox excluye los códigos que ya tienen alerta.
  const puedeAgregar = true
  const botonBloqueado = !puedeAgregar || !!editandoId || isLoading

  const [seleccion, setSeleccion] = useState<AlcanceSeleccionado | null>(null)

  function elegirAlcance(valor: AlcanceSeleccionado | null) {
    setSeleccion(valor)
    if (valor === null) {
      cambiarCampo('alcance', '')
    } else if (valor.tipo === 'global') {
      cambiarCampo('alcance', VALOR_GLOBAL)
    } else {
      cambiarCampo('alcance', valor.codigo)
    }
  }

  function cambiarCampo(campo: keyof Borrador, valor: string) {
    setBorrador((prev) => ({ ...prev, [campo]: valor }))
  }

  function agregar() {
    if (!puedeAgregar) return
    setEditandoId(TEMP_ID)
    setBorrador(BORRADOR_VACIO)
    setSeleccion(null)
    setErrores({})
  }

  function editar(alerta: AlertaStock) {
    setEditandoId(alerta.id)
    // El alcance no se edita: solo se muestra como lectura.
    setBorrador({
      alcance: alerta.alcance,
      minimo: String(alerta.minimo),
      cantidadAReponer: alerta.cantidadAReponer === undefined ? '' : String(alerta.cantidadAReponer),
    })
    setErrores({})
  }

  function cancelar() {
    setEditandoId(null)
    setBorrador(BORRADOR_VACIO)
    setSeleccion(null)
    setErrores({})
  }

  function guardarGlobal(minimo: number, cantidadAReponer: number | undefined) {
    upsertGlobal.mutate(
      { minimo, ...(cantidadAReponer === undefined ? {} : { cantidadAReponer }) },
      {
        onSuccess: () => {
          notificar('success', 'Alerta global guardada.')
          cancelar()
        },
        onError: () => notificar('error', 'No se pudo guardar la alerta global.'),
      },
    )
  }

  function guardarAlmacen(idAlmacen: number, minimo: number, cantidadAReponer: number | undefined) {
    upsertAlmacen.mutate(
      { idAlmacen, minimo, ...(cantidadAReponer === undefined ? {} : { cantidadAReponer }) },
      {
        onSuccess: () => {
          notificar('success', 'Alerta de almacén guardada.')
          cancelar()
        },
        onError: () => notificar('error', 'No se pudo guardar la alerta de almacén.'),
      },
    )
  }

  // Solo para filas legacy sin idAlmacen: el id viene del combobox al crear.
  function resolverIdAlmacen(codigo: string): number | null {
    return parseIdAlmacen(codigo)
  }

  function confirmar() {
    const esCreacion = editandoId === TEMP_ID
    // En edición el alcance viene de la fila original (no se edita).
    const alertaEnEdicion = esCreacion ? null : alertas.find((a) => a.id === editandoId)
    if (!esCreacion && !alertaEnEdicion) return

    const alcance = esCreacion ? borrador.alcance.trim() : (alertaEnEdicion as AlertaStock).alcance
    const payload = {
      alcance,
      minimo: borrador.minimo === '' ? undefined : borrador.minimo,
      cantidadAReponer: borrador.cantidadAReponer === '' ? undefined : borrador.cantidadAReponer,
    }
    const resultado = alertaStockSchema.safeParse(payload)
    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      setErrores(
        Object.fromEntries(
          Object.entries(campos).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? '']),
        ),
      )
      return
    }
    const { minimo, cantidadAReponer } = resultado.data

    if (esAlcanceGlobal(alcance)) {
      guardarGlobal(minimo, cantidadAReponer)
      return
    }

    // El id sale directo del combobox (sin resolver por código).
    const idAlmacen =
      seleccion !== null && seleccion.tipo === 'almacen'
        ? seleccion.id
        : resolverIdAlmacen(alcance)
    if (idAlmacen === null) {
      setErrores({ alcance: 'Selecciona un alcance válido' })
      return
    }
    guardarAlmacen(idAlmacen, minimo, cantidadAReponer)
  }

  function confirmarEliminacion() {
    if (!alertaAEliminar) return
    const alerta = alertaAEliminar
    const global = alerta.esGlobal ?? esAlcanceGlobal(alerta.alcance)
    if (global) {
      removeGlobal.mutate(undefined, {
        onSuccess: () => {
          notificar('success', 'Alerta global eliminada.')
          setAlertaAEliminar(null)
        },
        onError: () => notificar('error', 'No se pudo eliminar la alerta global.'),
      })
      return
    }
    const idAlmacen = alerta.idAlmacen ?? resolverIdAlmacen(alerta.alcance)
    if (idAlmacen === null) {
      notificar('error', 'No se pudo determinar el almacén de esta alerta.')
      return
    }
    removeAlmacen.mutate(idAlmacen, {
      onSuccess: () => {
        notificar('success', 'Alerta de almacén eliminada.')
        setAlertaAEliminar(null)
      },
      onError: () => notificar('error', 'No se pudo eliminar la alerta de almacén.'),
    })
  }

  return (
    <section>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Alertas de Stock y Preferencias de reposición
          </h2>
          <p className="text-xs text-muted-foreground">
            Crea alertas globales o por almacén para prevenir escasez.
          </p>
        </div>

        <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                <TableHead className="text-center">Alcance</TableHead>
                <TableHead className="text-center">Stock inicial</TableHead>
                <TableHead className="text-center">Stock a reponer</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <button
                    type="button"
                    onClick={agregar}
                    disabled={botonBloqueado}
                    className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Agregar Alerta
                  </button>
                </TableCell>
              </TableRow>

              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-sm text-muted-foreground">
                    Cargando alertas…
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-sm">
                    <span className="text-rose-600">No se pudieron cargar las alertas.</span>{' '}
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="font-semibold underline"
                    >
                      Reintentar
                    </button>
                  </TableCell>
                </TableRow>
              ) : null}

              {editandoId === TEMP_ID ? (
                <TableRow className="bg-muted/20">
                  <TableCell>
                    <AlcanceCombobox
                      autoFocus
                      mostrarGlobal={!tieneGlobal}
                      excluirCodigos={codigosConAlerta}
                      value={seleccion}
                      onChange={elegirAlcance}
                      error={errores.alcance}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      step="any"
                      value={borrador.minimo}
                      onChange={(e) => cambiarCampo('minimo', e.target.value)}
                      placeholder="Ej. 14"
                      aria-invalid={!!errores.minimo}
                      className="h-8 text-center"
                    />
                    {errores.minimo ? (
                      <p className="text-[11px] text-rose-600 mt-1 text-center">
                        {errores.minimo}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      step="any"
                      value={borrador.cantidadAReponer}
                      onChange={(e) => cambiarCampo('cantidadAReponer', e.target.value)}
                      placeholder="Opcional"
                      aria-invalid={!!errores.cantidadAReponer}
                      className="h-8 text-center"
                    />
                    {errores.cantidadAReponer ? (
                      <p className="text-[11px] text-rose-600 mt-1 text-center">
                        {errores.cantidadAReponer}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button type="button" size="sm" onClick={confirmar} disabled={guardando}>
                        <Check size={14} /> {guardando ? 'Guardando…' : 'Confirmar'}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={cancelar}>
                        <X size={14} /> Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading &&
                !isError &&
                alertas.map((alerta) => {
                  const enEdicion = editandoId === alerta.id
                  if (enEdicion) {
                    return (
                      <TableRow key={alerta.id} className="bg-muted/20">
                        <TableCell className="text-center font-medium text-foreground text-sm">
                          {alerta.alcance}
                        </TableCell>
                        <TableCell>
                          <Input
                            autoFocus
                            type="number"
                            min="1"
                            step="any"
                            value={borrador.minimo}
                            onChange={(e) => cambiarCampo('minimo', e.target.value)}
                            placeholder="Ej. 14"
                            aria-invalid={!!errores.minimo}
                            className="h-8 text-center"
                          />
                          {errores.minimo ? (
                            <p className="text-[11px] text-rose-600 mt-1 text-center">
                              {errores.minimo}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            step="any"
                            value={borrador.cantidadAReponer}
                            onChange={(e) => cambiarCampo('cantidadAReponer', e.target.value)}
                            placeholder="Opcional"
                            aria-invalid={!!errores.cantidadAReponer}
                            className="h-8 text-center"
                          />
                          {errores.cantidadAReponer ? (
                            <p className="text-[11px] text-rose-600 mt-1 text-center">
                              {errores.cantidadAReponer}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button type="button" size="sm" onClick={confirmar} disabled={guardando}>
                              <Check size={14} /> {guardando ? 'Guardando…' : 'Confirmar'}
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={cancelar}>
                              <X size={14} /> Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }
                  return (
                    <TableRow key={alerta.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-center font-medium text-foreground text-sm">
                        {alerta.alcance}
                      </TableCell>
                      <TableCell className="text-center text-sm">{alerta.minimo}</TableCell>
                      <TableCell className="text-center text-sm">
                        {alerta.cantidadAReponer ?? '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            title="Editar alerta"
                            onClick={() => editar(alerta)}
                            disabled={!!editandoId}
                            className="p-1 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PencilSimple size={16} />
                          </button>
                          <button
                            type="button"
                            title="Eliminar alerta"
                            onClick={() => setAlertaAEliminar(alerta)}
                            className="p-1 text-gray-500 hover:text-rose-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

              {!isLoading && !isError && alertas.length === 0 && !editandoId ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                    No hay alertas de stock configuradas.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <ConfirmDeleteDialog
          abierto={!!alertaAEliminar}
          titulo="Eliminar alerta de stock"
          descripcion={`¿Deseas eliminar la alerta de "${alertaAEliminar?.alcance ?? ''}"? Esta acción no se podrá deshacer.`}
          onCerrar={() => setAlertaAEliminar(null)}
          onConfirmar={confirmarEliminacion}
        />
      </section>
  )
}
