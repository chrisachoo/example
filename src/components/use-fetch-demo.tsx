import {
	Badge,
	Button,
	Card,
	Code,
	Group,
	List,
	Stack,
	Text,
	Title
} from "@mantine/core"
import { Suspense, use, useEffect, useState } from "react"

import { BookDetails, ErrorPanel, LoadingPanel } from "@/components/book-status"
import { ErrorBoundary } from "@/components/error-boundary"
import {
	getBookRequest,
	simulatedErrorMessage,
	type FetchOutcome
} from "@/lib/simulate-book"
import { useIsClient } from "@/lib/use-is-client"

// React logs a caught render error with console.error. The Pages Router dev
// overlay treats that log as an unhandled crash. This rejection is the demo's
// failure path, so the card's error boundary is the UI for it.
function withoutSimulatedErrorOverlay(report: typeof console.error) {
	return (...args: unknown[]) => {
		const simulated = args.some(
			(arg) => arg instanceof Error && arg.message === simulatedErrorMessage
		)
		if (simulated) {
			return
		}
		report(...args)
	}
}

const suspenseDetail =
	"Suspense is showing this fallback while the Promise is pending. The reader is not rendering yet."

function BookReader({
	attempt,
	outcome
}: Readonly<{
	attempt: number
	outcome: FetchOutcome
}>) {
	// use() reads the Promise during render. A pending Promise suspends this
	// component. A rejection throws to the error boundary above Suspense.
	const book = use(getBookRequest(attempt, outcome))

	return (
		<BookDetails
			attempt={attempt}
			book={book}
			detail="use() returned the catalog entry, and this component rendered it."
		/>
	)
}

export function UseFetchDemo() {
	const isClient = useIsClient()
	const [attempt, setAttempt] = useState(1)
	const [outcome, setOutcome] = useState<FetchOutcome>("success")

	useEffect(() => {
		const report = console.error
		console.error = withoutSimulatedErrorOverlay(report) as typeof console.error
		return () => {
			console.error = report
		}
	}, [])

	function run(nextOutcome: FetchOutcome) {
		const nextAttempt = attempt + 1
		// Create the Promise in the click handler. Later renders reuse it
		// from the module cache instead of starting another 2 second wait.
		getBookRequest(nextAttempt, nextOutcome)
		setAttempt(nextAttempt)
		setOutcome(nextOutcome)
	}

	return (
		<Card
			withBorder
			radius="md"
			padding="lg"
			component="section"
			aria-labelledby="use-demo-title"
			h="100%"
		>
			<Stack gap="md" h="100%">
				<div>
					<Badge variant="outline" mb="xs">
						React use
					</Badge>
					<Title id="use-demo-title" order={2} size="h3">
						Read a Promise with use
					</Title>
					<Text c="dimmed" mt="xs">
						The reader receives a Promise that already exists. use integrates
						with Suspense for the pending state, and with an error boundary for
						a rejection.
					</Text>
				</div>

				<List spacing="xs" size="sm">
					<List.Item>
						<Code>use</Code> reads the Promise during render. It does not start
						the request.
					</List.Item>
					<List.Item>
						While the Promise is pending, the nearest Suspense boundary shows
						its fallback.
					</List.Item>
					<List.Item>
						A rejected Promise throws. Suspense leaves that to the error
						boundary.
					</List.Item>
				</List>

				<Code block>{`const book = use(bookPromise)`}</Code>

				<Group grow>
					<Button type="button" onClick={() => run("success")}>
						Fetch again
					</Button>
					<Button
						type="button"
						variant="light"
						color="red"
						onClick={() => run("error")}
					>
						Simulate a failure
					</Button>
				</Group>

				<div aria-live="polite">
					{isClient ? (
						// A new attempt remounts the boundary. It keeps showing the
						// last rejection until it remounts, even if its children change.
						<ErrorBoundary
							key={`${attempt}:${outcome}`}
							fallback={(error) => (
								<ErrorPanel
									attempt={attempt}
									message={error.message}
									detail="use() threw the rejection. This error boundary caught it. Suspense does not render errors."
								/>
							)}
						>
							<Suspense
								fallback={
									<LoadingPanel attempt={attempt} detail={suspenseDetail} />
								}
							>
								<BookReader attempt={attempt} outcome={outcome} />
							</Suspense>
						</ErrorBoundary>
					) : (
						<LoadingPanel
							attempt={attempt}
							detail="The reader mounts in the browser. Suspense then keeps this panel up while the Promise is pending."
						/>
					)}
				</div>
			</Stack>
		</Card>
	)
}
