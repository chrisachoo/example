import { DELAY_MS } from "@/lib/delay"

export type Outcome = "success" | "error"

export type Post = {
	id: number
	userId: number
	title: string
	body: string
}

export type User = {
	id: number
	name: string
	username: string
	email: string
	company: string
}

export const authorFailureMessage =
	"The author request failed after the simulated delay."

const mockUsers: User[] = [
	{
		id: 1,
		name: "Mina Cole",
		username: "mina",
		email: "mina@example.com",
		company: "Northwind"
	},
	{
		id: 2,
		name: "Jonas Abebe",
		username: "jonas",
		email: "jonas@example.com",
		company: "Fieldnote"
	},
	{
		id: 3,
		name: "Priya Shah",
		username: "priya",
		email: "priya@example.com",
		company: "Ledger & Co"
	}
]

const mockPosts: Post[] = [
	{
		id: 1,
		userId: 1,
		title: "Field notes from the ridge",
		body: "The morning log missed the wind shift. The ridge markers were still readable."
	},
	{
		id: 2,
		userId: 1,
		title: "What the weather log missed",
		body: "Two readings were copied into the wrong column. The rest of the sheet holds."
	},
	{
		id: 3,
		userId: 2,
		title: "A quieter inventory",
		body: "Three crates were labeled twice. The count matches once the duplicates are removed."
	},
	{
		id: 4,
		userId: 2,
		title: "Labels that drifted",
		body: "The shelf labels no longer match the ledger. The items themselves were not moved."
	},
	{
		id: 5,
		userId: 3,
		title: "Closing the day book",
		body: "The day book closes when the last note is signed. Nothing here waits on a server."
	},
	{
		id: 6,
		userId: 3,
		title: "A margin left open",
		body: "Someone penciled a total beside the printed one. The pencil total is the one that matches the crates."
	},
	{
		id: 7,
		userId: 1,
		title: "Wind on the second ridge",
		body: "The second ridge marker was face down. The first three were still standing when the log was closed."
	},
	{
		id: 8,
		userId: 2,
		title: "Crates that came back",
		body: "Four crates returned with the afternoon wagon. Their labels match the quieter inventory from the morning."
	},
	{
		id: 9,
		userId: 3,
		title: "The unsigned line",
		body: "One line in the day book has no signature. The figures above it were already checked."
	},
	{
		id: 10,
		userId: 1,
		title: "Markers after the rain",
		body: "Rain softened the chalk on two markers. The carved numbers underneath were still readable."
	}
]

let postsPromise: Promise<Post[]> | null = null

// The list Promise is created once. Later renders read this same Promise.
export function getPosts(): Promise<Post[]> {
	postsPromise ??= new Promise((resolve) => {
		setTimeout(() => resolve(mockPosts), DELAY_MS)
	})
	return postsPromise
}

// The key includes the attempt. A rejected Promise stays rejected, so a retry
// has to be a new Promise rather than the one that already failed.
const usersByKey = new Map<string, Promise<User>>()

export function getUser(
	userId: number,
	attempt: number,
	outcome: Outcome
): Promise<User> {
	const key = `${userId}:${attempt}:${outcome}`
	const cached = usersByKey.get(key)
	if (cached) {
		return cached
	}

	const promise = new Promise<User>((resolve, reject) => {
		setTimeout(() => {
			if (outcome === "error") {
				reject(new Error(authorFailureMessage))
				return
			}

			const user = mockUsers.find((item) => item.id === userId)
			if (!user) {
				reject(new Error(authorFailureMessage))
				return
			}

			resolve(user)
		}, DELAY_MS)
	})

	promise.catch(() => undefined)
	usersByKey.set(key, promise)
	return promise
}
