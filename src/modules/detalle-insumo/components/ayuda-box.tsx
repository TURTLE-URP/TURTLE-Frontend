import { Info } from '@phosphor-icons/react'

export function AyudaBox() {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
      <div className="flex items-center gap-2 text-sky-700 font-semibold text-sm mb-2">
        <Info size={18} weight="fill" />
        Ayuda
      </div>
      <ul className="text-xs text-sky-900/80 space-y-1.5 list-disc list-inside">
        <li>
          <span className="font-medium">Alcance:</span> define dónde aplica la alerta. Alertas globales
          para reposición, alertas por almacén para transferencia.
        </li>
        <li>
          <span className="font-medium">Cantidad a reponer:</span> global para pedir a proveedor. Por
          almacén para transferencia.
        </li>
      </ul>
    </div>
  )
}
