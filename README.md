# TripKit — offline trip checklist

A small app for business and vacation trips: packing, documents, itinerary and money, with **Go / Back** checklists so nothing gets left behind on the way home. It works offline, and your data stays on your device.

In the app, tap **?** (top right) for this guide or **Start tour** for a step-by-step walkthrough. The tour is also offered the first time you open the app.

## Quick start
1. **Trips → + New trip.** Enter From, Transit via (optional), To, dates, Vacation / Business and Domestic / Abroad. Leave "Prefill" on to get a ready-made packing and document list.
2. **Packing / Documents:** keep the switch on **Going** and tick **Go** as things go in your bag.
3. **Before returning:** switch to **Going home**, tick **Back**, and tap **Missing** to list anything you brought but haven't packed back.
4. **Itinerary:** add places with date, time, area and estimated cost. Tick them as you visit.
5. **Money:** add **Brought** rows (cash or budget) and **Spent** rows in any currency. Set each exchange rate once, and totals convert to your home currency.

## Features
| Area | What you can do |
|---|---|
| Trips | Many trips; edit route, transit, dates, purpose, domestic/abroad, home currency; duplicate (ticks cleared); delete with undo |
| Packing | Item, category, qty, bag, notes; Go + Back ticks; Missing filter on the way home |
| Documents | Grouped by stage: Before departure, At departure, In transit, On arrival, Return trip. Add your own stages. Red expiry date if it expires within 6 months of your return |
| Itinerary | Date, time, place, area, est. cost, notes; one chip per day |
| Money | Brought vs Spent, multi-currency, per-trip rates, money left, per-day allowance, spending by category |
| Custom columns | Tap **+** at the end of the headers to add Text / Number / Date columns per tab |

## Spreadsheet-style editing
- Tap any cell to type. **Enter** moves to the next row (and adds one at the end). **Shift+Enter** moves up.
- Paste rows copied from Google Sheets or Excel into a cell to add many rows at once. Tab-separated values fill the columns.
- Tap a header to sort. Use search, the chips and **Hide done** to filter.
- Delete a row with **×** or **Ctrl/⌘+Backspace**. Every delete can be undone from the toast.

## Offline, backup and sharing
- Data is stored in this browser on this device only. Nothing is uploaded.
- To install: on Android, open the Chrome menu and tap **Install app**. On iPhone, tap Safari **Share → Add to Home Screen**. Once installed, it works with no internet.
- **Trips → Copy checklist as text** to send the list on WhatsApp.
- **Trips → Download / Copy backup** before changing phones or clearing browser data, then **Import backup** on the new device.

## Sync between devices (optional)
Edit on your phone and laptop with one sync code. Data is encrypted on the device before upload, and offline edits merge when you're back online. Setup uses your Cloudflare account (a free Worker + D1 database); see **CLOUDFLARE-SYNC.md**. In the app: **Trips → Set up sync**.

## Hosting
See **DEPLOY.md** for the step-by-step GitHub Pages guide. After any update, change the cache name in `sw.js` (for example `tripkit-v6` → `tripkit-v7`) so installed phones fetch the new version.

## Files
`index.html` (the whole app; set `SYNC_URL` near the top of the script), `sw.js` (offline cache), `manifest.webmanifest` + icons (install), `worker.js` (Cloudflare sync server, not uploaded to GitHub), `README.md`, `DEPLOY.md`, `CLOUDFLARE-SYNC.md`.
