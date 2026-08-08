import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Captures render failures anywhere below it and shows a user-safe fallback.
 * The DEV-only report hook is the reserved integration point for the
 * production monitoring SDK (tool selection deferred by consultation).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Render error captured by ErrorBoundary', error)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center"
        >
          <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please reload the page.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
