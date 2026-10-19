import { DELAY_MS } from "@/lib/delay"

export type Outcome = "success" | "error"

export type Note = {
	title: string
	author: string
	summary: string
}

export const sampleNote: Note = {
	title: "Northwind Field Notes",
	author: "Mina Cole",
	summary:
		"A local note used by both demos. The delay is a timer, not a server."
}

export const failureMessage = "The request failed after the simulated delay."

// One Promise per attempt. A new Promise on every render would suspend forever,
// because React retries a suspended render from scratch.
const notes = new Map<string, Promise<Note>>()

export function getNote(attempt: number, outcome: Outcome): Promise<Note> {
	const key = `${attempt}:${outcome}`
	const cached = notes.get(key)
	if (cached) {
		return cached
	}

	const promise = new Promise<Note>((resolve, reject) => {
		setTimeout(() => {
			if (outcome === "error") {
				reject(new Error(failureMessage))
				return
			}

			resolve(sampleNote)
		}, DELAY_MS)
	})

	// use() reports the rejection through an error boundary. This also marks
	// the simulated failure as handled, so it is not an unhandled rejection.
	promise.catch(() => undefined)
	notes.set(key, promise)
	return promise
}
