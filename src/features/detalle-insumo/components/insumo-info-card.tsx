import type { InsumoDetalle } from '../logic/types'

interface Props {
  insumo: InsumoDetalle | undefined
  isLoading: boolean
  isError: boolean
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  )
}

export function InsumoInfoCard({ insumo, isLoading, isError }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-2">Detalles de Insumo</h2>
      <div className="rounded-xl border border-border bg-card shadow-xs p-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando detalles del insumo…</p>
        ) : isError || !insumo ? (
          <p className="text-sm text-rose-600">No se pudieron cargar los detalles de este insumo.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Campo label="Nombre" value={insumo.nombre} />
            <Campo label="Código" value={insumo.codigo} />
            <Campo label="Categoría" value={insumo.categoria} />
            <Campo
              label="Estado"
              value={insumo.estado}
            />
            <Campo label="Stock actual" value={`${insumo.stockActual} ${insumo.unidadMedida}`} />
            <Campo label="Stock mínimo" value={`${insumo.stockMinimo} ${insumo.unidadMedida}`} />
            <Campo label="Unidad de medida" value={insumo.unidadMedida} />
            {insumo.descripcion ? (
              <div className="col-span-2 sm:col-span-4">
                <Campo label="Descripción" value={insumo.descripcion} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
