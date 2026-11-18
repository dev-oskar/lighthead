# LightHead

A private journal for cannabis use: log sessions, keep a strain library, plan tolerance breaks and see simple statistics. It is an offline-first PWA and everything stays on the device — no accounts, no analytics, no requests to other sites.

## Privacy

- Your journal lives in your browser's storage on this device. There are no accounts and no database on a server.
- LightHead sends nothing anywhere: no analytics, no ads, no crash reports, no fonts or scripts from other sites. The browser enforces this through the app's Content-Security-Policy (`static/_headers`), and an automated test (`e2e/offline.e2e.ts`) checks that the app makes no requests to other sites.
- Cloudflare serves the app's files. Like any web host it can see that someone downloaded them (IP address and time), but never what you log.
- After the first visit the whole app is stored on the device and works offline.
- Each browser keeps its own separate journal, and clearing the browser's data for this site deletes it. Save a backup file in Settings now and then.
- A backup file is plain, unencrypted JSON with your whole journal, photos included: keep it somewhere private.
- The app has no lock of its own: anyone who can use your unlocked device can open it.
- Strain photos are cropped and redrawn before saving, which removes hidden metadata such as GPS location.

The app explains the same in Settings → How your data is kept. To report a security problem, see [SECURITY.md](SECURITY.md).

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

LightHead is free software under the GNU Affero General Public License v3.0 or later (`LICENSE`). If you run a modified version for others, including as a hosted service, you must publish your changes under the same licence.

Fonts (Atkinson Hyperlegible Next/Mono, Bricolage Grotesque) are under the SIL Open Font License 1.1, shipped in `static/licenses/fonts-OFL.txt`.
