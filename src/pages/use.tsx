import { Anchor, Container, Stack, Text, Title } from "@mantine/core"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"

import { PostListSkeleton } from "@/components/post-list-skeleton"

const PostLesson = dynamic(
	() => import("@/components/post-reader").then((mod) => mod.PostLesson),
	{
		ssr: false,
		loading: () => <PostListSkeleton />
	}
)

export default function UsePage() {
	return (
		<>
			<Head>
				<title>Posts and startTransition</title>
			</Head>
			<Container component="main" size="lg" py="xl">
				<Stack gap="xl">
					<Stack gap="sm">
						<Anchor component={Link} href="/" w="fit-content">
							Back to the comparison
						</Anchor>
						<Title order={1}>Posts, then the author</Title>
						<Text maw={720}>
							The list is a Promise read with use. Open a post, then view its
							author. The click creates the user Promise. startTransition marks
							the state update that reveals it. startTransition does not fetch,
							and it does not by itself hide a Suspense fallback.
						</Text>
						<Text maw={720} c="dimmed">
							The pending line is isPending from useTransition. The post stays
							mounted because it sits outside the author boundary.
							startTransition does not decide that on its own. This update is a
							transition, so React keeps the current author section until the
							user Promise settles, instead of replacing the post.
						</Text>
					</Stack>
					<PostLesson />
				</Stack>
			</Container>
		</>
	)
}
