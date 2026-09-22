---
name: run-lighthead
description: Build, run, and drive LightHead (the SvelteKit PWA). Use when asked to start LightHead, run its dev server, build it, preview the production build, screenshot its UI, or verify the PWA/service-worker installs correctly.
---

LightHead is a local-first SvelteKit PWA (no backend). It's driven with
`.claude/skills/run-lighthead/driver.mjs`, a small Playwright script that
launches its own isolated Chromium (kept out of the project's own
`package.json`/lockfile — see Setup) against a running dev or preview
server, and reports the page heading, console errors, and (optionally)
service-worker state as JSON.

All paths below are relative to the repo root (`/mnt/hdd/Projects/lighthead`).

## Prerequisites

Node and `pnpm` are the project's own toolchain (already required to work
on this repo at all — nothing extra to install for those).

The driver needs its own Playwright + a headless Chromium. No system
packages were needed to launch Chromium in this container — `npx
playwright install chromium` downloaded a working browser with zero
`apt-get` calls.

## Setup (one-time, for the driver)

The driver has its **own** `package.json` inside the skill directory,
installed separately from the app's dependencies — this keeps a
browser-automation tool out of the project's real lockfile (the plan
explicitly scoped cycle 1 to no heavy e2e tooling in the app itself).

```bash
cd .claude/skills/run-lighthead
npm install
npx playwright install chromium
cd ../../..   # back to repo root
```

## Build

```bash
pnpm install          # app dependencies, from repo root
pnpm run build        # regenerates wrangler types, then builds to .svelte-kit/
```

## Run (agent path)

Two servers matter here, and they answer different questions:

