/* Roteirizador — service worker
   Estrategia:
   - Precache do app shell na install
   - Network-only para Supabase (auth/DB/storage/realtime)
   - Cache-first com revalidacao para mesma origem
   - Cache-first com fallback de rede para outras origens (CDNs/fonts)
*/
const VERSION = 'rmc-pwa-v9';
const CORE = [
  './',
  './index.html',
  './landing.html',
  './assets/css/landing-scoped.css?v=rmc9',
  './assets/icons/logo-maiko-costa.png',
  './assets/images/hero-collage.jpg',
  './assets/images/hero-collage.png',
  './assets/images/about.avif',
  './assets/images/testimonial.avif',
  './assets/images/auth-bg.avif',
  './manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () { /* offline na 1a instalacao: ignorar */ })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Nunca interceptar Supabase (auth/db/storage/realtime/oauth)
  if (
    url.hostname.endsWith('supabase.co') ||
    url.hostname.endsWith('supabase.in') ||
    url.hostname === 'accounts.google.com'
  ) {
    return;
  }

  // Mesma origem: cache-first com revalidacao em background, fallback offline -> index.html
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        var fetcher = fetch(req).then(function (r) {
          if (r && r.status === 200 && r.type === 'basic') {
            var copy = r.clone();
            caches.open(VERSION).then(function (c) { c.put(req, copy); }).catch(function () {});
          }
          return r;
        }).catch(function () { return null; });
        if (hit) {
          fetcher.then(function () {});
          return hit;
        }
        return fetcher.then(function (r) {
          if (r) return r;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'offline' });
        });
      })
    );
    return;
  }

  // Outras origens (CDN do Supabase JS, Google Fonts, etc): cache-first + revalidate
  e.respondWith(
    caches.match(req).then(function (hit) {
      var fetcher = fetch(req).then(function (r) {
        if (r && (r.status === 200 || r.type === 'opaque')) {
          var copy = r.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return r;
      }).catch(function () { return null; });
      if (hit) {
        fetcher.then(function () {});
        return hit;
      }
      return fetcher.then(function (r) {
        return r || new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
