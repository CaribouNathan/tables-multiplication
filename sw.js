/* Tables de multiplication — service worker
   Stratégie : precache complet à l'installation, puis cache-first.
   L'app tient en 5 fichiers, il n'y a donc rien à charger au lancement. */

const VERSION = "v1";
const CACHE = `tables-${VERSION}`;

const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/apple-touch-icon-dark.png",
  "icons/favicon-32.png",
  "icons/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // Navigation : cache d'abord, réseau en arrière-plan pour la prochaine ouverture
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("index.html").then(cached => {
        const network = fetch(req)
          .then(res => {
            if (res.ok) caches.open(CACHE).then(c => c.put("index.html", res.clone()));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
