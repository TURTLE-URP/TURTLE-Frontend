import { ArrowClockwise, Check, Warning, X } from '@phosphor-icons/react'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useEvaluacionEliminarInsumo } from '../logic/hooks'
import type { InsumoAEliminar } from '../logic/types'

interface Props {
  open: boolean
  insumo: InsumoAEliminar | null
  onOpenChange: (open: boolean) => void
  onConfirmar: () => void
}

/**
 * Modal "¿Eliminar insumo?": evalúa (por ahora con datos mock) si el insumo
 * cumple los 3 criterios para poder eliminarse definitivamente, y solo
 * habilita el botón "Eliminar" cuando los 3 pasan.
 *
 * Integración desde gestionar-insumos (o donde esté el botón real):
 *
 *   import { InsumoDeleteDialog } from '@/features/eliminar-insumo/components/insumo-delete-dialog'
 *
 *   const [insumoAEliminar, setInsumoAEliminar] = useState<Insumo | null>(null)
 *   ...
 *   <InsumosTable ... onEliminar={setInsumoAEliminar} />
 *   <InsumoDeleteDialog
 *     open={!!insumoAEliminar}
 *     insumo={insumoAEliminar}
 *     onOpenChange={(open) => !open && setInsumoAEliminar(null)}
 *     onConfirmar={() => {
 *       if (insumoAEliminar) eliminarInsumo(insumoAEliminar.id) // borrado real, aún por crear
 *       setInsumoAEliminar(null)
 *     }}
 *   />
 *
 * `insumo` acepta cualquier objeto con { id, codigo, nombre } — no hace
 * falta importar el tipo `Insumo` de gestionar-insumos.
 */
export function InsumoDeleteDialog({ open, insumo, onOpenChange, onConfirmar }: Props) {
  const {
    data: evaluacion,
    isLoading,
    isError,
    refetch,
  } = useEvaluacionEliminarInsumo(insumo?.id, open)

  const bloqueos = evaluacion?.criterios.filter((c) => !c.cumple).length ?? 0
  const puedeEliminar = !isLoading && !isError && bloqueos === 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden max-w-md">
        {/* Encabezado */}
        <div className="relative bg-rose-100 px-5 py-4 flex items-center gap-2">
          <Warning size={22} weight="fill" className="text-rose-600 shrink-0" />
          <h2 className="text-base font-bold text-rose-900">¿Eliminar insumo?</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            title="Cerrar"
            className="ml-auto flex size-7 items-center justify-center rounded-full bg-white text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Resumen del insumo */}
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm text-sky-900">
            <span className="font-semibold">{insumo?.codigo}</span> {insumo?.nombre}
            {evaluacion ? (
              <>
                {' '}
                • {evaluacion.stockTotal} kg en {evaluacion.numAlmacenes} almacenes
              </>
            ) : null}{' '}
            • ¿Estás seguro?
          </div>

          {/* Criterios evaluados */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Evaluado por el sistema ahora mismo:
            </p>
            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              {isLoading ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">Evaluando insumo…</p>
              ) : isError || !evaluacion ? (
                <p className="px-3 py-4 text-sm text-rose-600">
                  No se pudo evaluar este insumo. Intenta de nuevo.
                </p>
              ) : (
                evaluacion.criterios.map((criterio) => (
                  <div key={criterio.id} className="flex items-start gap-3 px-3 py-2.5">
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        criterio.cumple ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {criterio.cumple ? <Check size={12} weight="bold" /> : <X size={12} weight="bold" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{criterio.titulo}</p>
                      {criterio.detalle ? (
                        <p className="text-xs text-muted-foreground mt-0.5">{criterio.detalle}</p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Aviso de denegación */}
          {!isLoading && !isError && bloqueos > 0 ? (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5 flex items-center justify-between gap-3">
              <p className="text-sm text-rose-700">
                No se puede eliminar: {bloqueos} {bloqueos === 1 ? 'bloqueo' : 'bloqueos'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors shrink-0"
              >
                <ArrowClockwise size={13} /> Reintentar
              </button>
            </div>
          ) : null}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Volver
          </Button>
          <Button
            type="button"
            disabled={!puedeEliminar}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-rose-600"
            onClick={onConfirmar}
          >
            Eliminar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}