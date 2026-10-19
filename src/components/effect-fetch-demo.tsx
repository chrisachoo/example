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
import { useEffect, useState } from "react"

import { BookDetails, ErrorPanel, LoadingPanel } from "@/components/book-status"
import {
	SIMULATED_DELAY_MS,
	sampleBook,
	simulatedErrorMessage,
	type Book,
	type FetchOutcome
} from "@/lib/simulate-book"

type RequestStatus = "loading" | "success" | "error"

export function EffectFetchDemo() {
	const [attempt, setAttempt] = useState(1)
	const [outcome, setOutcome] = useState<FetchOutcome>("success")
	const [status, setStatus] = useState<RequestStatus>("loading")
	const [book, setBook] = useState<Book | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		let ignore = false

		// setTimeout stands in for a slow response. Cleanup clears it so a
		// finished timer cannot update state after unmount or after a newer
		// attempt starts. Strict Mode runs this cleanup once in development.
		const timeoutId = setTimeout(() => {
			if (ignore) {
				return
			}

			if (outcome === "error") {
				setBook(null)
				setErrorMessage(simulatedErrorMessage)
				setStatus("error")
				return
			}

			setBook(sampleBook)
			setErrorMessage(null)
			setStatus("success")
		}, SIMULATED_DELAY_MS)

		return () => {
			ignore = true
			clearTimeout(timeoutId)
		}
	}, [attempt, outcome])

	function run(nextOutcome: FetchOutcome) {
		setOutcome(nextOutcome)
		setAttempt((current) => current + 1)
		setStatus("loading")
		setBook(null)
		setErrorMessage(null)
	}

	let panel = (
		<LoadingPanel
			attempt={attempt}
			detail="status is loading. This component chose the indicator from its own state."
		/>
	)

	if (status === "success" && book) {
		panel = (
			<BookDetails
				attempt={attempt}
				book={book}
				detail="The effect stored the catalog entry with setBook, then this component rendered it."
			/>
		)
	}

	if (status === "error" && errorMessage) {
		panel = (
			<ErrorPanel
				attempt={attempt}
				message={errorMessage}
				detail="The effect stored the error in state. There is no Suspense boundary and no error boundary in this path."
			/>
		)
	}

	return (
		<Card
			withBorder
			radius="md"
			padding="lg"
			component="section"
			aria-labelledby="effect-demo-title"
			h="100%"
		>
			<Stack gap="md" h="100%">
				<div>
					<Badge variant="outline" mb="xs">
						useEffect
					</Badge>
					<Title id="effect-demo-title" order={2} size="h3">
						Fetch inside useEffect
					</Title>
					<Text c="dimmed" mt="xs">
						The effect starts after the component commits. Loading, success, and
						error are ordinary state, and the component renders a branch for
						each one.
					</Text>
				</div>

				<List spacing="xs" size="sm">
					<List.Item>
						The first paint is the loading branch. The effect has not run yet.
					</List.Item>
					<List.Item>
						The effect starts a 2 second timer, then stores the result or the
						error.
					</List.Item>
					<List.Item>
						Cleanup clears that timer when the component unmounts or the attempt
						changes.
					</List.Item>
				</List>

				<Code block>{`useEffect(() => {
  const timeoutId = setTimeout(finish, 2000)
  return () => clearTimeout(timeoutId)
}, [attempt])`}</Code>

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

				<div aria-live="polite">{panel}</div>
			</Stack>
		</Card>
	)
}
