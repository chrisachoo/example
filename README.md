# use and useEffect for data fetching

Two ways to load the same posts on the client.

**`use`.** A module cache returns one Promise for the posts URL. A child calls `use` with that Promise. While it is pending, the nearest `<Suspense>` boundary shows a skeleton. A rejection is caught by an error boundary. This path does not use `useEffect`.

**`useEffect`.** The effect fetches after the component commits, then stores the posts, the loading flag, and the error in state.

The request waits one second, the same pause the React docs add so the loading state stays visible. The list comes from JSONPlaceholder.

`/use` is the `use` example on its own. The home page shows both.

## Run it

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where to look

| File                                   | Role                              |
| -------------------------------------- | --------------------------------- |
| `src/pages/index.tsx`                  | Both examples                     |
| `src/pages/use.tsx`                    | The `use` example                 |
| `src/components/use-fetch-demo.tsx`    | `use` and `<Suspense>`            |
| `src/components/effect-fetch-demo.tsx` | `useEffect` and state             |
| `src/lib/posts.ts`                     | The request and the Promise cache |

The UI uses [Mantine](https://mantine.dev/). The app is the Next.js Pages Router with React 19.
