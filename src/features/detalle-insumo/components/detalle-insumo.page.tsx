import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CaretLeft } from '@phosphor-icons/react'
import { useAlertasStock, useInsumoDetalle, useMedidasAlternas } from '../logic/hooks'
import type { AlertaStock, MedidaAlterna } from '../logic/types'
import { InsumoInfoCard } from './insumo-info-card'
import { MedidasAlternasTable } from './medidas-alternas-table'
import { AlertasStockTable } from './alertas-stock-table'
import { VistaPreviaUso } from './vista-previa-uso'
import { AyudaBox } from './ayuda-box'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'

interface Props {
  insumoId: string
}

export function DetalleInsumoPage({ insumoId }: Props) {
  const { data: insumo, isLoading, isError } = useInsumoDetalle(insumoId)
  const medidasTabla = useMedidasAlternas()
  const alertasTabla = useAlertasStock()

  const [medidaSeleccionada, setMedidaSeleccionada] = useState<MedidaAlterna | null>(null)
  const [medidaAEliminar, setMedidaAEliminar] = useState<MedidaAlterna | null>(null)
  const [alertaAEliminar, setAlertaAEliminar] = useState<AlertaStock | null>(null)

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        to="/insumos"
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <CaretLeft size={14} /> Volver a Gestión de Insumos
      </Link>

      <InsumoInfoCard insumo={insumo} isLoading={isLoading} isError={isError} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MedidasAlternasTable
            medidas={medidasTabla.filas}
            editandoId={medidasTabla.editandoId}
            borrador={medidasTabla.borrador}
            errores={medidasTabla.errores}
            medidaSeleccionadaId={medidaSeleccionada?.id ?? null}
            onSeleccionar={setMedidaSeleccionada}
            onAgregar={medidasTabla.agregarFila}
            onEditar={medidasTabla.editarFila}
            onCambiarCampo={medidasTabla.actualizarCampo}
            onConfirmar={medidasTabla.confirmarFila}
            onCancelar={medidasTabla.cancelar}
            onEliminar={setMedidaAEliminar}
          />

          <AlertasStockTable
            alertas={alertasTabla.filas}
            editandoId={alertasTabla.editandoId}
            borrador={alertasTabla.borrador}
            errores={alertasTabla.errores}
            onAgregar={alertasTabla.agregarFila}
            onEditar={alertasTabla.editarFila}
            onCambiarCampo={alertasTabla.actualizarCampo}
            onConfirmar={alertasTabla.confirmarFila}
            onCancelar={alertasTabla.cancelar}
            onEliminar={setAlertaAEliminar}
          />
        </div>

        <div className="space-y-6">
          <VistaPreviaUso medida={medidaSeleccionada} />
          <AyudaBox />
        </div>
      </div>

      <ConfirmDeleteDialog
        abierto={!!medidaAEliminar}
        titulo="Eliminar medida alterna"
        descripcion={`¿Deseas eliminar la medida "${medidaAEliminar?.nombre ?? ''}"? Esta acción no se podrá deshacer.`}
        onCerrar={() => setMedidaAEliminar(null)}
        onConfirmar={() => {
          if (medidaAEliminar) {
            medidasTabla.eliminarFila(medidaAEliminar.id)
            if (medidaSeleccionada?.id === medidaAEliminar.id) setMedidaSeleccionada(null)
          }
          setMedidaAEliminar(null)
        }}
      />

      <ConfirmDeleteDialog
        abierto={!!alertaAEliminar}
        titulo="Eliminar alerta de stock"
        descripcion={`¿Deseas eliminar la alerta de "${alertaAEliminar?.alcance ?? ''}"? Esta acción no se podrá deshacer.`}
        onCerrar={() => setAlertaAEliminar(null)}
        onConfirmar={() => {
          if (alertaAEliminar) alertasTabla.eliminarFila(alertaAEliminar.id)
          setAlertaAEliminar(null)
        }}
      />
    </div>
  )
}
