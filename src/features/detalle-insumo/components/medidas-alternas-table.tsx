import { Check, PencilSimple, Plus, X } from '@phosphor-icons/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MedidaAlterna } from '../logic/types'

interface Props {
  medidas: MedidaAlterna[]
  editandoId: string | null
  borrador: Partial<MedidaAlterna>
  errores: Record<string, string>
  medidaSeleccionadaId: string | null
  onSeleccionar: (medida: MedidaAlterna) => void
  onAgregar: () => void
  onEditar: (medida: MedidaAlterna) => void
  onCambiarCampo: (campo: keyof MedidaAlterna, valor: string | number) => void
  onConfirmar: () => void
  onCancelar: () => void
  onEliminar: (medida: MedidaAlterna) => void
}

export function MedidasAlternasTable({
  medidas,
  editandoId,
  borrador,
  errores,
  medidaSeleccionadaId,
  onSeleccionar,
  onAgregar,
  onEditar,
  onCambiarCampo,
  onConfirmar,
  onCancelar,
  onEliminar,
}: Props) {
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
                  onClick={onAgregar}
                  disabled={!!editandoId}
                  className="w-full py-2 text-xs font-semibold text-foreground bg-muted/40 hover:bg-muted/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Agregar Medida
                </button>
              </TableCell>
            </TableRow>

            {medidas.map((medida) => {
              const enEdicion = editandoId === medida.id
              const seleccionada = medidaSeleccionadaId === medida.id

              if (enEdicion) {
                return (
                  <TableRow key={medida.id} className="bg-muted/20">
                    <TableCell>
                      <Input
                        autoFocus
                        value={borrador.nombre ?? ''}
                        onChange={(e) => onCambiarCampo('nombre', e.target.value)}
                        placeholder="Ej. taza"
                        aria-invalid={!!errores.nombre}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={borrador.abreviatura ?? ''}
                        onChange={(e) => onCambiarCampo('abreviatura', e.target.value)}
                        placeholder="Ej. Tz"
                        aria-invalid={!!errores.abreviatura}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="any"
                        value={borrador.factorABase ?? ''}
                        onChange={(e) => onCambiarCampo('factorABase', e.target.value)}
                        placeholder="Ej. 0.25"
                        aria-invalid={!!errores.factorABase}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={borrador.uso ?? ''}
                        onChange={(e) => onCambiarCampo('uso', e.target.value)}
                        placeholder="Ej. Cocina"
                        aria-invalid={!!errores.uso}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button type="button" size="sm" onClick={onConfirmar}>
                          <Check size={14} /> Confirmar
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={onCancelar}>
                          <X size={14} /> Cancelar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }

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
                    {medida.esBase ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <div
                        className="flex items-center justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          title="Editar medida"
                          onClick={() => onEditar(medida)}
                          className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          type="button"
                          title="Eliminar medida"
                          onClick={() => onEliminar(medida)}
                          className="p-1 text-gray-500 hover:text-rose-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
