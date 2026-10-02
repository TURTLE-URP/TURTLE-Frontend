import { WarningCircleIcon } from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import type { Proveedor } from '../interfaces/types'

interface ProveedorConfirmDialogProps {
  abierto: boolean
  proveedor: Proveedor | null
  onCerrar: () => void
  onConfirmar: () => void
}

export function ProveedorConfirmDialog({
  abierto,
  proveedor,
  onCerrar,
  onConfirmar,
}: ProveedorConfirmDialogProps) {
  return (
    <AlertDialog
      open={abierto}
      onOpenChange={(abierto) => {
        if (!abierto) onCerrar()
      }}
    >
      <AlertDialogContent>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <WarningCircleIcon className="size-5 text-destructive" weight="fill" />
          </div>
          <div className="flex-1 space-y-2">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar proveedor</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Deseas eliminar a <strong>{proveedor?.nombreComercial}</strong>?
                Esta acción no se podrá deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={onConfirmar}>
              Sí, eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
