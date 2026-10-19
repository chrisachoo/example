import { Component, type ReactNode } from "react"

import { failureMessage } from "@/lib/note"
import { authorFailureMessage } from "@/lib/posts"

// React logs a caught render error with console.error. The Pages Router dev
// overlay treats that log as an unhandled crash and covers the page. These two
// rejections are the demo's failure path, so the error boundary is the UI.
if (typeof window !== "undefined") {
	const report = console.error.bind(console)
	console.error = (...args: unknown[]) => {
		const text = args
			.map((arg) => (arg instanceof Error ? arg.message : String(arg)))
			.join("\n")
		const expected =
			text.includes(failureMessage) ||
			text.includes(authorFailureMessage) ||
			text.includes("occurred in the <NoteReader> component") ||
			text.includes("occurred in the <Author> component")
		if (expected) {
			return
		}
		report(...args)
	}
}

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
