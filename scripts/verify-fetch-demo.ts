import { Window } from "/tmp/verify-use-demo/node_modules/happy-dom/lib/index.js"
import { MantineProvider } from "@mantine/core"
import { act, createElement, StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"

import { EffectFetchDemo } from "@/components/effect-fetch-demo"
import { UseFetchDemo } from "@/components/use-fetch-demo"

const dom = new Window({ url: "http://localhost:3000/" })
const browserGlobals = {
	window: dom,
	document: dom.document,
	navigator: dom.navigator,
	HTMLElement: dom.HTMLElement,
	Element: dom.Element,
	Node: dom.Node,
	SVGElement: dom.SVGElement,
	DocumentFragment: dom.DocumentFragment,
	MutationObserver: dom.MutationObserver,
	getComputedStyle: dom.getComputedStyle.bind(dom),
	requestAnimationFrame: dom.requestAnimationFrame.bind(dom),
	cancelAnimationFrame: dom.cancelAnimationFrame.bind(dom),
	matchMedia: dom.matchMedia.bind(dom),
	ResizeObserver: dom.ResizeObserver,
	self: dom
}

for (const [key, value] of Object.entries(browserGlobals)) {
	Object.defineProperty(globalThis, key, {
		value,
		configurable: true,
		writable: true
	})
}

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function text() {
	return dom.document.body.innerText
}

function clickButton(label: string, index: number) {
	const buttons = [...dom.document.querySelectorAll("button")].filter(
		(button) => button.textContent?.trim() === label
	)
	const button = buttons[index]
	if (!button) {
		throw new Error(`Missing button "${label}" at index ${index}`)
	}
	button.dispatchEvent(new dom.MouseEvent("click", { bubbles: true }))
}

function assertIncludes(haystack: string, needle: string, step: string) {
	if (!haystack.includes(needle)) {
		throw new Error(`${step}: expected to find "${needle}"\n---\n${haystack}`)
	}
}

async function settle(ms: number) {
	await act(async () => {
		await new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	})
}

const container = dom.document.createElement("div")
dom.document.body.appendChild(container)

const root: Root = createRoot(container)

await act(async () => {
	root.render(
		createElement(
			StrictMode,
			null,
			createElement(
				MantineProvider,
				null,
				createElement(UseFetchDemo),
				createElement(EffectFetchDemo)
			)
		)
	)
})

const initial = text()
assertIncludes(
	initial,
	"Loading the catalog entry",
	"initial use/effect render"
)
console.log("initial loading: ok")

await settle(2600)

const loaded = text()
assertIncludes(loaded, "Northwind Field Notes", "after delay")
const loadedCount = loaded.split("Northwind Field Notes").length - 1
if (loadedCount < 2) {
	throw new Error(
		`expected both demos to load, found ${loadedCount}\n${loaded}`
	)
}
console.log("both demos loaded: ok")

await act(async () => {
	clickButton("Simulate a failure", 0)
	clickButton("Simulate a failure", 1)
})

const retrying = text()
assertIncludes(
	retrying,
	"Loading the catalog entry",
	"retry after failure click"
)
assertIncludes(retrying, "Attempt 2", "attempt incremented")
console.log("failure retry shows loading: ok")

await settle(2600)

const failed = text()
assertIncludes(failed, "The catalog request failed", "use error boundary")
assertIncludes(
	failed,
	"use() threw the rejection",
	"use error explains the boundary"
)
assertIncludes(
	failed,
	"The effect stored the error in state",
	"effect error explains local state"
)
console.log("both error states: ok")

await act(async () => {
	clickButton("Fetch again", 0)
	clickButton("Fetch again", 1)
})

const refetching = text()
assertIncludes(refetching, "Loading the catalog entry", "refetch loading")
assertIncludes(refetching, "Attempt 3", "third attempt")
console.log("refetch loading: ok")

await settle(2600)

const recovered = text()
assertIncludes(recovered, "Northwind Field Notes", "recovered data")
assertIncludes(
	recovered,
	"use() returned the catalog entry",
	"use success explanation"
)
assertIncludes(recovered, "setBook", "effect success explanation")
console.log("both demos recovered: ok")

const lateUpdates: string[] = []
const originalError = console.error
console.error = (...args: unknown[]) => {
	lateUpdates.push(args.map(String).join(" "))
	originalError(...args)
}

await act(async () => {
	clickButton("Fetch again", 0)
	clickButton("Fetch again", 1)
	root.unmount()
})

await new Promise((resolve) => {
	setTimeout(resolve, 2600)
})

console.error = originalError

const unexpected = lateUpdates.filter(
	(entry) => !entry.includes("catalog request failed")
)
if (unexpected.length > 0) {
	throw new Error(`state update after unmount:\n${unexpected.join("\n")}`)
}

console.log("unmounted during loading without a late state update: ok")
