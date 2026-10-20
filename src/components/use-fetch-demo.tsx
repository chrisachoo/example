import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { Suspense, use, useState } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { delayLabel } from "@/lib/delay"
import { getNote, type Note } from "@/lib/note"

export function NoteFallback() {
	return (
		<Stack gap="xs" aria-busy="true" aria-label="Loading note">
			<Group gap="sm">
				<Loader size="sm" />
				<Text fw={600}>Suspense fallback</Text>
			</Group>
			<Text size="sm" c="dimmed">
				The Promise is pending. This stays up for {delayLabel}.
			</Text>
		</Stack>
	)
}

export function NoteReader({
	notePromise
}: Readonly<{ notePromise: Promise<Note> }>) {
	// use reads this Promise during render. Pending suspends this component.
	// A rejection throws to the error boundary above Suspense.
	const note = use(notePromise)

	return (
		<Stack gap={4}>
			<Text fw={600}>{note.title}</Text>
			<Text size="sm" c="dimmed">
				{note.author}
			</Text>
			<Text size="sm">{note.summary}</Text>
		</Stack>
	)
}

export function UseNoteDemo() {
	const [renderCount, setRenderCount] = useState(0)
	const [attempt, setAttempt] = useState(1)
	const [notePromise, setNotePromise] = useState(() =>
		getNote("read", 1, "success")
	)

	function rerender() {
		setRenderCount((current) => current + 1)
	}

	function fail() {
		const nextAttempt = attempt + 1
		setAttempt(nextAttempt)
		setNotePromise(getNote("read", nextAttempt, "error"))
	}

	function retry() {
		const nextAttempt = attempt + 1
		setAttempt(nextAttempt)
		setNotePromise(getNote("read", nextAttempt, "success"))
	}

	return (
		<Stack gap="md" h="100%">
			<Text c="dimmed" size="sm">
				use reads the Promise during render. Re-render passes that same Promise
				again, so the fallback does not return.
			</Text>
			<Group gap="xs">
				<Button type="button" onClick={rerender}>
					Re-render
				</Button>
				<Button type="button" variant="light" color="red" onClick={fail}>
					Simulate a failure
				</Button>
			</Group>
			<Paper withBorder radius="lg" bg="white" p="md" mih={168}>
				<Text size="xs" c="dimmed" mb="sm">
					Re-renders from the button: {renderCount}
				</Text>
				{/* A new attempt remounts the boundary so a previous rejection does not stick. */}
				<ErrorBoundary
					key={attempt}
					fallback={(error) => (
						<Stack gap="sm">
							<Text c="red">{error.message}</Text>
							<Text size="sm" c="dimmed">
								The rejection threw into this error boundary. Suspense does not
								render errors.
							</Text>
							<Button type="button" onClick={retry}>
								Try again
							</Button>
						</Stack>
					)}
				>
					<Suspense fallback={<NoteFallback />}>
						<NoteReader notePromise={notePromise} />
					</Suspense>
				</ErrorBoundary>
			</Paper>
		</Stack>
	)
}
