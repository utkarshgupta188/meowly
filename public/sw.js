const CACHE_NAME = "meowly-pwa-cache-v1";
const OFFLINE_URL = "/offline";

const ASSETS_TO_PRECACHE = [
  "/",
  OFFLINE_URL,
  "/icon.png",
  "/apple-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];

// Cache limit control to avoid bloat
const MAX_CACHE_ITEMS = 120;
const trimCache = (cacheName, maxItems) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => {
          trimCache(cacheName, maxItems);
        });
      }
    });
  });
};

// Install: Pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching application shell");
        // We use map to cache individually so one failing doesn't break the entire install
        return Promise.allSettled(
          ASSETS_TO_PRECACHE.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[Service Worker] Failed to cache: ${url}`, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Clearing old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Interceptor
self.addEventListener("fetch", (event) => {
  // Only intercept same-origin GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Bypass chrome-extension scheme or other non-http protocols
  if (!url.protocol.startsWith("http")) return;

  // 1. Navigation requests (HTML Pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the successfully fetched page
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, attempt to serve the page from cache, or fallback to /offline
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 2. Static Assets (Scripts, Styles, Fonts, Local images)
  if (
    isSameOrigin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/static/") ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2|woff|ttf)$/))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately and refresh in background (Stale-While-Revalidate)
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                  trimCache(CACHE_NAME, MAX_CACHE_ITEMS);
                });
              }
            })
            .catch(() => {}); // Suppress background fetch errors
          return cachedResponse;
        }

        // Cache miss: fetch from network, then cache
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            trimCache(CACHE_NAME, MAX_CACHE_ITEMS);
          });
          return networkResponse;
        });
      })
    );
    return;
  }
});
