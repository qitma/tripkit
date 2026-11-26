# Host TripKit on GitHub Pages (free, no coding)

1. Unzip `tripkit-pwa.zip` on your computer. You get: index.html, sw.js, manifest.webmanifest, icon.svg, icon-192.png, icon-512.png (and this DEPLOY.md).
2. Sign in at https://github.com (create a free account if needed).
3. Top-right "+" → **New repository**. Name: `tripkit`. Visibility: **Public** (free Pages needs public; your trip data is NOT in the repo — it stays on your phone). Click **Create repository**.
4. On the empty repo page click **uploading an existing file**. Drag in all the files from step 1 (not the folder — the files themselves, so index.html sits at the top level). Click **Commit changes**.
5. Repo → **Settings** → left menu **Pages**. Under "Build and deployment": Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)** → **Save**.
6. Wait 1–2 minutes, refresh the Pages settings page. It shows: "Your site is live at https://YOUR-USERNAME.github.io/tripkit/".
7. Install on your phone:
   - Android (Chrome): open the link → ⋮ menu → **Install app** (or **Add to Home screen**).
   - iPhone (Safari): open the link → Share → **Add to Home Screen**.
8. Open it once while online. After that it works with no internet (airplane mode, abroad without data).

## Updating later
- Repo → click `index.html` → pencil icon (or **Add file → Upload files** to replace) → Commit.
- In `sw.js`, change `tripkit-v6` to `tripkit-v7` (any new name) and commit, so phones download the new version.
- On the phone, open the app twice (first open fetches the update, second shows it).

## Keep your data safe
Data lives only in that phone's browser. Before changing phones or clearing browser data: Trips → **Download backup** (or Copy backup), then **Import backup** on the new device.
