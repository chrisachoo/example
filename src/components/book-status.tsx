import { Badge, Group, Loader, Paper, Stack, Text } from "@mantine/core"

import type { Book } from "@/lib/simulate-book"
import { SIMULATED_DELAY_MS } from "@/lib/simulate-book"

const delaySeconds = SIMULATED_DELAY_MS / 1000

type StatusPanelProps = {
	attempt: number
	detail: string
}

export function LoadingPanel({ attempt, detail }: Readonly<StatusPanelProps>) {
	return (
		<Paper withBorder radius="md" p="md" mih={210}>
			<Stack gap="sm">
				<Group justify="space-between">
					<Badge variant="light" color="blue">
						Loading
					</Badge>
					<Text size="xs" c="dimmed">
						Attempt {attempt}
					</Text>
				</Group>
				<Group gap="sm">
					<Loader size="sm" />
					<Text fw={600}>Loading the catalog entry</Text>
				</Group>
				<Text size="sm">
					The timer waits {delaySeconds} seconds before the result arrives.
				</Text>
				<Text size="sm" c="dimmed">
					{detail}
				</Text>
			</Stack>
		</Paper>
	)
}

export function BookDetails({
	attempt,
	book,
	detail
}: StatusPanelProps & { book: Book }) {
	return (
		<Paper withBorder radius="md" p="md" mih={210}>
			<Stack gap="sm">
				<Group justify="space-between">
					<Badge variant="light" color="green">
						Loaded
					</Badge>
					<Text size="xs" c="dimmed">
						Attempt {attempt}
					</Text>
				</Group>
				<Stack gap={4}>
					<Text fw={600}>{book.title}</Text>
					<Text size="sm" c="dimmed">
						{book.author}, {book.published}
					</Text>
					<Text size="sm">{book.summary}</Text>
				</Stack>
				<Text size="sm" c="dimmed">
					{detail}
				</Text>
			</Stack>
		</Paper>
	)
}

export function ErrorPanel({
	attempt,
	detail,
	message
}: StatusPanelProps & { message: string }) {
	return (
		<Paper
			withBorder
			radius="md"
			p="md"
			mih={210}
			style={{ borderColor: "var(--mantine-color-red-6)" }}
		>
			<Stack gap="sm">
				<Group justify="space-between">
					<Badge variant="light" color="red">
						Failed
					</Badge>
					<Text size="xs" c="dimmed">
						Attempt {attempt}
					</Text>
				</Group>
				<Text fw={600}>The catalog request failed</Text>
				<Text size="sm">{message}</Text>
				<Text size="sm" c="dimmed">
					{detail}
				</Text>
			</Stack>
		</Paper>
	)
}
