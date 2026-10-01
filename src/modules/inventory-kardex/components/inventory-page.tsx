import { useMemo, useState } from 'react'
import {
  MagnifyingGlassIcon,
  PackageIcon,
  WarningIcon,
  CurrencyDollarIcon,
  ArrowsDownUpIcon,
} from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
export type StockEstado = 'ok' | 'medio' | 'bajo' | 'agotado'

export interface Insumo {
  id: string
  sku: string
  nombre: string
  categoria: string
  stock: number
  unidad: string
  costoUnitario: number
  estado: StockEstado
}

const MOCK_INSUMOS: Insumo[] = [
  {
    id: '1',
    sku: 'INS-0012',
    nombre: 'Harina de trigo',
    categoria: 'Secos',
    stock: 120,
    unidad: 'kg',
    costoUnitario: 3.2,
    estado: 'ok',
  },
  {
    id: '2',
    sku: 'INS-0045',
    nombre: 'Aceite vegetal',
    categoria: 'Líquidos',
    stock: 8,
    unidad: 'L',
    costoUnitario: 7.5,
    estado: 'bajo',
  },
  {
    id: '3',
    sku: 'INS-0078',
    nombre: 'Pechuga de pollo',
    categoria: 'Carnes',
    stock: 22,
    unidad: 'kg',
    costoUnitario: 14.9,
    estado: 'medio',
  },
  {
    id: '4',
    sku: 'INS-0103',
    nombre: 'Queso mozzarella',
    categoria: 'Lácteos',
    stock: 3,
    unidad: 'kg',
    costoUnitario: 28,
    estado: 'bajo',
  },
  {
    id: '5',
    sku: 'INS-0156',
    nombre: 'Tomate fresco',
    categoria: 'Verduras',
    stock: 45,
    unidad: 'kg',
    costoUnitario: 2.8,
    estado: 'ok',
  },
  {
    id: '6',
    sku: 'INS-0201',
    nombre: 'Sal de mesa',
    categoria: 'Secos',
    stock: 18,
    unidad: 'kg',
    costoUnitario: 1.1,
    estado: 'ok',
  },
]

type FilterKey = 'todos' | 'ok' | 'bajo' | 'agotado'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'ok', label: 'Stock OK' },
  { key: 'bajo', label: 'Stock bajo' },
  { key: 'agotado', label: 'Agotado' },
]

function formatMoney(value: number) {
  return `S/ ${value.toFixed(2)}`
}

function estadoLabel(estado: StockEstado) {
  switch (estado) {
    case 'ok':
      return 'OK'
    case 'medio':
      return 'Medio'
    case 'bajo':
      return 'Bajo'
    case 'agotado':
      return 'Agotado'
  }
}

export interface InsumosListProps {
  insumos?: Insumo[]
  onKardex?: (insumo: Insumo) => void
  onEdit?: (insumo: Insumo) => void
  onNuevo?: () => void
  onExport?: () => void
}

export function InventoryPage({
  insumos = MOCK_INSUMOS,
  onKardex,
  onEdit,
  onNuevo,
  onExport,
}: InsumosListProps) {
  const [filter, setFilter] = useState<FilterKey>('todos')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return insumos.filter((item) => {
      const matchFilter =
        filter === 'todos'
          ? true
          : filter === 'bajo'
            ? item.estado === 'bajo' || item.estado === 'medio'
            : item.estado === filter

      const matchQuery =
        !q ||
        item.nombre.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q)

      return matchFilter && matchQuery
    })
  }, [insumos, filter, query])

  const total = insumos.length
  const stockBajo = insumos.filter((i) => i.estado === 'bajo' || i.estado === 'agotado').length
  const valor = insumos.reduce((acc, i) => acc + i.stock * i.costoUnitario, 0)

  return (
    <section aria-labelledby="inventario-title">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Módulo · Inventario y Kardex
      </p>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="inventario-title" className="text-3xl font-bold tracking-tight text-foreground">
            Lista de insumos
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Consulta stock, unidades y estado de cada insumo. Accede al kardex por producto.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={onExport}>
            Exportar
          </Button>
          <Button type="button" className="h-10 rounded-xl font-semibold" onClick={onNuevo}>
            + Nuevo insumo
          </Button>
        </div>
      </div>

      <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Insumos totales
            <PackageIcon size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">{total}</p>
          <p className="mt-1 text-xs text-secondary">Catálogo activo</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Stock bajo
            <WarningIcon size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight text-destructive">{stockBajo}</p>
          <p className="mt-1 text-xs text-destructive">Requieren reposición</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Valor inventario
            <CurrencyDollarIcon size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">S/ {(valor / 1000).toFixed(1)}k</p>
          <p className="mt-1 text-xs text-muted-foreground">Al costo promedio</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Movimientos hoy
            <ArrowsDownUpIcon size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">15</p>
          <p className="mt-1 text-xs text-muted-foreground">Entradas y salidas</p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado:</span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                filter === f.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-input bg-background px-3">
          <MagnifyingGlassIcon size={16} className="text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar insumo o SKU…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-muted text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Insumo</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Unidad</th>
                <th className="px-4 py-3">Costo unit.</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{item.nombre}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {item.categoria}
                    </span>
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3.5 font-semibold',
                      item.estado === 'ok' && 'text-secondary',
                      item.estado === 'medio' && 'text-amber-600',
                      (item.estado === 'bajo' || item.estado === 'agotado') && 'text-destructive',
                    )}
                  >
                    {item.stock}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{item.unidad}</td>
                  <td className="px-4 py-3.5">{formatMoney(item.costoUnitario)}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          item.estado === 'ok' && 'bg-secondary',
                          item.estado === 'medio' && 'bg-amber-500',
                          (item.estado === 'bajo' || item.estado === 'agotado') && 'bg-destructive',
                        )}
                      />
                      {estadoLabel(item.estado)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg"
                        onClick={() => onKardex?.(item)}
                      >
                        Kardex
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 rounded-lg"
                        onClick={() => onEdit?.(item)}
                      >
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No hay insumos con esos filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
