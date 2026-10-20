import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core"
import { Suspense, useState, useTransition } from "react"

import { NoteReader } from "@/components/use-fetch-demo"
import { delayLabel } from "@/lib/delay"
import { getNote, type Note } from "@/lib/note"

export function RefreshFallback() {
	return (
		<Stack gap="xs" aria-busy="true" aria-label="Loading note">
			<Group gap="sm">
				<Loader size="sm" />
				<Text fw={600}>Suspense fallback</Text>
			</Group>
			<Text size="sm" c="dimmed">
				The note is hidden while this Promise is pending ({delayLabel}).
			</Text>
		</Stack>
	)
}

export function RefreshNoteDemo() {
	const [attempt, setAttempt] = useState(1)
	const [notePromise, setNotePromise] = useState<Promise<Note>>(() =>
		getNote("refresh", 1, "success")
	)
	const [isPending, startTransition] = useTransition()

	function refreshNow() {
		const nextAttempt = attempt + 1
		setAttempt(nextAttempt)
		setNotePromise(getNote("refresh", nextAttempt, "success"))
	}

	function refreshInBackground() {
		const nextAttempt = attempt + 1
		const promise = getNote("refresh", nextAttempt, "success")
		startTransition(() => {
			setAttempt(nextAttempt)
			setNotePromise(promise)
		})
	}

	return (
		<Stack gap="md">
			<Text c="dimmed" size="sm">
				Both buttons store a new Promise from getNote. Refresh now updates
				immediately, so the fallback replaces the note. Refresh in the
				background runs inside startTransition, so the current note stays.
			</Text>
			<Group gap="xs">
				<Button type="button" onClick={refreshNow} disabled={isPending}>
					Refresh now
				</Button>
				<Button
					type="button"
					variant="light"
					onClick={refreshInBackground}
					disabled={isPending}
				>
					Refresh in the background
				</Button>
			</Group>
			{isPending ? (
				<Group gap="xs">
					<Loader size="xs" />
					<Text size="sm">The current note stays on screen.</Text>
				</Group>
			) : null}
			<Paper
				withBorder
				radius="lg"
				bg="white"
				p="md"
				mih={168}
				style={{ opacity: isPending ? 0.6 : 1 }}
			>
				{/* Keep this boundary mounted. A key that changes with the attempt
				    would remount it and show the fallback during a transition too. */}
				<Suspense fallback={<RefreshFallback />}>
					<NoteReader notePromise={notePromise} />
				</Suspense>
			</Paper>
		</Stack>
	)
}
