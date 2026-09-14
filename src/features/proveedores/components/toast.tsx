import { useEffect } from 'react'
import { useToastStore } from '@/stores/toast-store'

interface ToastItemProps {
  id: string
  tono: 'success' | 'error'
  mensaje: string
}

function ToastItem({ id, tono, mensaje }: ToastItemProps) {
  const descartar = useToastStore((state) => state.descartar)

  useEffect(() => {
    const timer = setTimeout(() => descartar(id), 6000)
    return () => clearTimeout(timer)
  }, [id, descartar])

  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-lg border p-4 shadow-lg ${
        tono === 'success'
          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
          : 'border-red-600 bg-red-50 text-red-900'
      }`}
    >
      <p className="text-sm font-medium">{mensaje}</p>
      <button
        type="button"
        aria-label="Cerrar notificación"
        className="rounded p-1 text-sm leading-none hover:bg-black/10"
        onClick={() => descartar(id)}
      >
        ×
      </button>
    </div>
  )
}

export function ToastRegion() {
  const toasts = useToastStore((state) => state.toasts)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div aria-live="polite" className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} tono={toast.tono} mensaje={toast.mensaje} />
      ))}
    </div>
  )
}