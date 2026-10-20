import { Stack, Text, Title } from "@mantine/core"
import dynamic from "next/dynamic"
import Head from "next/head"

import { PageFrame } from "@/components/page-frame"
import { PostListSkeleton } from "@/components/post-list-skeleton"

// Pages Router wiring. The lesson reads a Promise during render, so the server
// skips this tree and the client shows the skeleton first.
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
				<title>Only this box waits</title>
			</Head>
			<PageFrame>
				<Stack gap="xl">
					<Stack gap="xs" maw={720}>
						<Title order={1}>Only this box waits</Title>
						<Text>
							Open a post, then view its author. The list has ten posts. The
							author is a second Promise, read with use inside the author box.
							The post stays because it sits outside that box.
						</Text>
						<Text c="dimmed" size="sm">
							Fail author rejects the Promise. The error stays in the box. The
							list and the post stay mounted.
						</Text>
					</Stack>
					<PostLesson />
				</Stack>
			</PageFrame>
		</>
	)
}
