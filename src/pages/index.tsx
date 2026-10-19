import {
	Badge,
	Container,
	List,
	SimpleGrid,
	Stack,
	Table,
	Text,
	Title
} from "@mantine/core"
import Head from "next/head"

import { EffectFetchDemo } from "@/components/effect-fetch-demo"
import { UseFetchDemo } from "@/components/use-fetch-demo"
import { SIMULATED_DELAY_MS } from "@/lib/simulate-book"

const comparison = [
	{
		topic: "Who starts the request",
		useApi:
			"The demo creates a Promise and caches it by attempt. use only reads that Promise.",
		effect:
			"The effect starts the timer after the component has committed to the page."
	},
	{
		topic: "Loading UI",
		useApi:
			"A pending Promise suspends the reader. The Suspense fallback renders in its place.",
		effect:
			"The component stores status loading and renders a loader from that state."
	},
	{
		topic: "Success",
		useApi: "use returns the catalog entry and the reader renders it.",
		effect: "The effect stores the entry, then a success branch renders it."
	},
	{
		topic: "Failure",
		useApi:
			"The rejected Promise throws into an error boundary. Suspense does not catch it.",
		effect: "The effect stores an error message and an error branch renders it."
	},
	{
		topic: "Retry",
		useApi:
			"A new attempt id creates a new cached Promise. The error boundary remounts so an old rejection does not stick.",
		effect:
			"The click sets status back to loading. The effect cleanup cancels the previous timer and starts another."
	},
	{
		topic: "Leaving the page",
		useApi:
			"use has no cleanup argument. This reader never calls setState from the timer, so a late result does not update the page.",
		effect:
			"Cleanup clears the timer so it cannot call setState after the component is gone."
	}
]

const stillYours = [
	"Starting the request. use reads a Promise. It does not create one.",
	"Keeping that Promise stable. A new Promise on every render suspends again.",
	"Caching, deduplication, and retries. Suspense does not store the result.",
	"Rendering failures. A rejection needs an error boundary or other handling around the reader.",
	"Cancellation. If a late result should be ignored, the function that created the Promise has to support that."
]

const effectResponsibilities = [
	"Rendering a loading state yourself, because the component paints before the effect runs.",
	"Storing the result and the error yourself.",
	"Clearing timers and ignoring stale responses in the effect cleanup.",
	"Choosing the dependency list that decides when a new request starts."
]

export default function Home() {
	const delaySeconds = SIMULATED_DELAY_MS / 1000

	return (
		<>
			<Head>
				<title>use and useEffect for data fetching</title>
			</Head>
			<Container component="main" size="lg" py="xl">
				<Stack gap="xl">
					<Stack gap="sm">
						<Badge variant="light" w="fit-content">
							{delaySeconds} second simulated delay
						</Badge>
						<Title order={1}>use and useEffect for data fetching</Title>
						<Text maw={760}>
							Both demos load the same catalog entry from local mock data. A
							timer holds each response for {delaySeconds} seconds so the
							loading state is easy to see. Fetch again to repeat it, or
							simulate a failure to see how each path reports an error.
						</Text>
						<Text maw={760} c="dimmed">
							use is how a component reads a Promise during render. useEffect is
							how a component starts work after commit. Suspense is the loading
							UI for a pending Promise. It is not a data-fetching library, and
							it does not replace useEffect.
						</Text>
					</Stack>

					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
						<UseFetchDemo />
						<EffectFetchDemo />
					</SimpleGrid>

					<Stack gap="sm">
						<Title order={2} size="h3">
							Side by side
						</Title>
						<Text c="dimmed">
							The timer is the same. The difference is who starts the request,
							where the loading UI comes from, and who records errors.
						</Text>
						<Table.ScrollContainer minWidth={720}>
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
					</Stack>

					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
						<Stack gap="sm">
							<Title order={2} size="h3">
								What Suspense still leaves to you
							</Title>
							<Text size="sm" c="dimmed">
								A Suspense boundary renders its fallback while a child is
								waiting on a Promise. These parts stay outside that boundary.
							</Text>
							<List spacing="xs" size="sm">
								{stillYours.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
							</List>
						</Stack>
						<Stack gap="sm">
							<Title order={2} size="h3">
								What useEffect asks you to manage
							</Title>
							<Text size="sm" c="dimmed">
								The effect is explicit. Every phase of the request is a piece of
								state or a line in the cleanup function.
							</Text>
							<List spacing="xs" size="sm">
								{effectResponsibilities.map((item) => (
									<List.Item key={item}>{item}</List.Item>
								))}
							</List>
						</Stack>
					</SimpleGrid>

					<Stack gap="xs">
						<Title order={2} size="h3">
							When each one fits
						</Title>
						<Text>
							Use use with Suspense when a Promise already exists, from a
							parent, a cache, or a server render, and a boundary should decide
							what to show until it settles. The reader can describe the success
							UI directly.
						</Text>
						<Text>
							Use useEffect when this component should start the request because
							it mounted, and it needs to cancel that work or ignore a stale
							response. The loading and error UI live in the same component as
							the request.
						</Text>
						<Text c="dimmed">
							setTimeout is only the stand-in for network latency. Both demos
							wait {delaySeconds} seconds so you can compare the loading
							behavior on equal terms.
						</Text>
					</Stack>
				</Stack>
			</Container>
		</>
	)
}
