import { createShikiAdapter } from "@mantine/code-highlight"

async function loadShiki() {
	const { createHighlighter } = await import("shiki")
	return createHighlighter({
		langs: ["tsx"],
		themes: []
	})
}

// Mantine's adapter uses its GitHub light theme when the color scheme is light.
export const shikiAdapter = createShikiAdapter(loadShiki)
