import { PrinterIcon, ArrowDownIcon, ArrowUpIcon, DropIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { formatMovementDate, formatMovementTime } from '../logic/format-date'
import { movementTypeLabel } from '../logic/movement-type'
import type { KardexMovement } from '../types'

export interface MovementDetailPanelProps {
  movement: KardexMovement | null
  insumoNombre: string
  unidadMedida: string
}

/** Mapa de estilos por tipo de movimiento */
const TIPO_STYLES = {
  entrada: {
    panel: 'border-emerald-200 bg-emerald-50',
    header: 'border-b border-emerald-200 bg-emerald-100/60',
    title: 'text-emerald-800',
    badge: 'bg-emerald-600 text-white',
    field: 'border-emerald-200 bg-white',
    icon: <ArrowDownIcon size={16} weight="bold" />,
    iconWrap: 'bg-emerald-100 text-emerald-700',
    label: 'text-emerald-700',
  },
  salida: {
    panel: 'border-amber-200 bg-amber-50',
    header: 'border-b border-amber-200 bg-amber-100/60',
    title: 'text-amber-800',
    badge: 'bg-amber-500 text-white',
    field: 'border-amber-200 bg-white',
    icon: <ArrowUpIcon size={16} weight="bold" />,
    iconWrap: 'bg-amber-100 text-amber-700',
    label: 'text-amber-700',
  },
  merma: {
    panel: 'border-rose-200 bg-rose-50',
    header: 'border-b border-rose-200 bg-rose-100/60',
    title: 'text-rose-800',
    badge: 'bg-rose-600 text-white',
    field: 'border-rose-200 bg-white',
    icon: <DropIcon size={16} weight="bold" />,
    iconWrap: 'bg-rose-100 text-rose-700',
    label: 'text-rose-700',
  },
  default: {
    panel: 'border-border bg-card',
    header: 'border-b border-border bg-muted/40',
    title: 'text-foreground',
    badge: 'bg-muted text-muted-foreground',
    field: 'border-border bg-white',
    icon: null,
    iconWrap: 'bg-muted text-muted-foreground',
    label: 'text-muted-foreground',
  },
}

/** Genera y descarga un PDF con el detalle del movimiento usando jsPDF */
async function exportarPDF(
  movement: KardexMovement,
  insumoNombre: string,
  unidadMedida: string,
) {
  // Importación dinámica para no bloquear el bundle inicial
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const tipoLabel = movementTypeLabel(movement.tipo).toUpperCase()
  const fecha = `${formatMovementDate(movement.fecha)} ${formatMovementTime(movement.fecha)}`
  const balanceBefore =
    movement.tipo === 'entrada'
      ? movement.saldoResultante - movement.cantidad
      : movement.saldoResultante + movement.cantidad
  const signo = movement.tipo === 'entrada' ? '+' : '-'

  const MARGIN = 20
  const COL = MARGIN
  const PAGE_W = 210
  const CONTENT_W = PAGE_W - MARGIN * 2

  // ── Encabezado ──────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42)           // slate-900
  doc.rect(0, 0, PAGE_W, 28, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('TURTLE · Kardex de Almacén', COL, 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Detalle de movimiento — ${tipoLabel}`, COL, 21)

  // ── Cuerpo ───────────────────────────────────────────────────────────────
  let y = 38

  const addRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)   // slate-500
    doc.text(label.toUpperCase(), COL, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)      // slate-900
    doc.text(value, COL, y)
    y += 3

    // línea separadora
    doc.setDrawColor(226, 232, 240)   // slate-200
    doc.line(COL, y, COL + CONTENT_W, y)
    y += 6
  }

  addRow('Insumo', insumoNombre)
  addRow('Documento / comprobante', movement.documento)
  addRow('Fecha / hora', fecha)
  addRow('Tipo de movimiento', tipoLabel)
  addRow('Cantidad', `${signo}${movement.cantidad} ${unidadMedida}`)
  addRow('Saldo anterior → nuevo', `${balanceBefore} ${unidadMedida} → ${movement.saldoResultante} ${unidadMedida}`)
  addRow('Motivo', movement.motivo)
  addRow('Responsable', movement.responsable)

  // ── Pie de página ────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)   // slate-400
  doc.text(`Generado el ${today} · TURTLE Sistema de Gestión`, COL, 285)

  doc.save(`kardex-${movement.documento}-${movement.id}.pdf`)
}

function DetailField({
  label,
  value,
  fieldClass,
  labelClass,
}: {
  label: string
  value: string
  fieldClass: string
  labelClass: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>
        {label}
      </span>
      <div className={`min-h-9 rounded-md border px-3 py-2 text-sm text-foreground ${fieldClass}`}>
        {value}
      </div>
    </div>
  )
}

/** Persistent detail panel for the currently selected Kardex movement. */
export function MovementDetailPanel({
  movement,
  insumoNombre,
  unidadMedida,
}: MovementDetailPanelProps) {
  const balanceBefore = movement
    ? movement.tipo === 'entrada'
      ? movement.saldoResultante - movement.cantidad
      : movement.saldoResultante + movement.cantidad
    : null

  const styles = movement ? (TIPO_STYLES[movement.tipo] ?? TIPO_STYLES.default) : TIPO_STYLES.default

  return (
    <aside
      aria-label="Detalle del movimiento seleccionado"
      className={`flex min-h-96 flex-col rounded-xl border shadow-xs overflow-hidden transition-colors duration-200 ${styles.panel}`}
    >
      {/* Header del panel */}
      <div className={`flex items-center gap-3 px-4 py-3 ${styles.header}`}>
        {movement && (
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
            {styles.icon}
            {movementTypeLabel(movement.tipo).toUpperCase()}
          </span>
        )}
        <h2 className={`text-sm font-semibold ${styles.title}`}>
          Detalle del movimiento
        </h2>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {movement && balanceBefore !== null ? (
          <>
            <DetailField
              label="Fecha / hora"
              value={`${formatMovementDate(movement.fecha)}  ${formatMovementTime(movement.fecha)}`}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Tipo / cantidad"
              value={`${movementTypeLabel(movement.tipo).toUpperCase()} · ${movement.tipo === 'entrada' ? '+' : '-'}${movement.cantidad} ${unidadMedida}`}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Saldo anterior → nuevo"
              value={`${balanceBefore} ${unidadMedida} → ${movement.saldoResultante} ${unidadMedida}`}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Insumo"
              value={insumoNombre}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Documento / comprobante"
              value={movement.documento}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Motivo"
              value={movement.motivo}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <DetailField
              label="Responsable"
              value={movement.responsable}
              fieldClass={styles.field}
              labelClass={styles.label}
            />
            <div className="mt-auto pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => exportarPDF(movement, insumoNombre, unidadMedida)}
                className="w-full sm:w-auto"
              >
                <PrinterIcon aria-hidden="true" />
                Exportar PDF
              </Button>
            </div>
          </>
        ) : (
          <p className="m-auto max-w-xs text-center text-sm text-muted-foreground py-8">
            Selecciona un movimiento de la lista para ver su detalle completo.
          </p>
        )}
      </div>
    </aside>
  )
}
