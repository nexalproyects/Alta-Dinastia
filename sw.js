/* ALTA DINASTÍA · Service worker
   - HTML: red primero (siempre ve la última versión), caché si no hay conexión.
   - CSS, JS e imágenes: caché primero y se actualizan en segundo plano.
   - Audio y video: NO pasan por la caché (el navegador los pide por partes, respuesta 206,
     y la Cache API no admite respuestas parciales).
   Al cambiar archivos del sitio, sube el número de VERSION para limpiar cachés viejas. */
const VERSION = 'ad-v3';
const CORE = ['./', 'index.html', 'style.css', 'js/main.js', 'js/perf.js', 'img/favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))   /* si falta uno, no rompe la instalación */
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* solo se guarda lo que es una respuesta completa y correcta */
const guardar = (req, res) => {
  if (res && res.status === 200 && res.type !== 'opaque') {
    const copia = res.clone();
    caches.open(VERSION).then(c => c.put(req, copia)).catch(() => {});
  }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  /* audio, video y cualquier petición por rangos: directo a la red, sin caché */
  if (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video' ||
      /\.(mp3|m4a|mp4|webm|ogg|wav)$/i.test(url.pathname)) return;

  /* HTML: red primero */
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(res => guardar(req, res))
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  /* resto (css, js, imágenes, fuentes): caché primero, actualiza en segundo plano */
  e.respondWith(
    caches.match(req).then(enCache => {
      const red = fetch(req).then(res => guardar(req, res)).catch(() => enCache);
      return enCache || red;
    })
  );
});
