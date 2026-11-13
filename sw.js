const V = "ad-v5", CORE = ["./", "index.html", "style.css", "js/perf.js", "js/main.js"];
/* solo se guardan respuestas completas (200); las parciales (206) de audio/video no caben en la Cache API */
const put = (r, x) => { if (x.status !== 200 || x.type === "opaque") return x; const c = x.clone(); caches.open(V).then(h => h.put(r, c)).catch(() => {}); return x; };
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || r.headers.has("range") || /\.(mp4|mp3|m4a|webm|ogg|wav)$/i.test(u.pathname)) return;
  const code = r.mode === "navigate" || /\.(html|css|js)$/.test(u.pathname);
  if (code) {
    /* HTML, CSS y JS: red primero (así siempre son del mismo despliegue); si tarda >3 s o no hay red, caché */
    e.respondWith(new Promise(res => {
      const t = setTimeout(() => caches.match(r).then(h => h && res(h)), 3000);
      fetch(r).then(x => { clearTimeout(t); res(put(r, x)); })
        .catch(() => { clearTimeout(t); caches.match(r).then(h => res(h || Response.error())); });
    }));
  } else {
    e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => put(r, x))));
  }
});
