// TripKit service worker
// - The page itself: network first (so updates show immediately when online), cached copy when offline.
// - Everything else (icons, fonts): cache first, refreshed in the background.
const CACHE = 'tripkit-v7';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromNetwork(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(req, { cache: 'no-store' }).then(res => { clearTimeout(t); resolve(res); }, err => { clearTimeout(t); reject(err); });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname));

  if (isPage) {
    e.respondWith(
      fromNetwork(req, 4000).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
        return res;
      }).catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Never cache the sync server's answers.
  if (url.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
