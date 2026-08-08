import { buildGreeting } from '../logic/build-greeting'

export interface GreetingCardProps {
  /** Name shown inside the greeting; empty or whitespace-only names produce a greeting without a name. */
  name: string
  /** Hour of the day (0-23) selecting the morning/afternoon/evening period; defaults to the current hour. */
  hour?: number
}

/**
 * Example component demonstrating the mandated pattern: an explicit props
 * interface with JSDoc, Tailwind styling, and business logic extracted into a
 * logic module covered by its own logic test.
 */
export function GreetingCard({ name, hour }: GreetingCardProps) {
  const greeting = buildGreeting(name, hour ?? new Date().getHours())
  return (
    <div
      role="status"
      className="inline-block rounded-xl border border-border bg-card px-6 py-4 shadow-sm"
    >
      <p className="text-lg font-medium text-card-foreground">{greeting}</p>
    </div>
  )
}
