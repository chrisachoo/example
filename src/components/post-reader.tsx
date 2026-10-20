import {
	Box,
	Button,
	Group,
	NavLink,
	Paper,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	Title
} from "@mantine/core"
import { Suspense, use, useState } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { PostListSkeleton } from "@/components/post-list-skeleton"
import {
	getPosts,
	getUser,
	type Outcome,
	type Post,
	type User
} from "@/lib/posts"

type AuthorRequest = {
	userId: string
	attempt: number
	promise: Promise<User>
}

function Author({ userPromise }: Readonly<{ userPromise: Promise<User> }>) {
	const user = use(userPromise)

	return (
		<Stack gap={2}>
			<Text fw={600}>{user.name}</Text>
			<Text size="sm" c="dimmed">
				@{user.username}
			</Text>
			<Text size="sm">{user.email}</Text>
			<Text size="sm">{user.company}</Text>
		</Stack>
	)
}

function AuthorFallback() {
	return (
		<Stack gap="xs" aria-busy="true" aria-label="Loading author">
			<Text size="sm" fw={600}>
				This box is waiting.
			</Text>
			<Skeleton height={14} width="45%" radius="sm" />
			<Skeleton height={12} width="70%" radius="sm" />
			<Skeleton height={12} width="55%" radius="sm" />
		</Stack>
	)
}

function PostBrowser({
	postsPromise
}: Readonly<{ postsPromise: Promise<Post[]> }>) {
	const posts = use(postsPromise)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [authorRequest, setAuthorRequest] = useState<AuthorRequest | null>(null)

	const selected = posts.find((post) => post.id === selectedId) ?? null
	const authorForSelected =
		authorRequest?.userId === selected?.userId ? authorRequest : null

	function selectPost(id: string) {
		setSelectedId(id)
		setAuthorRequest(null)
	}

	function showAuthor(outcome: Outcome) {
		if (!selected) {
			return
		}

		const attempt =
			authorRequest?.userId === selected.userId ? authorRequest.attempt + 1 : 1
		// The Promise is created in the click. The state update is immediate, so
		// the author box shows its fallback. The post is outside that boundary.
		const promise = getUser(selected.userId, attempt, outcome)
		setAuthorRequest({
			userId: selected.userId,
			attempt,
			promise
		})
	}

	let authorSection = (
		<Text size="sm" c="dimmed">
			View author loads a Promise in this box. The post above stays.
		</Text>
	)

	if (authorForSelected) {
		authorSection = (
			<ErrorBoundary
				key={`${authorForSelected.userId}:${authorForSelected.attempt}`}
				fallback={(error) => (
					<Stack gap="sm">
						<Text c="red">{error.message}</Text>
						<Button type="button" onClick={() => showAuthor("success")}>
							Try again
						</Button>
					</Stack>
				)}
			>
				<Suspense fallback={<AuthorFallback />}>
					<Author userPromise={authorForSelected.promise} />
				</Suspense>
			</ErrorBoundary>
		)
	}

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
							onClick={() => selectPost(post.id)}
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
							<Title order={2} size="h3">
								{selected.title}
							</Title>
							<Text lh={1.6}>{selected.body}</Text>
						</Stack>
						<Group gap="xs">
							<Button type="button" onClick={() => showAuthor("success")}>
								View author
							</Button>
							<Button
								type="button"
								variant="light"
								color="red"
								onClick={() => showAuthor("error")}
							>
								Fail author
							</Button>
							{authorForSelected ? (
								<Button
									type="button"
									variant="subtle"
									color="gray"
									onClick={() => setAuthorRequest(null)}
								>
									Back to post
								</Button>
							) : null}
						</Group>
						<Box
							p="md"
							bg="white"
							style={{
								borderRadius: "var(--mantine-radius-lg)",
								border: "1px solid var(--mantine-color-indigo-3)"
							}}
						>
							<Stack gap="xs">
								<Text fw={650} size="sm" c="indigo.8">
									Author box
								</Text>
								{authorSection}
							</Stack>
						</Box>
					</Stack>
				) : (
					<Stack align="center" justify="center" mih={260} gap={6}>
						<Text fw={650}>Select a post</Text>
						<Text size="sm" c="dimmed" ta="center" maw={280}>
							The list stays on the left. The author loads only inside the box
							on this card.
						</Text>
					</Stack>
				)}
			</Paper>
		</SimpleGrid>
	)
}

export function PostLesson() {
	const [postsPromise] = useState(() => getPosts())

	return (
		<ErrorBoundary fallback={(error) => <Text c="red">{error.message}</Text>}>
			<Suspense fallback={<PostListSkeleton />}>
				<PostBrowser postsPromise={postsPromise} />
			</Suspense>
		</ErrorBoundary>
	)
}
