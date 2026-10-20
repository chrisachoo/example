import { Anchor, Box, Container, Group, Text } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import type { ReactNode } from "react"

const links = [
	{ href: "/", label: "Examples" },
	{ href: "/use", label: "One box" }
]

export function SiteHeader() {
	const { pathname } = useRouter()

	return (
		<Box
			component="header"
			bg="white"
			py="sm"
			style={{
				position: "sticky",
				top: 0,
				zIndex: 20,
				borderBottom: "1px solid var(--mantine-color-gray-2)"
			}}
		>
			<Container size="lg">
				<Group justify="space-between">
					<Anchor component={Link} href="/" underline="never">
						<Text fw={700} c="indigo.7">
							use
						</Text>
					</Anchor>
					<Group gap="lg">
						{links.map((link) => {
							const active = pathname === link.href
							return (
								<Anchor
									key={link.href}
									component={Link}
									href={link.href}
									underline="never"
									size="sm"
									fw={600}
									c={active ? "indigo.7" : "dimmed"}
									style={{
										borderBottom: "2px solid",
										borderColor: active
											? "var(--mantine-color-indigo-6)"
											: "transparent"
									}}
								>
									{link.label}
								</Anchor>
							)
						})}
					</Group>
				</Group>
			</Container>
		</Box>
	)
}

export function PageFrame({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<Container component="main" size="lg" py="xl">
			{children}
		</Container>
	)
}
