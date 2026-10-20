import { Stack, Text, Title } from "@mantine/core"
import dynamic from "next/dynamic"
import Head from "next/head"

import { EffectPosts } from "@/components/effect-posts"
import { PageFrame } from "@/components/page-frame"
import { SkeletonLoader } from "@/components/skeleton-loader"

// Pages Router wiring. UsePosts reads a Promise during render, so the server
// skips that tree and the client shows the skeleton first.
const UsePosts = dynamic(
	() => import("@/components/use-posts").then((mod) => mod.UsePosts),
	{
		ssr: false,
		loading: () => <SkeletonLoader />
	}
)

export default function DemoPage() {
	return (
		<>
			<Head>
				<title>Same posts, two reads</title>
			</Head>
			<PageFrame>
				<Stack gap="xl">
					<Stack gap="xs" maw={720}>
						<Title order={1}>Same posts, two reads</Title>
						<Text>
							Both readers call fetchPosts, which requests the same
							JSONPlaceholder list. UsePosts reads that Promise with use.
							EffectPosts loads it after commit and stores the result.
						</Text>
						<Text c="dimmed" size="sm">
							Set postsReader to &quot;use&quot; or &quot;effect&quot;. The
							list, the wait, and the error stay in this layout.
						</Text>
					</Stack>

					{/* <EffectPosts /> */}
					<UsePosts />
				</Stack>
			</PageFrame>
		</>
	)
}
