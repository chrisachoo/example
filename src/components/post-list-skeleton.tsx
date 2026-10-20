import { SimpleGrid, Skeleton, Stack } from "@mantine/core"

const rows = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10"]

export function PostListSkeleton() {
	return (
		<SimpleGrid
			cols={{ base: 1, sm: 2 }}
			spacing="lg"
			aria-busy="true"
			aria-label="Loading posts"
		>
			<Stack gap="xs">
				{rows.map((row) => (
					<Skeleton key={row} height={40} radius="sm" />
				))}
			</Stack>
			<Skeleton height={280} radius="lg" />
		</SimpleGrid>
	)
}
