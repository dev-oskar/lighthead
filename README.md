# LightHead

A private journal for cannabis use: log sessions, keep a strain library, plan tolerance breaks and see simple statistics. It is an offline-first PWA and everything stays on the device — no accounts, no analytics, no requests to other sites.

## Run it

Needs Node 22+.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in build/
npm run preview    # serve the build (with the service worker) on :4173
```

## Check it

```sh
npm run check            # svelte-check (types)
npx vitest run           # unit tests for src/lib/model.ts and i18n
npx playwright install chromium   # once
npx playwright test      # end-to-end, builds and serves the app itself
```

The end-to-end suite includes an offline test that asserts the app never contacts another origin and keeps working with the server unreachable.

## Stack

- Svelte 5 (runes) + SvelteKit 3, `adapter-static`, client-only SPA (`ssr = false`)
- IndexedDB through [`idb`](https://github.com/jakearchibald/idb)
- SvelteKit's built-in service worker (`src/service-worker.ts`) precaches the whole app
- No UI framework or chart library: components are a Svelte port of the LightHead design system, charts are inline SVG

## Layout

| Path | What |
| --- | --- |
| `src/lib/ds/` | Design-system components (Svelte port, same class names as the original) |
| `src/lib/styles/` | `tokens.css` (colours, type, spacing), `components.css` (design-system CSS, verbatim), `app.css` (app shell, desktop layout) |
| `src/lib/model.ts` | Types and pure logic (derived THC, snapshots, stash, periods, breaks) — unit-tested |
| `src/lib/db.ts` | IndexedDB access, backup export/import |
| `src/lib/i18n.svelte.ts`, `src/lib/messages/` | en/de/pl; every `messages/*.ts` is merged automatically |
| `src/routes/` | Screens: Today, Journal (`log`), quick log (`log/new`), Strains, Stats, Break, Settings |
| `design/` | Reference copies of the design system and screen mockups (from the Claude design artifacts) |
| `e2e/` | Playwright tests |

## Deploy

Live at https://lighthead.thematrixadmin.workers.dev. Cloudflare Workers serves `build/` as static assets (`wrangler.jsonc`: SPA fallback). Every push to `master` deploys. Headers (no-cache service worker, strict Content-Security-Policy) are in `static/_headers`.

Updates: a new version waits until the person taps Reload on the in-app notice (or the app restarts); Settings shows the build time as the version.

## Licences

Fonts (Atkinson Hyperlegible Next/Mono, Bricolage Grotesque) are under the SIL Open Font License 1.1, shipped in `static/licenses/fonts-OFL.txt`.
