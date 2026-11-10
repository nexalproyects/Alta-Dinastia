const V = "ad-v2", CORE = ["./", "index.html", "style.css", "js/perf.js", "js/main.js"];
const put = (r, x) => { const c = x.clone(); caches.open(V).then(h => h.put(r, c)); return x; };
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || /\.mp4$/.test(u.pathname)) return;
  const code = r.mode === "navigate" || /\.(html|css|js)$/.test(u.pathname);
  e.respondWith(code
    ? fetch(r).then(x => put(r, x)).catch(() => caches.match(r))
    : caches.match(r).then(h => h || fetch(r).then(x => put(r, x))));
});
