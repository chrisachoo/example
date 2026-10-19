export const SIMULATED_DELAY_MS = 5000

export type Book = {
	title: string
	author: string
	published: number
	summary: string
}

export type FetchOutcome = "success" | "error"

export const sampleBook: Book = {
	title: "Northwind Field Notes",
	author: "Mina Cole",
	published: 2024,
	summary:
		"A short catalog entry used by both demos. The content is local mock data, held back by a timer so the loading UI stays visible."
}

export const simulatedErrorMessage =
	"The catalog request failed after the simulated delay."

// Promises are stored by attempt so render can read the same one again.
// use() suspends while its Promise is pending. A brand-new Promise on every
// render would stay pending, because each render would suspend on a Promise
// the previous render never got to finish.
const bookRequests = new Map<string, Promise<Book>>()

export function simulateBookFetch(outcome: FetchOutcome): Promise<Book> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (outcome === "error") {
				reject(new Error(simulatedErrorMessage))
				return
			}

			resolve(sampleBook)
		}, SIMULATED_DELAY_MS)
	})
}

export function getBookRequest(
	attempt: number,
	outcome: FetchOutcome
): Promise<Book> {
	const key = `${attempt}:${outcome}`
	const cached = bookRequests.get(key)
	if (cached) {
		return cached
	}

	const promise = simulateBookFetch(outcome)

	// use() surfaces this rejection through an error boundary. The catch
	// also marks it handled, so the simulated failure does not show up as
	// an unhandled rejection in the browser.
	if (outcome === "error") {
		promise.catch(() => undefined)
	}

	bookRequests.set(key, promise)
	return promise
}
