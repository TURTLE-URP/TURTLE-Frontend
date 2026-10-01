const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  hour: '2-digit',
  minute: '2-digit',
})

/** Formats an ISO date-time string as "14 ago 2026". */
export function formatMovementDate(isoDateTime: string): string {
  return DATE_FORMATTER.format(new Date(isoDateTime))
}

/** Formats an ISO date-time string as an "HH:mm" time, e.g. "09:15". */
export function formatMovementTime(isoDateTime: string): string {
  return TIME_FORMATTER.format(new Date(isoDateTime))
}
