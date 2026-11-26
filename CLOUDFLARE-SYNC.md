# Set up sync on Cloudflare (step by step)

About 10 minutes, all done by clicking in the Cloudflare dashboard. No command line is needed. It's free on the Workers Free plan.

You will make:
- **A D1 database** (`tripkit-sync`) that stores one encrypted copy of your trips.
- **A Worker** (`tripkit-sync`), a small piece of code that the app talks to.

You need from the zip: **`worker.js`** (the Worker code) and the updated **`index.html`** + **`sw.js`**.

> Cloudflare sometimes renames menu items. If a name below doesn't match exactly, look for the closest one. The steps stay the same.

---

## Part A: Create the database

1. Go to **https://dash.cloudflare.com** and log in. If you have several accounts, pick the one you want.
2. In the left sidebar, open **Storage & databases → D1 SQL database**.
3. Click **Create** (or **Create database**).
   - Name: `tripkit-sync`
   - Location: leave **Automatic**, or choose **Asia-Pacific** since you're in Indonesia.
   - Click **Create**.
4. Open the new database and click the **Console** tab.
5. Paste this line exactly and click **Execute**:

   ```sql
   CREATE TABLE IF NOT EXISTS sync (id TEXT PRIMARY KEY, ver INTEGER NOT NULL, data TEXT NOT NULL, updated INTEGER NOT NULL);
   ```

   You should see a success message, and a table called **sync** appears under Tables.

---

## Part B: Create the Worker

6. In the left sidebar, open **Compute (Workers) → Workers & Pages**.
7. Click **Create** → **Workers** tab → **Start with Hello World!** (or "Create Worker").
   - Name: `tripkit-sync`
   - Click **Deploy**. This deploys a sample; you'll replace it next.
8. Click **Edit code** (top right).
   - On the left, click the file **worker.js**. Select everything in the editor and delete it.
   - Open `worker.js` from the zip in a text editor (Notepad or TextEdit), copy **all** of it, and paste it into the editor.
   - Click **Deploy** (top right), then go back to the Worker page.

### Connect the database to the Worker
9. On the Worker page, open **Settings → Bindings** → **Add binding** (or **+ Add**).
   - Choose **D1 database**.
   - Variable name: `DB`, in capital letters and exactly that.
   - D1 database: choose **tripkit-sync**.
   - Click **Add binding** / **Deploy**.

### Allow only your app's website (recommended)
10. Still in **Settings**, open **Variables and Secrets** → **Add**.
    - Type: **Text**
    - Variable name: `ALLOWED_ORIGINS`
    - Value: `https://YOUR-USERNAME.github.io`
      (Use your GitHub username. Don't add a trailing `/` or `/tripkit`; it must be the bare site address.)
    - Click **Deploy** (or **Save and deploy**).

    To allow more than one address, separate them with commas, for example `https://yourname.github.io,https://trip.yourdomain.com`.

### Get the Worker address and test it
11. On the Worker's overview page, find **Domains & Routes** (or "Preview"). The address looks like:
    `https://tripkit-sync.YOUR-SUBDOMAIN.workers.dev`
    Copy it.
12. Open this in your browser: `https://tripkit-sync.YOUR-SUBDOMAIN.workers.dev/health`
    - `{"ok":true,"service":"tripkit-sync"}` means everything is ready ✅
    - `D1 binding "DB" is missing` means step 9 needs fixing (check the name is exactly `DB`).
    - `Table "sync" not found` means step 5 needs repeating.

---

## Part C: Tell the app where the Worker is

Choose **one** of these.

**Option 1, recommended (set once for all devices):**
13. In your GitHub repository, upload the new `index.html` and `sw.js` from the zip (**Add file → Upload files → Commit changes**).
14. Click `index.html` → the pencil icon (**Edit**). Near the top of the script, find this line (use Ctrl+F / ⌘F and search for `SYNC_URL`):
    ```js
    const SYNC_URL = '';
    ```
    Put your Worker address between the quotes:
    ```js
    const SYNC_URL = 'https://tripkit-sync.YOUR-SUBDOMAIN.workers.dev';
    ```
    Click **Commit changes**.

**Option 2, no file editing:** upload the new files only. In the app, the sync screen will ask for the Worker address. Paste it on each device.

Wait 1–2 minutes for GitHub Pages to update, then open the app **twice** on each device to load the new version.

---

## Part D: Turn on sync

**On your first device** (the one with your trips):
1. Open your app at `https://YOUR-USERNAME.github.io/tripkit/`.
2. Tap **Trips → Set up sync → Create sync code**.
3. Tap **Copy code** and send it to yourself, for example in WhatsApp "Message yourself".

**On each other device:**
1. Open the same app address.
2. Tap **Trips → Set up sync**, paste the code, then choose:
   - **Join — use synced trips** for a new or empty device. This replaces its trips with the synced ones.
   - **Join — keep trips on this device too** if this device has trips you want to keep. They are merged with the synced ones.

That's it. Edit anywhere. Offline changes sync automatically when you're back online.

**The dot at the top right shows sync status** (tap it for details):
- 🟢 Synced
- 🟠 Syncing…
- ⚪ Offline, will sync later
- 🔴 Sync problem

---

## How it works (short)
- Your sync code is a random 26-character key. The app encrypts your trips with it **before** uploading. Cloudflare only stores scrambled data and a random ID; it never sees the code.
- Each device keeps a full copy and works offline. When online, it checks for changes every 20 seconds while open, when you reopen it, and when the connection comes back.
- **Merging:** edits to different rows or cells on different devices are all kept. Deleted rows stay deleted. If the *same cell* was changed on two devices, the device that syncs last wins.

## Troubleshooting
| Problem | Fix |
|---|---|
| "Can't reach the sync server" | Check the Worker address (step 11) and that the device is online. |
| "Sync problem: origin not allowed" | `ALLOWED_ORIGINS` must be exactly `https://YOUR-USERNAME.github.io`, with no slash at the end (step 10). |
| "No synced trips found for this code" | Check the code, or create one on the first device first. |
| Sync screen says it only works in the installed app | You're in the claude.ai preview. Use your GitHub Pages address. |
| Lost the code | Open **Sync settings** on any device that's still connected; the code is shown there. If no device has it, the cloud copy can't be opened, but each device still has its own trips. Stop sync and create a new code. |
| Want a fresh code (for example, you shared it by mistake) | **Sync settings → Delete cloud copy**, then **Create sync code** again and rejoin the other devices. |

## Cost
The Workers Free plan and D1's free tier are far more than enough. Your trips are a few tens of KB, and each open device makes about 3 small requests per minute.
