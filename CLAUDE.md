# LightHead — notes for Claude

Private, offline-first cannabis journal PWA. Svelte 5 + SvelteKit 3, static SPA, IndexedDB. **No React, no virtual DOM** (owner's firm preference).

## Commands
- `npm run check` (svelte-check), `npx vitest run` (unit), `npx playwright test --workers=1` (e2e; builds + serves on :4173 itself).
- E2E tests import `test` from `e2e/fixtures.ts`, which marks onboarding as done; only `e2e/onboarding.e2e.ts` uses the plain Playwright `test` for a first run.
- Don't leave a `vite preview` running on :4173 while Playwright runs: its rebuild replaces `build/` and kills that server. To stop a preview server use `pkill -f "[v]ite preview"` (the `[v]` keeps pkill from matching its own shell).

## SvelteKit 3 specifics
- Alias is `#lib/...` with explicit extensions (`#lib/db.ts`, `#lib/ds/Button.svelte`), not `$lib`.
- Links/navigation: `resolve('/strains/[id]', { id })` from `$app/paths`; there is no `base` export.
- Service worker imports: `self` from `$app/service-worker`, `version` from `$app/env`, `immutable`/`assets` from `$app/manifest`.
- `paths.relative: false` is required: the service worker serves one cached shell for every route.
- Cache lookups use `ignoreVary: true` (hosts send `Vary: Origin`; module scripts carry an Origin header).
- The service worker must not `skipWaiting()` on install: a new version waits for the Reload notice (`src/lib/update.svelte.ts`). Playwright can't intercept the worker's update check, so test that flow by hand with two builds served from a swapped folder.

## Deploy
- Cloudflare Workers, static assets only (`wrangler.jsonc`); every push to `master` deploys to https://lighthead.thematrixadmin.workers.dev. Headers live in `static/_headers` (the service worker skips that file when precaching).

## Product rules (from the design system brand book, `design/ds/README.md`)
- Data never leaves the device. No third-party requests of any kind (fonts, CDNs, analytics). `e2e/offline.e2e.ts` enforces it.
- Privacy and safety claims in docs (README, SECURITY.md) and in the app (`/privacy`, `/help`, `src/lib/messages/help.ts`) must match what the code enforces; update them when behaviour changes.
- Never judge usage: no warnings, no red for amounts, no streaks or praise. Red (`clay`) only for deleting and real errors.
- Sessions store a snapshot of the strain (name, type, THC/CBD, derived mg). Editing/deleting a strain never changes past sessions or stats.
- Derived THC = grams × THC % × 10, shown as "≈ 27 mg THC"; never called a dose. Edibles: the mg is already THC.
- One question per screen in flows; everything prefilled; confirmations are in-page, never `window.confirm()`.
- Every string through `t()`; en/de/pl written natively (informal du/ty; Polish avoids gendered past tense; plurals one/few/many). Add keys in a new or feature-specific `src/lib/messages/*.ts`.
- Formatting uses `region()` (device locale within the app language) so en-GB gets 24h and Monday weeks.

## Code conventions
- `src/lib/styles/components.css` class names are the design system's — don't add `<style>` to `src/lib/ds/*` and don't edit `components.css`.
- Pure logic goes in `src/lib/model.ts` with a test in `model.spec.ts`; dates use calendar arithmetic (DST-safe), never `n × 24h`.
- Store plain objects in IndexedDB (`$state.snapshot` / spread), never Svelte proxies.
- Desktop (>= 960px) uses the side rail (`src/routes/NavRail.svelte`); phones use `TabBar`. Phone layout must not change when editing desktop styles.

## Backlog
- GitHub Issues on dev-oskar/lighthead (public repo, AGPL-3.0-or-later), on the private board https://github.com/users/dev-oskar/projects/7 (project 7; move items with `gh project item-edit`). Use `gh`; reference issues in commits ("Fixes #n"). Keep business details out of public issues.

## Design sources (Claude artifacts)
- Design system: https://claude.ai/artifact/2ikdrdQJtZLz1NDPDyNiEe
- Screens canvas: https://claude.ai/artifact/QwutoUANdUbW73tisBDpYS — new screens are designed there first, then copied to `design/screens/`. Re-read the live `project/canvas.json` before publishing it (the owner edits the canvas too).
- The canvas has its own copy of the design-system bundle (`project/ds/lighthead/components/bundle.js`); when the design system changes, update the artifact, the canvas copy and `design/ds/` together.
