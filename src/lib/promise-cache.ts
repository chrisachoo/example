// The use docs keep a Promise in a module Map so a later render receives the
// same instance. Pages Router does not cache these Promises, so this demo does.
// A framework that supports Suspense usually owns this instead.
const cache = new Map<string, Promise<unknown>>()

export function cachePromise<T>(
	key: string,
	load: () => Promise<T>
): Promise<T> {
	if (!cache.has(key)) {
		const promise = load()
		// A rejection stays on this Promise for use(). This marks it handled.
		promise.catch(() => undefined)
		cache.set(key, promise)
	}

	return cache.get(key) as Promise<T>
}

// A rejected Promise stays rejected. A retry deletes it, then starts a new one.
export function refetchPromise<T>(
	key: string,
	load: () => Promise<T>
): Promise<T> {
	cache.delete(key)
	return cachePromise(key, load)
}
