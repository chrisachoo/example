import {
	Anchor,
	Badge,
	Card,
	Container,
	SimpleGrid,
	Stack,
	Table,
	Text,
	Title
} from "@mantine/core"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"

import { EffectNoteDemo } from "@/components/effect-fetch-demo"
import { NoteFallback } from "@/components/use-fetch-demo"

const UseNoteDemo = dynamic(
	() => import("@/components/use-fetch-demo").then((mod) => mod.UseNoteDemo),
	{
		ssr: false,
		loading: () => <NoteFallback />
	}
)

const comparison = [
	{
		topic: "Who starts the work",
		useApi:
			"The click creates a Promise and stores it. use reads that Promise during render.",
		effect: "The click updates state. After commit, the effect starts a timer."
	},
	{
		topic: "Pending UI",
		useApi:
			"A pending Promise suspends the reader. This urgent update shows the Suspense fallback.",
		effect:
			"The component sets status to loading and renders the loader from that state."
	},
	{
		topic: "Success",
		useApi: "use returns the note. The reader renders it directly.",
		effect: "The timer stores the note, then the success branch renders it."
	},
	{
		topic: "Failure and retry",
		useApi:
			"A rejection throws into the error boundary. Retry stores a new Promise and remounts the boundary.",
		effect:
			"The timer stores an error message. Retry sets loading again, and cleanup clears the previous timer."
	}
]

export default function Home() {
	return (
		<>
			<Head>
				<title>use and useEffect</title>
			</Head>
			<Container component="main" size="lg" py="xl">
				<Stack gap="xl">
					<Stack gap="sm">
						<Title order={1}>use and useEffect</Title>
						<Text maw={760}>
							Both examples load the same local note after the same delay.
							Refetch repeats it. Simulate a failure, then try again.
						</Text>
						<Anchor component={Link} href="/use" w="fit-content">
							Posts, authors, and startTransition
						</Anchor>
					</Stack>
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
						<Card
							withBorder
							radius="md"
							padding="lg"
							component="section"
							aria-labelledby="use-demo-title"
							h="100%"
						>
							<Stack gap="md" h="100%">
								<Badge variant="outline" w="fit-content">
									React use
								</Badge>
								<Title id="use-demo-title" order={2} size="h3">
									Read a Promise with use
								</Title>
								<UseNoteDemo />
							</Stack>
						</Card>
						<Card
							withBorder
							radius="md"
							padding="lg"
							component="section"
							aria-labelledby="effect-demo-title"
							h="100%"
						>
							<Stack gap="md" h="100%">
								<Badge variant="outline" w="fit-content">
									useEffect
								</Badge>
								<Title id="effect-demo-title" order={2} size="h3">
									Fetch inside useEffect
								</Title>
								<EffectNoteDemo />
							</Stack>
						</Card>
					</SimpleGrid>
					<Stack gap="sm">
						<Title order={2} size="h3">
							What is different
						</Title>
						<Text c="dimmed" size="sm">
							use reads a Promise during render. useEffect starts work after
							commit. They are different tools. Suspense is the pending UI for a
							Promise. It does not cancel a timer.
						</Text>
						<Table.ScrollContainer minWidth={680}>
							<Table striped withTableBorder verticalSpacing="sm">
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Question</Table.Th>
										<Table.Th>use and Suspense</Table.Th>
										<Table.Th>useEffect</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{comparison.map((row) => (
										<Table.Tr key={row.topic}>
											<Table.Td fw={600}>{row.topic}</Table.Td>
											<Table.Td>{row.useApi}</Table.Td>
											<Table.Td>{row.effect}</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Table.ScrollContainer>
						<Text size="sm">
							Reach for use when a Promise already exists and a Suspense
							boundary should show the pending UI. Reach for useEffect when this
							component should start the request after it commits and clear that
							work on the next attempt.
						</Text>
					</Stack>
				</Stack>
			</Container>
		</>
	)
}
