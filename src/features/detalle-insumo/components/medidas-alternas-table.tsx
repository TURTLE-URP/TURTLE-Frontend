import { useState } from 'react'
import { Check, PencilSimple, Plus, X } from '@phosphor-icons/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToastStore } from '@/stores/toast-store'
import { medidaAlternaSchema, USOS_MEDIDA } from '../logic/schema'
import { useCrearMedida, useMedidas } from '../logic/queries'
import type { MedidaAlterna } from '../logic/types'

interface Props {
  insumoId: string
  medidaSeleccionadaId: string | null
  onSeleccionar: (medida: MedidaAlterna) => void
}

interface Borrador {
  nombre: string
  abreviatura: string
  factorABase: string
  uso: string
}

const BORRADOR_VACIO: Borrador = { nombre: '', abreviatura: '', factorABase: '', uso: '' }

export function MedidasAlternasTable({ insumoId, medidaSeleccionadaId, onSeleccionar }: Props) {
  const { data: medidas = [], isLoading, isError, refetch } = useMedidas(insumoId)
  const crearMedida = useCrearMedida(insumoId)
  const notificar = useToastStore((s) => s.notificar)

  const [agregando, setAgregando] = useState(false)
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})

  function cambiarCampo(campo: keyof Borrador, valor: string) {
    setBorrador((prev) => ({ ...prev, [campo]: valor }))
  }

  function cancelar() {
    setAgregando(false)
    setBorrador(BORRADOR_VACIO)
    setErrores({})
  }

  function confirmar() {
    const resultado = medidaAlternaSchema.safeParse(borrador)
    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      setErrores(
        Object.fromEntries(
          Object.entries(campos).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? '']),
        ),
      )
      return
    }
    crearMedida.mutate(resultado.data, {
      onSuccess: () => {
        notificar('success', 'Medida alterna creada.')
        cancelar()
      },
      onError: () => {
        notificar('error', 'No se pudo crear la medida alterna.')
      },
    })
  }

  return (
    <section>
      <div>
        <h2 className="text-sm font-semibold text-foreground">Medidas Alternas</h2>
        <p className="text-xs text-muted-foreground">Gestiona las medidas alternas para este insumo</p>
      </div>

      <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden mt-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
              <TableHead className="text-center">Nombre</TableHead>
              <TableHead className="text-center">Abreviatura</TableHead>
              <TableHead className="text-center">Factor a Base</TableHead>
              <TableHead className="text-center">Uso</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="p-0">
                <button
                  type="button"
                  onClick={() => {
                    setAgregando(true)
                    setBorrador(BORRADOR_VACIO)
                    setErrores({})
                  }}
                  disabled={agregando || isLoading}
                  className="w-full py-2 text-xs font-semibold text-foreground bg-muted/40 hover:bg-muted/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Agregar Medida
                </button>
              </TableCell>
            </TableRow>

            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                  Cargando medidas…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-sm">
                  <span className="text-rose-600">No se pudieron cargar las medidas.</span>{' '}
                  <button type="button" onClick={() => refetch()} className="font-semibold underline">
                    Reintentar
                  </button>
                </TableCell>
              </TableRow>
            ) : null}

            {agregando ? (
              <TableRow className="bg-muted/20">
                <TableCell>
                  <Input
                    autoFocus
                    value={borrador.nombre}
                    onChange={(e) => cambiarCampo('nombre', e.target.value)}
                    placeholder="Ej. saco"
                    aria-invalid={!!errores.nombre}
                    className="h-8 text-center"
                  />
                  {errores.nombre ? (
                    <p className="text-[11px] text-rose-600 mt-1 text-center">{errores.nombre}</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Input
                    value={borrador.abreviatura}
                    onChange={(e) => cambiarCampo('abreviatura', e.target.value)}
                    placeholder="Ej. saco"
                    aria-invalid={!!errores.abreviatura}
                    className="h-8 text-center"
                  />
                  {errores.abreviatura ? (
                    <p className="text-[11px] text-rose-600 mt-1 text-center">{errores.abreviatura}</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={borrador.factorABase}
                    onChange={(e) => cambiarCampo('factorABase', e.target.value)}
                    placeholder="Ej. 0.25"
                    aria-invalid={!!errores.factorABase}
                    className="h-8 text-center"
                  />
                  {errores.factorABase ? (
                    <p className="text-[11px] text-rose-600 mt-1 text-center">{errores.factorABase}</p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <select
                    value={borrador.uso}
                    onChange={(e) => cambiarCampo('uso', e.target.value)}
                    aria-invalid={!!errores.uso}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-center text-sm"
                  >
                    <option value="">Selecciona</option>
                    {USOS_MEDIDA.map((uso) => (
                      <option key={uso} value={uso}>
                        {uso}
                      </option>
                    ))}
                  </select>
                  {errores.uso ? (
                    <p className="text-[11px] text-rose-600 mt-1 text-center">{errores.uso}</p>
                  ) : null}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button type="button" size="sm" onClick={confirmar} disabled={crearMedida.isPending}>
                      <Check size={14} /> {crearMedida.isPending ? 'Guardando…' : 'Confirmar'}
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
              medidas.map((medida) => {
                const seleccionada = medidaSeleccionadaId === medida.id
                return (
                  <TableRow
                    key={medida.id}
                    onClick={() => onSeleccionar(medida)}
                    className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                      seleccionada ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <TableCell className="text-center font-medium text-foreground text-sm">
                      {medida.nombre}
                    </TableCell>
                    <TableCell className="text-center text-sm">{medida.abreviatura}</TableCell>
                    <TableCell className="text-center text-sm">
                      {medida.factorABase}
                      {medida.esBase ? <span className="text-muted-foreground"> (BASE)</span> : null}
                    </TableCell>
                    <TableCell className="text-center text-sm">{medida.uso}</TableCell>
                    <TableCell className="text-center">
                      <div
                        className="flex items-center justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          title="Edición no disponible en el API por ahora"
                          disabled
                          className="p-1 text-gray-300 cursor-not-allowed"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          type="button"
                          title="Eliminación no disponible en el API por ahora"
                          disabled
                          className="p-1 text-gray-300 cursor-not-allowed"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

            {!isLoading && !isError && medidas.length === 0 && !agregando ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-sm">
                  No hay medidas alternas registradas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
