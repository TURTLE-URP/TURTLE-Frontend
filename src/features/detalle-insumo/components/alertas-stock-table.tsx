import { Check, PencilSimple, X } from '@phosphor-icons/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AlertaStock } from '../logic/types'

interface Props {
  alertas: AlertaStock[]
  editandoId: string | null
  borrador: Partial<AlertaStock>
  errores: Record<string, string>
  onAgregar: () => void
  onEditar: (alerta: AlertaStock) => void
  onCambiarCampo: (campo: keyof AlertaStock, valor: string | number) => void
  onConfirmar: () => void
  onCancelar: () => void
  onEliminar: (alerta: AlertaStock) => void
}

export function AlertasStockTable({
  alertas,
  editandoId,
  borrador,
  errores,
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
        <h2 className="text-sm font-semibold text-foreground">Alertas de Stock y Preferencias de reposición</h2>
        <p className="text-xs text-muted-foreground">Crea alertas globales o por almacén para prevenir escasez.</p>
      </div>

      <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden mt-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
              <TableHead className="text-center">Alcance</TableHead>
              <TableHead className="text-center">Mínimo: alertar cuando baje de</TableHead>
              <TableHead className="text-center">Cantidad a reponer (opcional)</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="p-0">
                <button
                  type="button"
                  onClick={onAgregar}
                  disabled={!!editandoId}
                  className="w-full py-2 text-xs font-semibold text-foreground bg-muted/40 hover:bg-muted/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Agregar Alerta
                </button>
              </TableCell>
            </TableRow>

            {alertas.map((alerta) => {
              const enEdicion = editandoId === alerta.id

              if (enEdicion) {
                return (
                  <TableRow key={alerta.id} className="bg-muted/20">
                    <TableCell>
                      <Input
                        autoFocus
                        value={borrador.alcance ?? ''}
                        onChange={(e) => onCambiarCampo('alcance', e.target.value)}
                        placeholder="GLOBAL o código de almacén"
                        aria-invalid={!!errores.alcance}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="any"
                        value={borrador.minimo ?? ''}
                        onChange={(e) => onCambiarCampo('minimo', e.target.value)}
                        placeholder="Ej. 14"
                        aria-invalid={!!errores.minimo}
                        className="h-8 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="any"
                        value={borrador.cantidadAReponer ?? ''}
                        onChange={(e) => onCambiarCampo('cantidadAReponer', e.target.value)}
                        placeholder="Opcional"
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
                <TableRow key={alerta.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-center font-medium text-foreground text-sm">
                    {alerta.alcance}
                  </TableCell>
                  <TableCell className="text-center text-sm">{alerta.minimo}</TableCell>
                  <TableCell className="text-center text-sm">{alerta.cantidadAReponer ?? '-'}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        title="Editar alerta"
                        onClick={() => onEditar(alerta)}
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        title="Eliminar alerta"
                        onClick={() => onEliminar(alerta)}
                        className="p-1 text-gray-500 hover:text-rose-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {alertas.length === 0 && !editandoId ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                  No hay alertas de stock configuradas.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
