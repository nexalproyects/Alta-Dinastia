/* ALTA DINASTÍA · Perfiles de rendimiento adaptativos
   Decide el perfil con capacidades reales (no solo tamaño de pantalla) y lo expone en
   <html data-p="desktop|laptop|android|ios|low" data-fx="flags"> y en window.PERF.
   Cada API ausente usa un valor por defecto seguro. */
(function () {
  var w = window, n = navigator, d = document.documentElement;
  var mm = function (q) { try { return !!w.matchMedia && w.matchMedia(q).matches; } catch (e) { return false; } };
  var ua = n.userAgent || '';
  var ios = /iP(hone|ad|od)/.test(ua) || (n.platform === 'MacIntel' && n.maxTouchPoints > 1); /* iPadOS se anuncia como Mac */
  var con = n.connection || {};
  var coarse = mm('(pointer:coarse)') || mm('(hover:none)');
  var cores = n.hardwareConcurrency || 4;
  var mem = n.deviceMemory || 4;                 /* iOS no lo expone: se asume 4 GB */
  var save = !!con.saveData || /(^|-)2g$/.test(con.effectiveType || '');
  var dpr = w.devicePixelRatio || 1;

  var score = (cores >= 8 ? 2 : cores >= 4 ? 1 : 0) + (mem >= 8 ? 2 : mem >= 4 ? 1 : 0) - (save ? 2 : 0);
  if (coarse && dpr >= 3 && mem < 4) score--;    /* pantallas muy densas con poca RAM: mucho relleno de píxeles */

  var p = (mem <= 2 || score <= 1) ? 'low'
        : ios ? 'ios'
        : coarse ? 'android'
        : (cores >= 8 && mem >= 8 && !save) ? 'desktop' : 'laptop';

  /* flags CSS:  md = blur reducido · lite = sin mix-blend ni blur de revelado · nobd = sin backdrop-filter · still = sin gradientes animados */
  var FX = { desktop: '', laptop: 'md', android: 'lite md', ios: 'lite md', low: 'lite md nobd still' };
  /* n = notas flotantes · t = destellos del logo */
  var N = { desktop: { n: 16, t: 8 }, laptop: { n: 12, t: 8 }, android: { n: 8, t: 6 }, ios: { n: 8, t: 6 }, low: { n: 4, t: 4 } };
  var NEXT = { desktop: 'laptop', laptop: 'low', android: 'low', ios: 'low' }; /* solo se degrada, nunca se sube: evita parpadeos */

  var P = w.PERF = { profile: p, n: 0, t: 0, ios: ios, coarse: coarse, reduce: mm('(prefers-reduced-motion:reduce)'), cbs: [] };
  P.on = function (f) { P.cbs.push(f); };
  function apply(q) {
    P.profile = q; P.n = N[q].n; P.t = N[q].t;
    d.setAttribute('data-p', q); d.setAttribute('data-fx', FX[q]);
    for (var i = 0; i < P.cbs.length; i++) P.cbs[i](P);
  }
  apply(p);

  /* Vigilancia de fluidez: mide ~50 fotogramas tras la carga; si el promedio supera ~30 ms baja un nivel */
  function probe() {
    var c = 0, sum = 0, last = 0;
    requestAnimationFrame(function s(t) {
      if (last && t - last < 250) { sum += t - last; c++; }   /* ignora pausas de pestaña oculta */
      last = t;
      if (c < 50) requestAnimationFrame(s);
      else if (sum / c > 30 && NEXT[P.profile]) apply(NEXT[P.profile]);
    });
  }
  w.addEventListener('load', function () { setTimeout(probe, 1500); setTimeout(probe, 7000); setTimeout(probe, 14000); });
})();
