import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CaretLeft } from '@phosphor-icons/react'
import type { MedidaAlterna } from '../logic/types'
import { InsumoInfoCard } from './insumo-info-card'
import { MedidasAlternasTable } from './medidas-alternas-table'
import { AlertasStockTable } from './alertas-stock-table'
import { VistaPreviaUso } from './vista-previa-uso'
import { AyudaBox } from './ayuda-box'

interface Props {
  insumoId: string
}

export function DetalleInsumoPage({ insumoId }: Props) {
  const [medidaSeleccionada, setMedidaSeleccionada] = useState<MedidaAlterna | null>(null)

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        to="/insumos"
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <CaretLeft size={14} /> Volver a Gestión de Insumos
      </Link>

      <InsumoInfoCard insumoId={insumoId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MedidasAlternasTable
            insumoId={insumoId}
            medidaSeleccionadaId={medidaSeleccionada?.id ?? null}
            onSeleccionar={setMedidaSeleccionada}
          />

          <AlertasStockTable insumoId={insumoId} />
        </div>

        <div className="space-y-6">
          <VistaPreviaUso medida={medidaSeleccionada} />
          <AyudaBox />
        </div>
      </div>
    </div>
  )
}
