import { useEffect, useMemo, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useAlmacenesOptions } from '@/modules/almacen/hooks/use-almacenes-options'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

export type AlcanceSeleccionado =
  | { tipo: 'global' }
  | { tipo: 'almacen'; id: number; codigo: string; nombre: string }

interface Props {
  /** GLOBAL aparece fija primera solo si aún no existe la alerta global. */
  mostrarGlobal: boolean
  /** Códigos de almacén que ya tienen alerta: se ocultan de la lista. */
  excluirCodigos?: Set<string>
  value: AlcanceSeleccionado | null
  onChange: (valor: AlcanceSeleccionado | null) => void
  error?: string
  autoFocus?: boolean
}

type FilaVisible = AlcanceSeleccionado & { key: string; etiqueta: string; sub?: string }

export function AlcanceCombobox({
  mostrarGlobal,
  excluirCodigos,
  value,
  onChange,
  error,
  autoFocus,
}: Props) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const listaRef = useRef<HTMLDivElement | null>(null)

  const { opciones, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useAlmacenesOptions(busqueda, 10)

  const filas: FilaVisible[] = useMemo(() => {
    const lista: FilaVisible[] = []
    if (mostrarGlobal) {
      lista.push({ key: 'global', tipo: 'global', etiqueta: 'GLOBAL', sub: 'Todos los almacenes' })
    }
    for (const op of opciones) {
      if (excluirCodigos?.has(op.codigo)) continue
      lista.push({
        key: `alm-${op.id}`,
        tipo: 'almacen',
        id: op.id,
        codigo: op.codigo,
        nombre: op.nombre,
        etiqueta: op.codigo,
        sub: op.nombre,
      })
    }
    return lista
  }, [mostrarGlobal, opciones, excluirCodigos])

  function cambiarBusqueda(valor: string) {
    setBusqueda(valor)
    setResaltado(0)
  }

  function cambiarAbierto(abrir: boolean) {
    if (abrir) {
      setBusqueda('')
      setResaltado(0)
    }
    setAbierto(abrir)
  }

  // Infinite scroll: al ver el sentinel se pide la siguiente página del cursor.
  useEffect(() => {
    if (!abierto) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root: listaRef.current, rootMargin: '40px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [abierto, hasNextPage, isFetchingNextPage, fetchNextPage, filas.length])

  function elegir(fila: FilaVisible) {
    if (fila.tipo === 'global') {
      onChange({ tipo: 'global' })
    } else {
      onChange({ tipo: 'almacen', id: fila.id, codigo: fila.codigo, nombre: fila.nombre })
    }
    setAbierto(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setResaltado((prev) => Math.min(prev + 1, filas.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setResaltado((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      const fila = filas[resaltado]
      if (fila) {
        e.preventDefault()
        elegir(fila)
      }
    }
  }

  const etiquetaSeleccionada =
    value === null
      ? 'GLOBAL/ALM-XXX'
      : value.tipo === 'global'
        ? 'GLOBAL'
        : `${value.codigo} — ${value.nombre}`

  return (
    <div>
      <Popover.Root open={abierto} onOpenChange={cambiarAbierto}>
        <Popover.Trigger asChild>
          <button
            type="button"
            autoFocus={autoFocus}
            aria-invalid={!!error}
            className={cn(
              'h-8 w-full rounded-md border border-input bg-background px-2 text-sm',
              'flex items-center justify-between gap-1 text-left',
              value === null && 'text-muted-foreground',
            )}
          >
            <span className="truncate">{etiquetaSeleccionada}</span>
            <CaretDownIcon size={14} className="shrink-0 text-muted-foreground" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="start"
            className="z-50 w-64 rounded-md border border-border bg-white p-1 shadow-md"
            onKeyDown={onKeyDown}
          >
            <div className="relative mb-1">
              <MagnifyingGlassIcon
                size={14}
                className="absolute left-2 top-2.5 text-muted-foreground pointer-events-none"
              />
              <Input
                autoFocus
                value={busqueda}
                onChange={(e) => cambiarBusqueda(e.target.value)}
                placeholder="Buscar almacén..."
                className="h-8 pl-7 text-sm"
              />
            </div>
            <div ref={listaRef} className="max-h-52 overflow-y-auto">
              {isLoading ? (
                <p className="py-4 text-center text-xs text-muted-foreground">Buscando…</p>
              ) : isError ? (
                <p className="py-4 text-center text-xs text-rose-600">
                  No se pudieron cargar los almacenes.
                </p>
              ) : filas.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Sin resultados.
                </p>
              ) : (
                filas.map((fila, i) => {
                  const seleccionada =
                    value !== null &&
                    (fila.tipo === 'global'
                      ? value.tipo === 'global'
                      : value.tipo === 'almacen' && value.id === fila.id)
                  return (
                    <button
                      key={fila.key}
                      type="button"
                      onMouseEnter={() => setResaltado(i)}
                      onClick={() => elegir(fila)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm',
                        i === resaltado ? 'bg-muted' : 'bg-transparent',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center',
                          seleccionada ? 'text-emerald-600' : 'text-transparent',
                        )}
                      >
                        <CheckIcon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{fila.etiqueta}</span>
                        {fila.sub ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {fila.sub}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  )
                })
              )}
              <div ref={sentinelRef} />
              {isFetchingNextPage ? (
                <p className="py-2 text-center text-xs text-muted-foreground">Cargando más…</p>
              ) : null}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error ? <p className="text-[11px] text-rose-600 mt-1 text-center">{error}</p> : null}
    </div>
  )
}
