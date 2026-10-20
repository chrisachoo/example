import { Component, type ReactNode } from "react"

import { failureMessage } from "@/lib/note"
import { authorFailureMessage, postsFailureMessage } from "@/lib/posts"

// Demo wiring for the Pages Router overlay. It is not part of use.
// React logs a caught render error with console.error, and the overlay treats
// that log as a crash. The boundary below is the error UI. This filter hides
// only the failures these demos trigger on purpose.
if (typeof window !== "undefined") {
	const report = console.error.bind(console)
	console.error = (...args: unknown[]) => {
		const text = args
			.map((arg) => (arg instanceof Error ? arg.message : String(arg)))
			.join("\n")
		const expected =
			text.includes(failureMessage) ||
			text.includes(authorFailureMessage) ||
			text.includes(postsFailureMessage) ||
			text.includes("occurred in the <NoteReader> component") ||
			text.includes("occurred in the <Author> component") ||
			text.includes("occurred in the <PostsReader> component")
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
