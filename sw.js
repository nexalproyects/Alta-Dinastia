const V = "ad-v3", CORE = ["./", "index.html", "style.css", "js/perf.js", "js/main.js"];
const put = (r, x) => { if (!x.ok) return x; const c = x.clone(); caches.open(V).then(h => h.put(r, c)); return x; };
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || /\.mp4$/.test(u.pathname)) return;
  const code = r.mode === "navigate" || /\.(html|css|js)$/.test(u.pathname);
  /* sirve la copia en caché al instante y la actualiza en segundo plano (sin esperar la red) */
  e.respondWith(caches.match(r).then(h => {
    if (h && !code) return h;
    const n = fetch(r).then(x => put(r, x)).catch(() => null);
    if (h) { e.waitUntil(n); return h; }
    return n.then(x => x || Response.error());
  }));
});
