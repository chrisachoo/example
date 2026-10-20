import { useEffect, useState } from "react"

import { PostsError, PostsLayout } from "@/components/posts-layout"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { postsFailureMessage, type Post } from "@/lib/posts"

type Status = "loading" | "ready" | "error"

export function EffectPosts() {
	const [attempt, setAttempt] = useState(0)
	const [status, setStatus] = useState<Status>("loading")
	const [posts, setPosts] = useState<Post[]>([])
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to fetch posts")
					}

					return response.json() as Promise<Post[]>
				})
				.then((data) => setPosts(data))
				.catch((error: unknown) => {
					setErrorMessage(
						error instanceof Error ? error.message : postsFailureMessage
					)
					setStatus("error")
				})
				.finally(() => setStatus("ready"))
		}, 10000)

		return () => clearTimeout(timeout)
	}, [attempt])

	function retry() {
		setStatus("loading")
		setPosts([])
		setErrorMessage(null)
		setAttempt((current) => current + 1)
	}

	if (status === "loading") return <SkeletonLoader />

	if (status === "error" && errorMessage)
		return <PostsError message={errorMessage} onRetry={retry} />

	return <PostsLayout posts={posts} />
}