- **Dev server** (`pnpm dev`, port 5173) — fastest way to check the UI
  renders. The PWA service worker is **not** registered in dev mode by
  default (`vite-plugin-pwa`'s `devOptions.enabled` is off) — that's
  expected, not a bug. Don't use dev mode to check installability.
- **Preview server** (`pnpm build && pnpm preview`, port 4173, via
  `wrangler pages dev`) — serves the real production build. This is the
  only server where the service worker actually registers, so it's the
  one to use for PWA/installability checks.

```bash
# Dev: quick UI check
lsof -ti:5173 -sTCP:LISTEN | xargs -r kill      # free the port first
(nohup pnpm dev > /tmp/lighthead-dev.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'

node .claude/skills/run-lighthead/driver.mjs http://localhost:5173 \
  --screenshot .claude/skills/run-lighthead/screenshots/dev-home.png

lsof -ti:5173 -sTCP:LISTEN | xargs -r kill      # stop when done
```

```bash
# Preview: PWA/service-worker check (needs a build first, see above)
lsof -ti:4173 -sTCP:LISTEN | xargs -r kill
(nohup pnpm preview > /tmp/lighthead-preview.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:4173 >/dev/null; do sleep 1; done'

node .claude/skills/run-lighthead/driver.mjs http://localhost:4173 \
  --check-sw --screenshot .claude/skills/run-lighthead/screenshots/preview-home.png

lsof -ti:4173 -sTCP:LISTEN | xargs -r kill
```

Screenshots land wherever `--screenshot <path>` points (paths are
relative to the current working directory when you run `node`, so the
examples above resolve to
`.claude/skills/run-lighthead/screenshots/` from repo root). Driver
output is JSON on stdout: `{ ok, url, heading, swState, console,
screenshotPath }`. Non-zero exit code means the heading never appeared
or something logged a console error / uncaught exception.

### Driver CLI

```
node driver.mjs <url> [--screenshot <path>] [--check-sw] [--wait-ms <n>]
```

| flag                  | what it does                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--screenshot <path>` | saves a full-page screenshot after load                                                                                                                            |
| `--check-sw`          | waits, then evaluates `navigator.serviceWorker.getRegistration()` state — only meaningful against the **preview** server                                           |
| `--wait-ms <n>`       | override the settle wait before reading state (default 500ms, or 3000ms when `--check-sw` is set — the service worker needs a couple seconds to reach `activated`) |

## Run (human path)

```bash
pnpm dev             # -> http://localhost:5173, Ctrl-C to stop
pnpm build && pnpm preview   # -> http://localhost:4173, Ctrl-C to stop
```

## Test

```bash
pnpm lint    # prettier --check + eslint
pnpm check   # svelte-check (types) — runs `wrangler types` first
pnpm test    # vitest, one passing example test as of this writing
```

---

## Gotchas

- **`vite-plugin-pwa`'s automatic HTML injection silently no-ops on
  SvelteKit.** It's built for a plain `index.html`; SvelteKit's
  `app.html` template means the manifest `<link>` and the SW
  registration `<script>` it tries to inject never land on the page —
  no error, no warning, just a build that succeeds and a PWA that can
  never install. Fixed in this repo already (`app.html` has the
  manifest link by hand, `injectRegister: false` in `vite.config.ts`,
  and the SW is registered manually via `virtual:pwa-register` in
  `+layout.svelte`'s `onMount`) — but if that wiring ever gets removed
  during a refactor, `--check-sw` against the preview server is what
  catches it (`swState` will read `not-registered` instead of
  `activated`).
- **The Playwright MCP tool in this environment requires a `chrome`
  channel binary at `/opt/google/chrome/chrome`, which isn't installed
  and can't be installed without root** (no passwordless `sudo` here).
  That's why this driver uses the `playwright` npm package directly
  with its own isolated Chromium install instead of the MCP tool —
  `chromium.launch()` with no `executablePath` resolves correctly once
  the driver's local `npm install` + `npx playwright install chromium`
  (both run from _inside_ `.claude/skills/run-lighthead/`) have put a
  matching browser revision in `~/.cache/ms-playwright`.
- **Run `node driver.mjs` from inside the skill directory** (or
  anywhere `require`/`import` can resolve `.claude/skills/run-lighthead/
node_modules/playwright`) — running it from elsewhere with a bare
  `node /path/to/driver.mjs` throws `ERR_MODULE_NOT_FOUND: playwright`,
  since Node's ESM resolution walks up from the _script's_ location,
  not the cwd, but only finds `node_modules` that are actually there.
- **Ports don't free themselves.** `pnpm dev`/`pnpm preview` back onto
  Vite/Wrangler child processes; backgrounding with `&` and killing the
  `pnpm` wrapper's PID doesn't reliably kill them. Always
  `lsof -ti:<port> -sTCP:LISTEN | xargs -r kill` before relaunching, or
  the next start fails with `EADDRINUSE`.
- **`pnpm run build`/`pnpm run check` regenerate
  `worker-configuration.d.ts`** (via `wrangler types`) — it's
  gitignored on purpose, don't be surprised it's "missing" on a fresh
  clone before the first build.

## Troubleshooting

- **`Chromium distribution 'chrome' is not found at
/opt/google/chrome/chrome`**: that's the Playwright _MCP_ tool, not
  this driver — it hardcodes the `chrome` channel. Don't try to satisfy
  it; use `driver.mjs` instead (see Gotchas above).
- **`ERR_MODULE_NOT_FOUND: Cannot find package 'playwright'`**: you ran
  `node driver.mjs` from the wrong directory, or skipped the one-time
  `npm install` in `.claude/skills/run-lighthead/`. See Setup.
- **`browserType.launch: Executable doesn't exist at
.../chromium_headless_shell-<rev>/...`**: a version mismatch between
  an already-installed Playwright browser cache and whatever
  `playwright` version just got resolved. Re-run `npx playwright
install chromium` from inside `.claude/skills/run-lighthead/` (matches
  the browser revision to the locally installed package version).
- **`sudo: a password is required`** when trying to `apt-get`/`pacman`
  install anything for this: there's no passwordless sudo in this
  container. Don't reach for a system package — the isolated
  `npm install` + bundled Chromium path above needs none.
