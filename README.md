# use, compared with useEffect

A client demo of the React [`use`](https://react.dev/reference/react/use) API.

`use` reads a resource during render. In these examples the resource is a Promise or context. `use` does not start the request.

**Read a Promise.** `getNote` returns one cached Promise for a scope, attempt, and outcome. A child calls `use`. While the Promise is pending, the nearest Suspense boundary shows a fallback. A rejection is caught by an error boundary.

**Re-render.** A button updates a counter. The same Promise is passed to `use` again, so the fallback does not return.

**useEffect.** The effect calls the same `getNote` after commit, then stores the note, the loading status, and the error. Cleanup ignores a result from an attempt that was replaced.

**Refresh.** Refresh now stores a new Promise in an urgent update, so the fallback replaces the note. Refresh in the background stores it inside `startTransition`, so the current note stays until the next one is ready.

**Context.** `use` reads a theme context inside an `if`.

**Only this box waits.** `/use` loads posts, then loads an author inside a smaller Suspense boundary. The post sits outside that boundary, so it stays on screen.

The delay is one second, so the waiting state stays visible. The notes and posts are local. Nothing is fetched from a server.

## Run it

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where to look

| File                                   | Role                                        |
| -------------------------------------- | ------------------------------------------- |
| `src/pages/index.tsx`                  | The four examples                           |
| `src/pages/use.tsx`                    | The author box, a smaller Suspense boundary |
| `src/components/use-fetch-demo.tsx`    | `use`, Suspense, and re-render              |
| `src/components/effect-fetch-demo.tsx` | `useEffect` calling `getNote`               |
| `src/components/refresh-note-demo.tsx` | Urgent refresh and `startTransition`        |
| `src/components/context-demo.tsx`      | `use` with context                          |
| `src/components/post-reader.tsx`       | Posts, then the author box                  |
| `src/lib/note.ts`                      | The note Promise cache                      |
| `src/lib/posts.ts`                     | The posts and author Promise cache          |

The UI uses [Mantine](https://mantine.dev/). The app is the Next.js Pages Router with React 19.

`next/dynamic` with `ssr: false` on the Promise examples is Pages Router wiring so those trees render on the client. The `console.error` filter in the error boundary hides the dev overlay for the two failures the demos trigger on purpose. Neither is part of `use`.
