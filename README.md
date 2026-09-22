# LightHead

A local-first PWA for tracking cannabis sessions, strains, and tolerance breaks. No account, no server — your data lives on your device.

Full product plan and cycle-1 scope live in Basecamp. This repo tracks the code and code-linked issues; Basecamp tracks the shape of the work (pitches, hill charts, cooldown planning).

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) (TypeScript, static/prerendered — no backend for MVP)
- SCSS for styling
- [`idb`](https://github.com/jakearchibald/idb) for IndexedDB access
- [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) for installability (manifest + service worker)
- Deployed to Cloudflare Pages, with room to add Cloudflare Workers + D1 later for the paid cloud-sync tier

## Developing

Install dependencies, then start the dev server:

```sh
pnpm install
pnpm dev
```

## Checking, testing, building

```sh
pnpm lint      # prettier --check + eslint
pnpm check     # svelte-check (types)
pnpm test      # unit tests (vitest)
pnpm build     # production build (also regenerates wrangler types)
pnpm preview   # preview the production build locally
```

## Project data model

See `src/lib/db/types.ts` for the current `Strain`, `Session`, and `ToleranceBreak` shapes, and `src/lib/db/index.ts` for the IndexedDB schema (via `idb`). THC is always normalized to mg internally, regardless of how it was logged (grams × strain % for joint/vape, direct mg entry for edibles).
