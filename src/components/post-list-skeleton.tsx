import { Skeleton, Stack } from "@mantine/core"

export function PostListSkeleton() {
	return (
		<Stack gap="sm" aria-busy="true" aria-label="Loading posts">
			{["s1", "s2", "s3", "s4", "s5"].map((row) => (
				<Skeleton key={row} height={36} radius="sm" />
			))}
		</Stack>
	)
}
