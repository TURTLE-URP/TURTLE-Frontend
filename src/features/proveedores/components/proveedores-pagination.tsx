import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { paginasVisibles } from '../logic/filters'

interface ProveedoresPaginationProps {
  pagina: number
  totalPaginas: number
  total: number
  tamano: number
  onPaginaChange: (pagina: number) => void
}

export function ProveedoresPagination({
  pagina,
  totalPaginas,
  total,
  tamano,
  onPaginaChange,
}: ProveedoresPaginationProps) {
  const puedeAnterior = pagina > 1
  const puedeSiguiente = pagina < totalPaginas
  const desde = total === 0 ? 0 : (pagina - 1) * tamano + 1
  const hasta = Math.min(pagina * tamano, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Mostrando {desde}–{hasta} de {total}
      </p>
      <nav aria-label="Paginación" className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Primera página"
          disabled={!puedeAnterior}
          onClick={() => onPaginaChange(1)}
        >
          <CaretDoubleLeft />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Anterior"
          disabled={!puedeAnterior}
          onClick={() => onPaginaChange(pagina - 1)}
        >
          <CaretLeft />
        </Button>
        {paginasVisibles(pagina, totalPaginas).map((numero) =>
          numero === pagina ? (
            <Button
              key={numero}
              type="button"
              size="icon-sm"
              aria-current="page"
              className="bg-blue-700 text-white hover:bg-blue-800"
              onClick={() => onPaginaChange(numero)}
            >
              {numero}
            </Button>
          ) : (
            <Button
              key={numero}
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onPaginaChange(numero)}
            >
              {numero}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Siguiente"
          disabled={!puedeSiguiente}
          onClick={() => onPaginaChange(pagina + 1)}
        >
          <CaretRight />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Última página"
          disabled={!puedeSiguiente}
          onClick={() => onPaginaChange(totalPaginas)}
        >
          <CaretDoubleRight />
        </Button>
      </nav>
    </div>
  )
}