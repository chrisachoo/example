import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { useEffect, useState } from "react"

import { delayLabel } from "@/lib/delay"
import { failureMessage, getNote, type Note, type Outcome } from "@/lib/note"

type Status = "loading" | "success" | "error"

export function EffectNoteDemo() {
	const [attempt, setAttempt] = useState(1)
	const [outcome, setOutcome] = useState<Outcome>("success")
	const [status, setStatus] = useState<Status>("loading")
	const [note, setNote] = useState<Note | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		let ignore = false

		// Same getNote as the use example. The effect reads it after commit.
		// Cleanup ignores a late result when this attempt is replaced.
		getNote("effect", attempt, outcome).then(
			(nextNote) => {
				if (ignore) {
					return
				}

				setNote(nextNote)
				setErrorMessage(null)
				setStatus("success")
			},
			(error: unknown) => {
				if (ignore) {
					return
				}

				setNote(null)
				setErrorMessage(error instanceof Error ? error.message : failureMessage)
				setStatus("error")
			}
		)

		return () => {
			ignore = true
		}
	}, [attempt, outcome])

	function run(nextOutcome: Outcome) {
		setOutcome(nextOutcome)
		setAttempt((current) => current + 1)
		setStatus("loading")
		setNote(null)
		setErrorMessage(null)
	}

	let content = (
		<Stack gap="xs" aria-busy="true" aria-label="Loading note">
			<Group gap="sm">
				<Loader size="sm" />
				<Text fw={600}>status is loading</Text>
			</Group>
			<Text size="sm" c="dimmed">
				This component chose the loader. The request waits {delayLabel}.
			</Text>
		</Stack>
	)

	if (status === "success" && note) {
		content = (
			<Stack gap={4}>
				<Text fw={600}>{note.title}</Text>
				<Text size="sm" c="dimmed">
					{note.author}
				</Text>
				<Text size="sm">{note.summary}</Text>
			</Stack>
		)
	}

	if (status === "error" && errorMessage) {
		content = (
			<Stack gap="sm">
				<Text c="red">{errorMessage}</Text>
				<Text size="sm" c="dimmed">
					The effect stored this message. There is no error boundary here.
				</Text>
				<Button type="button" onClick={() => run("success")}>
					Try again
				</Button>
			</Stack>
		)
	}

	return (
		<Stack gap="md" h="100%">
			<Text c="dimmed" size="sm">
				The effect calls getNote after commit. Loading, the note, and the error
				are state in this component.
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
			<Paper
				withBorder
				radius="lg"
				bg="white"
				p="md"
				mih={168}
				aria-live="polite"
			>
				{content}
			</Paper>
		</Stack>
	)
}
