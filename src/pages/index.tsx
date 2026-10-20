import { CodeHighlight } from "@mantine/code-highlight"
import {
	Anchor,
	Badge,
	Card,
	SimpleGrid,
	Stack,
	Text,
	Title
} from "@mantine/core"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"

import { ContextDemo } from "@/components/context-demo"
import { EffectNoteDemo } from "@/components/effect-fetch-demo"
import { PageFrame } from "@/components/page-frame"
import { NoteFallback } from "@/components/use-fetch-demo"

// Pages Router wiring. These demos read a Promise during render, so the server
// skips them and the client shows the fallback first.
const UseNoteDemo = dynamic(
	() => import("@/components/use-fetch-demo").then((mod) => mod.UseNoteDemo),
	{
		ssr: false,
		loading: () => <NoteFallback />
	}
)

const RefreshNoteDemo = dynamic(
	() =>
		import("@/components/refresh-note-demo").then((mod) => mod.RefreshNoteDemo),
	{
		ssr: false,
		loading: () => <NoteFallback />
	}
)

const comparison = [
	{
		situation: "A Promise already exists, and Suspense should show the wait",
		choice:
			"use(promise), inside Suspense, with an error boundary around that tree"
	},
	{
		situation: "Refresh that Promise and keep the current screen",
		choice: "Store the next Promise in state inside startTransition"
	},
	{
		situation: "Read context inside an if or a loop",
		choice: "use(context)"
	},
	{
		situation: "Read context at the top of the component every time",
		choice: "useContext"
	},
	{
		situation: "Start work after commit, and ignore it on the next run",
		choice:
			"useEffect. This component stores loading, the result, and the error"
	}
]

const readSnippet = `function NoteReader({ notePromise }) {
  const note = use(notePromise)
  return <p>{note.title}</p>
}`

const effectSnippet = `useEffect(() => {
  let ignore = false
  getNote("effect", attempt, outcome).then(
    (note) => { if (!ignore) setNote(note) },
    (error) => { if (!ignore) setError(error) }
  )
  return () => { ignore = true }
}, [attempt, outcome])`

const refreshSnippet = `function refreshNow() {
  setNotePromise(getNote("refresh", next, "success"))
}

function refreshInBackground() {
  const promise = getNote("refresh", next, "success")
  startTransition(() => setNotePromise(promise))
}`

const contextSnippet = `function ThemeLine({ show }) {
  if (show) {
    const theme = use(ThemeContext)
    return <p>Theme is {theme}</p>
  }
  return <p>This render skipped use.</p>
}`

function LessonCode({
	label,
	code
}: Readonly<{ label: string; code: string }>) {
	return (
		<Stack gap={6}>
			<Text size="xs" fw={650} c="dimmed" tt="uppercase">
				{label}
			</Text>
			<CodeHighlight
				code={code}
				language="tsx"
				withLineNumbers
				withBorder
				radius="lg"
				codeColorScheme="light"
			/>
		</Stack>
	)
}

function StepBadge({ children }: Readonly<{ children: string }>) {
	return (
		<Badge variant="light" w="fit-content" style={{ overflow: "unset" }}>
			{children}
		</Badge>
	)
}

export default function Home() {
	return (
		<>
			<Head>
				<title>use reads a resource</title>
			</Head>
			<PageFrame>
				<Stack gap="xl">
					<Stack gap="xs" maw={720}>
						<Title order={1}>use reads a resource</Title>
						<Text>
							use reads a Promise or context while React renders. It does not
							start the request. The first three examples share one local note.
							The wait is one second, so you can see it.
						</Text>
					</Stack>
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
						<Card
							withBorder
							bg="white"
							radius="lg"
							padding="lg"
							component="section"
							aria-labelledby="use-demo-title"
							h="100%"
						>
							<Stack gap="md" h="100%">
								<StepBadge>1. Promise</StepBadge>
								<Title id="use-demo-title" order={2} size="h3">
									Read a Promise with use
								</Title>
								<UseNoteDemo />
								<LessonCode label="The read" code={readSnippet} />
							</Stack>
						</Card>
						<Card
							withBorder
							bg="white"
							radius="lg"
							padding="lg"
							component="section"
							aria-labelledby="effect-demo-title"
							h="100%"
						>
							<Stack gap="md" h="100%">
								<StepBadge>2. After commit</StepBadge>
								<Title id="effect-demo-title" order={2} size="h3">
									Call the same function in useEffect
								</Title>
								<EffectNoteDemo />
								<LessonCode label="The effect" code={effectSnippet} />
							</Stack>
						</Card>
					</SimpleGrid>
					<Card
						withBorder
						bg="white"
						radius="lg"
						padding="lg"
						component="section"
						aria-labelledby="refresh-demo-title"
					>
						<Stack gap="md">
							<StepBadge>3. Refresh</StepBadge>
							<Title id="refresh-demo-title" order={2} size="h3">
								Replace the note, or keep it
							</Title>
							<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
								<RefreshNoteDemo />
								<LessonCode label="The two updates" code={refreshSnippet} />
							</SimpleGrid>
						</Stack>
					</Card>
					<Card
						withBorder
						bg="white"
						radius="lg"
						padding="lg"
						component="section"
						aria-labelledby="context-demo-title"
					>
						<Stack gap="md">
							<StepBadge>4. Context</StepBadge>
							<Title id="context-demo-title" order={2} size="h3">
								Read context inside an if
							</Title>
							<SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
								<ContextDemo />
								<LessonCode label="The branch" code={contextSnippet} />
							</SimpleGrid>
						</Stack>
					</Card>
					<Card withBorder bg="white" radius="lg" padding={0}>
						<Stack gap={0}>
							<Stack gap={4} p="lg">
								<Title order={2} size="h3">
									When to use which
								</Title>
							</Stack>
							{comparison.map((row) => (
								<SimpleGrid
									key={row.situation}
									cols={{ base: 1, sm: 2 }}
									spacing="xs"
									px="lg"
									py="md"
									style={{
										borderTop: "1px solid var(--mantine-color-gray-2)"
									}}
								>
									<Text fw={600} size="sm">
										{row.situation}
									</Text>
									<Text size="sm">{row.choice}</Text>
								</SimpleGrid>
							))}
							<Stack
								gap="sm"
								p="lg"
								style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
							>
								<Text size="sm">
									use reads a Promise or context you already have. Suspense is
									the pending UI for that Promise, and an error boundary is the
									failure UI. useEffect runs after commit. The component then
									stores what came back and ignores a late result.
								</Text>
								<Text size="sm" c="dimmed">
									The Map inside getNote is the teaching cache from the React
									docs. In an app, the framework or a client cache usually owns
									that.
								</Text>
								<Anchor component={Link} href="/use" w="fit-content">
									Next: only one box waits
								</Anchor>
							</Stack>
						</Stack>
					</Card>
				</Stack>
			</PageFrame>
		</>
	)
}
