export type GreetingPeriod = 'morning' | 'afternoon' | 'evening'

const MAX_NAME_LENGTH = 50

export function buildGreeting(name: string, hour: number): string {
  const clampedHour = Math.min(23, Math.max(0, Math.floor(hour)))
  const cleanName = name.trim().slice(0, MAX_NAME_LENGTH)

  const period: GreetingPeriod =
    clampedHour < 12 ? 'morning' : clampedHour < 18 ? 'afternoon' : 'evening'
  const salutation =
    period === 'morning'
      ? 'Good morning'
      : period === 'afternoon'
        ? 'Good afternoon'
        : 'Good evening'

  return cleanName ? `${salutation}, ${cleanName}!` : `${salutation}!`
}
