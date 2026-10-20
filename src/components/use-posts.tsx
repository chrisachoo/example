import { Suspense, use, useState } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { PostsError, PostsLayout } from "@/components/posts-layout"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { fetchPosts, type Post } from "@/lib/posts"

function PostsReader({
	postsPromise
}: Readonly<{ postsPromise: Promise<Post[]> }>) {
	const posts = use(postsPromise)

	return <PostsLayout posts={posts} />
}

export function UsePosts() {
	const [postsPromise] = useState(fetchPosts())

	return (
		<ErrorBoundary fallback={(error) => <PostsError message={error.message} />}>
			<Suspense fallback={<SkeletonLoader />}>
				<PostsReader postsPromise={postsPromise} />
			</Suspense>
		</ErrorBoundary>
	)
}
