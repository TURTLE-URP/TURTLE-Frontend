import { useEffect, useState } from 'react'

/** Devuelve `value` tras `delay` ms sin cambios. Útil para búsquedas server-side. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
