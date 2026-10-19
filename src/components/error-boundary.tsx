import { Component, type ReactNode } from "react"

type ErrorBoundaryProps = {
	children: ReactNode
	fallback: (error: Error) => ReactNode
}

type ErrorBoundaryState = {
	error: Error | null
}

// Same class-component pattern Next.js documents for Pages Router errors,
// scoped to the reader so a rejected Promise does not replace the whole page.
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null }

	static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
		return {
			error: error instanceof Error ? error : new Error("Unknown render error")
		}
	}

	render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error)
		}

		return this.props.children
	}
}
