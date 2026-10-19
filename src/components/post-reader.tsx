import {
	Button,
	Group,
	Loader,
	NavLink,
	Paper,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	Title
} from "@mantine/core"
import { Suspense, use, useState, useTransition } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { PostListSkeleton } from "@/components/post-list-skeleton"
import {
	getPosts,
	getUser,
	type Post,
	type User,
	type Outcome
} from "@/lib/posts"

type AuthorRequest = {
	userId: number
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
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [authorRequest, setAuthorRequest] = useState<AuthorRequest | null>(null)
	const [isPending, startTransition] = useTransition()

	const selected = posts.find((post) => post.id === selectedId) ?? null
	const authorForSelected =
		authorRequest?.userId === selected?.userId ? authorRequest : null

	function selectPost(id: number) {
		setSelectedId(id)
		setAuthorRequest(null)
	}

	function showAuthor(outcome: Outcome) {
		if (!selected) {
			return
		}

		const attempt =
			authorRequest?.userId === selected.userId ? authorRequest.attempt + 1 : 1
		// The Promise is created here. startTransition only marks the update.
		const promise = getUser(selected.userId, attempt, outcome)
		startTransition(() => {
			setAuthorRequest({
				userId: selected.userId,
				attempt,
				promise
			})
		})
	}

	let authorSection = (
		<Text size="sm" c="dimmed">
			The author loads in this section. The post above sits outside its Suspense
			boundary.
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
		<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
			<Stack gap={4} aria-label="Posts">
				{posts.map((post) => (
					<NavLink
						key={post.id}
						component="button"
						type="button"
						active={post.id === selectedId}
						label={post.title}
						onClick={() => selectPost(post.id)}
					/>
				))}
			</Stack>
			<Paper withBorder radius="md" p="md" mih={240}>
				{selected ? (
					<Stack gap="md">
						<Stack gap={4}>
							<Title order={2} size="h4">
								{selected.title}
							</Title>
							<Text>{selected.body}</Text>
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
									onClick={() => setAuthorRequest(null)}
								>
									Back to post
								</Button>
							) : null}
						</Group>
						{isPending ? (
							<Group gap="xs">
								<Loader size="xs" />
								<Text size="sm">
									Transition pending. The post above stays mounted.
								</Text>
							</Group>
						) : null}
						{authorSection}
					</Stack>
				) : (
					<Text c="dimmed">Select a post to read it.</Text>
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
