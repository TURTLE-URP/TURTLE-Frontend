import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { paginasVisibles } from '../logic/filters'

interface ProveedoresPaginationProps {
  pagina: number
  totalPaginas: number
  onPaginaChange: (pagina: number) => void
}

export function ProveedoresPagination({
  pagina,
  totalPaginas,
  onPaginaChange,
}: ProveedoresPaginationProps) {
  const puedeAnterior = pagina > 1
  const puedeSiguiente = pagina < totalPaginas

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      <nav aria-label="Paginación" className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Primera página"
          disabled={!puedeAnterior}
          onClick={() => onPaginaChange(1)}
        >
          <CaretDoubleLeftIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Anterior"
          disabled={!puedeAnterior}
          onClick={() => onPaginaChange(pagina - 1)}
        >
          <CaretLeftIcon />
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
          <CaretRightIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Última página"
          disabled={!puedeSiguiente}
          onClick={() => onPaginaChange(totalPaginas)}
        >
          <CaretDoubleRightIcon />
        </Button>
      </nav>
    </div>
  )
}