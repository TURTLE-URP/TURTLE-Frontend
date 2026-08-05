import { createFileRoute } from '@tanstack/react-router'
import { GreetingCard } from '../features/greeting/components/greeting-card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title" className="text-2xl font-bold text-zinc-900">
        Welcome to the scaffold
      </h1>
      <p className="mt-2 text-zinc-600">
        This minimal shell demonstrates routing, the layout, an error boundary, and the example
        component.
      </p>
      <div className="mt-6">
        <GreetingCard name="Developer" hour={9} />
      </div>
    </section>
  )
}
