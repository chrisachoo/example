import { useSyncExternalStore } from "react"

function subscribeToClient() {
	return () => {
		// The snapshot flips once, from the server value to the client value.
	}
}

function getClientSnapshot() {
	return true
}

function getServerSnapshot() {
	return false
}

// Pages are pre-rendered. Reading a pending Promise during that render would
// suspend on the server, so the use() demo waits for the browser snapshot and
// suspends there, where the Suspense fallback can be watched for the full delay.
export function useIsClient() {
	return useSyncExternalStore(
		subscribeToClient,
		getClientSnapshot,
		getServerSnapshot
	)
}
