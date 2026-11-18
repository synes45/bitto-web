// App shell cache so the page opens offline. Network first, so updates show up immediately when online.
// Supabase API calls (other origin) are never cached.
const CACHE = 'kedi-v5';
const SHELL = ['./', 'index.html', 'config.js', 'items.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  'ui/btn_brown.png', 'ui/btn_cream.png', 'ui/btn_peach.png', 'ui/cat_face.png', 'ui/cat_idle.png', 'ui/cat_sleep.png', 'ui/heart_empty.png', 'ui/heart_full.png', 'ui/panel.png', 'ui/paw.png', 'ui/paw_empty.png', 'ui/paw_icon.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];

self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))));
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || !SHELL.some((s) => url.href === new URL(s, self.registration.scope).href)) return;
  e.respondWith(fetch(e.request)
    .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request)));
});
