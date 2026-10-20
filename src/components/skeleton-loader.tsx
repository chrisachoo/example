import { SimpleGrid, Skeleton, Stack } from "@mantine/core"

export function SkeletonLoader({ length = 10 }: Readonly<{ length?: number }>) {
	const rows = Array.from({ length }, (_, index) => `post-row-${index}`)

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
