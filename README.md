# use and useEffect for data fetching

A small Next.js demo that loads the same mock catalog entry two ways, so you can see how React `use` and `useEffect` handle a slow request.

Both paths wait 2 seconds. There is no backend. `setTimeout` stands in for network latency.

## What the page shows

The home page has two cards and a comparison.

**Read a Promise with `use`.** The Promise is created outside the reader and cached by attempt. `use` reads it during render. While it is pending, the nearest `<Suspense>` boundary shows the loading panel. A rejection throws into an error boundary. Suspense does not catch errors, start the request, or cache the result.

**Fetch inside `useEffect`.** The effect starts after the component commits. Loading, success, and error are component state, and the component renders a branch for each one. Cleanup clears the timer when the component unmounts or a newer attempt starts.

`use` reads a Promise you already have. `useEffect` starts work after paint. They are not interchangeable.

Use **Fetch again** to repeat the wait, and **Simulate a failure** to compare the error boundary with the stored error state.

## Run it

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run lint
bun run build
bun start
```

## Where to look

| File                                   | Role                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| `src/pages/index.tsx`                  | Page layout and comparison                           |
| `src/components/use-fetch-demo.tsx`    | `use`, `<Suspense>`, and the error boundary          |
| `src/components/effect-fetch-demo.tsx` | `useEffect`, explicit state, and timer cleanup       |
| `src/lib/simulate-book.ts`             | Mock book, the 2 second delay, and the Promise cache |

The UI uses [Mantine](https://mantine.dev/). The app is the Next.js Pages Router with React 19.
