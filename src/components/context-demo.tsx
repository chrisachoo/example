import { Button, Group, Paper, Stack, Text } from "@mantine/core"
import { createContext, use, useState } from "react"

const ThemeContext = createContext("light")

function ThemeLine({ show }: Readonly<{ show: boolean }>) {
	if (show) {
		const theme = use(ThemeContext)
		return (
			<Text>Theme is {theme}. use read the context because show is true.</Text>
		)
	}

	return <Text>show is false, so this render skipped use.</Text>
}

export function ContextDemo() {
	const [theme, setTheme] = useState("light")
	const [show, setShow] = useState(true)
	const dark = show && theme === "dark"

	return (
		<ThemeContext value={theme}>
			<Stack gap="md">
				<Text c="dimmed" size="sm">
					use reads context here, and the call sits inside an if. Hide the line
					and this render does not call use. Show it again and it reads the
					current theme.
				</Text>
				<Group gap="xs">
					<Button
						type="button"
						variant={theme === "light" ? "filled" : "light"}
						onClick={() => setTheme("light")}
					>
						Light
					</Button>
					<Button
						type="button"
						variant={theme === "dark" ? "filled" : "light"}
						onClick={() => setTheme("dark")}
					>
						Dark
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={() => setShow((current) => !current)}
					>
						{show ? "Hide the line" : "Show the line"}
					</Button>
				</Group>
				<Paper
					withBorder
					radius="lg"
					p="md"
					bg={dark ? "dark.8" : "white"}
					c={dark ? "gray.0" : undefined}
				>
					<ThemeLine show={show} />
				</Paper>
			</Stack>
		</ThemeContext>
	)
}
