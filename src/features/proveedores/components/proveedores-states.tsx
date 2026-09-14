import { Button } from '@/components/ui/button'

export function ListadoCargando() {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <span className="sr-only">Cargando proveedores…</span>
      <div aria-hidden="true" className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div aria-hidden="true" className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div aria-hidden="true" className="h-10 w-2/3 animate-pulse rounded-md bg-muted" />
    </div>
  )
}

export function ListadoError({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-red-600 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-900">No se pudo cargar el listado de proveedores.</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onReintentar}>
        Reintentar
      </Button>
    </div>
  )
}

export function ListadoVacio({ onRegistrar }: { onRegistrar: () => void }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium text-foreground">Aún no hay proveedores registrados.</p>
      <Button type="button" className="mt-4" onClick={onRegistrar}>
        Registrar primer proveedor
      </Button>
    </div>
  )
}

export function SinResultados({ onLimpiar }: { onLimpiar: () => void }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium text-foreground">
        No hay resultados que coincidan con tu búsqueda.
      </p>
      <Button type="button" variant="outline" className="mt-4" onClick={onLimpiar}>
        Limpiar búsqueda
      </Button>
    </div>
  )
}