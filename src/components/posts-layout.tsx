import {
	Button,
	Group,
	NavLink,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	Title
} from "@mantine/core"
import { useState } from "react"

import type { Post } from "@/lib/posts"

export function PostsLayout({ posts }: Readonly<{ posts: Post[] }>) {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const selected = posts.find((post) => post.id === selectedId) ?? null

	return (
		<SimpleGrid
			cols={{ base: 1, sm: 2 }}
			spacing="lg"
			style={{ alignItems: "start" }}
		>
			<Paper withBorder radius="lg" bg="white" p={4}>
				<Group justify="space-between" px="sm" py="xs">
					<Text size="sm" fw={650}>
						Posts
					</Text>
					<Text size="xs" c="dimmed">
						{posts.length} posts
					</Text>
				</Group>
				<Stack gap={2} aria-label="Posts" pb={4}>
					{posts.map((post) => (
						<NavLink
							key={post.id}
							component="button"
							type="button"
							active={post.id === selectedId}
							label={post.title}
							leftSection={
								<Text size="xs" c="dimmed" w={16}>
									{post.id}
								</Text>
							}
							onClick={() => setSelectedId(post.id)}
							styles={{ label: { textTransform: "capitalize" } }}
						/>
					))}
				</Stack>
			</Paper>
			<Paper
				withBorder
				radius="lg"
				bg="white"
				p="lg"
				mih={320}
				style={{ position: "sticky", top: 76 }}
			>
				{selected ? (
					<Stack gap="md">
						<Stack gap={6}>
							<Text size="xs" c="dimmed" fw={650}>
								Post {selected.id}
							</Text>
							<Title order={2} size="h3" tt="capitalize">
								{selected.title}
							</Title>
							<Text lh={1.6}>{selected.body}</Text>
						</Stack>
						<Text size="sm" c="dimmed">
							User {selected.userId}
						</Text>
					</Stack>
				) : (
					<Stack align="center" justify="center" mih={260} gap={6}>
						<Text fw={650}>Select a post</Text>
						<Text size="sm" c="dimmed" ta="center" maw={280}>
							The list stays on the left. The post opens on this card.
						</Text>
					</Stack>
				)}
			</Paper>
		</SimpleGrid>
	)
}

export function PostsError({
	message,
	onRetry
}: Readonly<{ message: string; onRetry?: () => void }>) {
	if (!onRetry) return

	return (
		<Paper withBorder radius="lg" bg="white" p="lg" maw={480}>
			<Stack gap="sm">
				<Text c="red">{message}</Text>
				<Button type="button" onClick={onRetry}>
					Try again
				</Button>
			</Stack>
		</Paper>
	)
}
