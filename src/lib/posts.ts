import { DELAY_MS } from "@/lib/delay"

export type Outcome = "success" | "error"

export type Post = {
	id: string
	userId: string
	title: string
	body: string
}

export type User = {
	id: string
	name: string
	username: string
	email: string
	company: string
}

export const authorFailureMessage =
	"The author request failed after the simulated delay."

const mockUsers: User[] = [
	{
		id: "4e1d5f7e-c227-49eb-a062-c6fe8e56a99c",
		name: "Mina Cole",
		username: "mina",
		email: "mina@example.com",
		company: "Northwind"
	},
	{
		id: "b0e822f4-1a09-4f45-a2d1-db3934c4de6c",
		name: "Jonas Abebe",
		username: "jonas",
		email: "jonas@example.com",
		company: "Fieldnote"
	},
	{
		id: "b02d7706-a7dc-4d43-973d-89564b9fb69f",
		name: "Priya Shah",
		username: "priya",
		email: "priya@example.com",
		company: "Ledger & Co"
	}
]

const mockPosts: Post[] = [
	{
		id: "b11407de-d467-4de8-9ce1-21f8f9352528",
		userId: "4e1d5f7e-c227-49eb-a062-c6fe8e56a99c",
		title: "Field notes from the ridge",
		body: "The morning log missed the wind shift. The ridge markers were still readable."
	},
	{
		id: "561393a2-1ac2-46e6-a678-ebf2e2f0839c",
		userId: "4e1d5f7e-c227-49eb-a062-c6fe8e56a99c",
		title: "What the weather log missed",
		body: "Two readings were copied into the wrong column. The rest of the sheet holds."
	},
	{
		id: "112b8ce4-bc36-4d7d-87af-62e83e3d690b",
		userId: "b0e822f4-1a09-4f45-a2d1-db3934c4de6c",
		title: "A quieter inventory",
		body: "Three crates were labeled twice. The count matches once the duplicates are removed."
	},
	{
		id: "8fda54b0-2f6f-4164-bf7d-3df9ce0ec4a9",
		userId: "b0e822f4-1a09-4f45-a2d1-db3934c4de6c",
		title: "Labels that drifted",
		body: "The shelf labels no longer match the ledger. The items themselves were not moved."
	},
	{
		id: "07da08b6-593e-49bb-bd29-70fc26e15be2",
		userId: "b02d7706-a7dc-4d43-973d-89564b9fb69f",
		title: "Closing the day book",
		body: "The day book closes when the last note is signed. Nothing here waits on a server."
	},
	{
		id: "aebccc85-e7ad-4365-b09b-fc22fed660af",
		userId: "b02d7706-a7dc-4d43-973d-89564b9fb69f",
		title: "A margin left open",
		body: "Someone penciled a total beside the printed one. The pencil total is the one that matches the crates."
	},
	{
		id: "b70a67be-7251-4004-be0a-27b522640e75",
		userId: "4e1d5f7e-c227-49eb-a062-c6fe8e56a99c",
		title: "Wind on the second ridge",
		body: "The second ridge marker was face down. The first three were still standing when the log was closed."
	},
	{
		id: "f042940a-1af7-4c15-96c1-c79bf0fadf74",
		userId: "b0e822f4-1a09-4f45-a2d1-db3934c4de6c",
		title: "Crates that came back",
		body: "Four crates returned with the afternoon wagon. Their labels match the quieter inventory from the morning."
	},
	{
		id: "e00b61c3-48b9-42e9-99a7-7def70e30775",
		userId: "b02d7706-a7dc-4d43-973d-89564b9fb69f",
		title: "The unsigned line",
		body: "One line in the day book has no signature. The figures above it were already checked."
	},
	{
		id: "3616d853-a741-4073-8384-d57018f6b1e1",
		userId: "4e1d5f7e-c227-49eb-a062-c6fe8e56a99c",
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
	userId: string,
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

export const postsUrl = "https://jsonplaceholder.typicode.com/posts?_limit=10"

export const postsFailureMessage = "Failed to fetch posts."

// Shared by the use and useEffect readers so both waits look the same.
const postsDelayMs = 10_000

type RemotePost = {
	userId: number
	id: number
	title: string
	body: string
}

function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

export async function fetchPosts(): Promise<Post[]> {
	const request = fetch(postsUrl).then(async (response) => {
		if (!response.ok) {
			throw new Error(postsFailureMessage)
		}

		const posts = (await response.json()) as RemotePost[]
		return posts.map((post) => ({
			id: String(post.id),
			userId: String(post.userId),
			title: post.title,
			body: post.body
		}))
	})

	return Promise.all([request, wait(postsDelayMs)]).then(([posts]) => posts)
}
