// Will Scarcat PWA Service Worker
const CACHE = 'wc-v2'
const OFFLINE = '/offline.html'
const PRECACHE = ['/', '/dapp', '/cats', '/intel', OFFLINE, '/manifest.json', '/images/willlogo.jpg']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // Skip cross-origin requests (RPC calls, APIs, CDNs)
  if (url.origin !== location.origin) return

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached
      return fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(e.request, clone))
          }
          return res
        })
        .catch(() => caches.match(OFFLINE))
    })
  )
})
