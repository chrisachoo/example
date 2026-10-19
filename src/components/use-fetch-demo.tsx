import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { Suspense, use, useState } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { DELAY_MS } from "@/lib/delay"
import { getNote, type Note, type Outcome } from "@/lib/note"

const delaySeconds = DELAY_MS / 1000

export function NoteFallback() {
	return (
		<Stack gap="xs" aria-busy="true" aria-label="Loading note">
			<Group gap="sm">
				<Loader size="sm" />
				<Text fw={600}>Suspense fallback</Text>
			</Group>
			<Text size="sm" c="dimmed">
				The reader is suspended for {delaySeconds} seconds.
			</Text>
		</Stack>
	)
}

function NoteReader({ notePromise }: Readonly<{ notePromise: Promise<Note> }>) {
	// use() reads this Promise during render. Pending suspends this component.
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
	const [attempt, setAttempt] = useState(1)
	const [notePromise, setNotePromise] = useState(() => getNote(1, "success"))

	function run(outcome: Outcome) {
		const nextAttempt = attempt + 1
		// Create the Promise in the click, then store it. The reader only reads it.
		const nextPromise = getNote(nextAttempt, outcome)
		setAttempt(nextAttempt)
		setNotePromise(nextPromise)
	}

	return (
		<Stack gap="md" h="100%">
			<Text c="dimmed" size="sm">
				use reads a Promise during render. This update is urgent, so a pending
				Promise shows the Suspense fallback.
			</Text>
			<Group gap="xs">
				<Button type="button" onClick={() => run("success")}>
					Refetch
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
			<Paper withBorder radius="md" p="md" mih={150}>
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
							<Button type="button" onClick={() => run("success")}>
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
