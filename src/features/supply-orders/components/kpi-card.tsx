import type { Icon } from '@phosphor-icons/react'

interface KpiCardProps {
  /** Phosphor icon component displayed in the tile corner. */
  icon: Icon
  /** Short label above the value. */
  label: string
  /** Already formatted value (e.g. "S/ 1,108"). */
  value: string
  /** Supporting caption below the value. */
  sub: string
  /** When set, the tile renders with a destructive accent. */
  warn?: boolean
}

/** Single KPI tile for the supply orders dashboard. */
export function KpiCard({ icon: IconComponent, label, value, sub, warn = false }: KpiCardProps) {
  return (
    <div className={`rounded-none border bg-card p-4 ${warn ? 'border-destructive/30' : 'border-border'}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <IconComponent size={14} className={warn ? 'text-destructive' : 'text-muted-foreground'} />
      </div>
      <p className={`font-mono text-2xl font-semibold ${warn ? 'text-destructive' : 'text-foreground'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  )
}
