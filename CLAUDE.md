# TripKit — notes for Claude Code

Offline-first trip checklist PWA (packing, documents, itinerary, money) with optional encrypted sync.
Hosted on GitHub Pages; sync server is a Cloudflare Worker + D1.

## Files
- `index.html` — the whole app (HTML + CSS + JS in one file, no build step, no dependencies).
  - `const SYNC_URL` and `const APP_VERSION` are at the top of the main `<script>`.
- `sw.js` — service worker. Page = network-first, assets = cache-first. Never cache the sync API.
- `manifest.webmanifest`, `icon*.png`, `icon.svg` — install metadata.
- `worker.js` — Cloudflare Worker (D1 binding `DB`, optional var `ALLOWED_ORIGINS`). Not served by GitHub Pages.
- `README.md` (user guide), `DEPLOY.md` (GitHub Pages), `CLOUDFLARE-SYNC.md` (Worker/D1 setup).

## Every release
1. Bump `APP_VERSION` in `index.html` and `CACHE` (`tripkit-vN`) in `sw.js` together.
2. Test locally: `python3 -m http.server 8000` → http://localhost:8000 (service worker + crypto work on localhost).
3. Commit and push to `main`; GitHub Pages redeploys in ~1 minute.

## Data model (localStorage `tripkit.v1`)
`{trips:[{id,name,from,via,to,start,end,kind,scope,home,rates,leg,cols,pack[],docs[],plan[],money[]}],cur,tab,toured}`
- Rows always have a unique `id`; custom columns have keys `c_xxxxxxxx`.
- Pack/docs rows: `done` = Go tick, `back` = Back tick.
- Sync state lives in `tripkit.sync` (`code, url, ver, base`). Merge is a 3-way merge (base/local/remote) keyed by `id`/`k` — keep ids stable.

## Design rules (Emil Kowalski)
ease-out `cubic-bezier(.23,1,.32,1)`, UI motion ≤300 ms, animate transform/opacity only, `scale(.97)` press, popovers/dialogs enter from scale .96 (never 0), hover styles only under `(hover:hover) and (pointer:fine)`, respect `prefers-reduced-motion`, 44 px touch targets, 16 px inputs on touch, tabular numbers.

## Worker deploy (wrangler)
`npx wrangler login`, then a `wrangler.toml` with `main = "worker.js"` and a `[[d1_databases]]` binding `DB` → `database_name = "tripkit-sync"` + its `database_id`; `npx wrangler deploy`.
