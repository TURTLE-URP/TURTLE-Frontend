import { WarningCircle } from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface Props {
  abierto: boolean
  titulo: string
  descripcion: string
  onCerrar: () => void
  onConfirmar: () => void
}

export function ConfirmDeleteDialog({ abierto, titulo, descripcion, onCerrar, onConfirmar }: Props) {
  return (
    <AlertDialog
      open={abierto}
      onOpenChange={(open) => {
        if (!open) onCerrar()
      }}
    >
      <AlertDialogContent>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <WarningCircle className="size-5 text-destructive" weight="fill" />
          </div>
          <div className="flex-1 space-y-2">
            <AlertDialogHeader>
              <AlertDialogTitle>{titulo}</AlertDialogTitle>
              <AlertDialogDescription>{descripcion}</AlertDialogDescription>
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
