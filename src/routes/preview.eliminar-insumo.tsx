import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { InsumoDeleteDialog } from '@/modules/eliminar-insumo/components/insumo-delete-dialog'
import type { InsumoAEliminar } from '@/modules/eliminar-insumo/interfaces/types'

export const Route = createFileRoute('/preview/eliminar-insumo')({
  component: PreviewEliminarInsumo,
})

// Insumo de prueba, solo para esta previsualización.
const INSUMO_MOCK: InsumoAEliminar = {
  id: '1',
  codigo: 'INS-0001',
  nombre: 'Harina',
}

function PreviewEliminarInsumo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-10 space-y-4">
      <p className="text-sm text-muted-foreground">
        Página temporal de prueba — bórrala cuando el botón real de "Eliminar" exista en la tabla.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Abrir modal "Eliminar insumo"
      </button>

      <InsumoDeleteDialog
        open={open}
        insumo={INSUMO_MOCK}
        onOpenChange={setOpen}
        onConfirmar={() => {
          setOpen(false)
        }}
      />
    </div>
  )
}