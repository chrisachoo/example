// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { CodeHighlightAdapterProvider } from "@mantine/code-highlight"
import { Box, createTheme, MantineProvider } from "@mantine/core"
import type { AppProps } from "next/app"

import { SiteHeader } from "@/components/page-frame"

import "@/styles/globals.css"
import "@mantine/code-highlight/styles.css"
import "@mantine/core/styles.css"
import { shikiAdapter } from "@/lib/shiki-adapter"

const theme = createTheme({
	primaryColor: "indigo",
	defaultRadius: "lg",
	fontFamily: "ui-sans-serif, system-ui, sans-serif",
	headings: {
		fontFamily: "ui-sans-serif, system-ui, sans-serif",
		fontWeight: "650"
	},
	components: {
		Card: {
			defaultProps: {
				withBorder: true,
				shadow: "none",
				radius: "lg",
				bg: "white"
			},
			styles: {
				root: {
					borderColor: "var(--mantine-color-gray-2)"
				}
			}
		},
		Paper: {
			defaultProps: {
				shadow: "none",
				radius: "lg"
			},
			styles: {
				root: {
					borderColor: "var(--mantine-color-gray-2)"
				}
			}
		}
	}
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider theme={theme}>
			<CodeHighlightAdapterProvider adapter={shikiAdapter}>
				<Box mih="100vh" bg="#f5f6fa">
					<SiteHeader />
					<Component {...pageProps} />
				</Box>
			</CodeHighlightAdapterProvider>
		</MantineProvider>
	)
}
