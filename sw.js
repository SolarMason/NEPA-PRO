/* NEPA-PRO service worker
 *
 * Strategy:
 *   • Same-origin HTML/CSS/JS/icons : cache-first, refresh in background
 *   • External images (Unsplash, CDN)      : cache-first, long-lived
 *   • Everything else                      : network-first with cache fallback
 *   • Navigation request failure            : fallback to offline.html
 */

const VERSION = 'v1.0.0';
const CORE_CACHE = `nepa-pro-core-${VERSION}`;
const MEDIA_CACHE = `nepa-pro-media-${VERSION}`;
const RUNTIME_CACHE = `nepa-pro-runtime-${VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-apple-180.png',
  './icons/icon-maskable-512.png',
  './icons/favicon.png',
];

const MEDIA_HOSTS = [
  'images.unsplash.com',
  'cdn.ln-cdn.com',
];

// ─── Install ────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const KEEP = new Set([CORE_CACHE, MEDIA_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => !KEEP.has(key)).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ──────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigation requests → cache-first with network refresh, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Same-origin assets → cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, CORE_CACHE));
    return;
  }

  // External media (Unsplash, CDN logo) → cache-first, media cache
  if (MEDIA_HOSTS.some((host) => url.hostname.endsWith(host))) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
    return;
  }

  // Everything else (fonts, other CDNs) → network-first with cache fallback
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

// ─── Strategies ─────────────────────────────────────────────────────────

async function navigationStrategy(request) {
  // Try cache-first for the shell, then network to refresh, offline fallback if all fail
  try {
    const cache = await caches.open(CORE_CACHE);
    const cached = await cache.match('./index.html');
    if (cached) {
      // Fire-and-forget refresh
      fetch(request).then((response) => {
        if (response && response.ok) cache.put('./index.html', response.clone());
      }).catch(() => {});
      return cached;
    }
    const response = await fetch(request);
    return response;
  } catch (err) {
    const offline = await caches.match('./offline.html');
    return offline || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok && response.type !== 'opaque') {
      cache.put(request, response.clone());
    } else if (response && response.type === 'opaque') {
      // Can't inspect opaque responses; cache them anyway (trust the CORS mode the site set)
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Nothing to fall back to for individual assets
    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

// ─── Skip-waiting message (for manual update UX) ────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
