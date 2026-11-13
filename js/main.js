/* ========= CONFIG: edita aquí el contenido ========= */
const WA="+528717972928";/* ========= CONFIG: edita aquí el contenido ========= */
const CONFIG={
  // Videos de Música: {titulo, tipo:"video|youtube|instagram", src, thumb, vertical, cors}
  // "video" = archivo alojado (mp4). El ecualizador solo reacciona si el archivo es del mismo sitio o tiene CORS (cors:true).
  videos:[],
  // Galería: {titulo, tipo:"foto|video|youtube|instagram", src, thumb, cat, fit}
  // Las 5 piezas siguientes son arte de la marca; sustitúyelas por fotos y videos reales.
  galeria:[
    {tipo:"video",titulo:"En vivo · Noche en la calle",src:"video/video2.mp4",thumb:"img/video2-poster.webp",cat:"En vivo"},
    {tipo:"foto",bg:"var(--u-banner)",titulo:"En el escenario",cat:"Marca"},
    {tipo:"video",titulo:"En vivo · Azotea",src:"video/video3.mp4",thumb:"img/video3-poster.webp",cat:"En vivo"},
    {tipo:"foto",bg:"var(--u-instr)",titulo:"Acordeón y guitarra",cat:"Marca"},
    {tipo:"foto",bg:"var(--u-circ)",titulo:"El comienzo de algo grande",fit:"contain",cat:"Marca"},
    {tipo:"video",titulo:"Detrás de cámaras · Montaje",src:"video/video1.mp4",thumb:"img/video1-poster.webp",cat:"En vivo"},
    {tipo:"foto",bg:"var(--u-hero)",titulo:"ALTA DINASTÍA",cat:"Marca"},
    {tipo:"foto",bg:"var(--u-donde)",titulo:"Cobertura en Torreón",cat:"Marca"}
  ]
};
/* ==================================================== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const waLink=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const REDUCE=matchMedia("(prefers-reduced-motion:reduce)").matches;
const P=window.PERF||{n:16,t:8,on(){}};
/* imágenes secundarias: se piden solo al acercarse su sección (var CSS definida bajo demanda) */
const IMG={donde:"donde-s","donde-xl":"donde"},RS=document.documentElement.style,got=new Set();
const ld=(...a)=>a.forEach(k=>{if(!got.has(k)){got.add(k);RS.setProperty("--u-"+k,`url(${new URL(`img/${IMG[k]||k}.webp`,document.baseURI).href})`)}});
$$("[data-wa]").forEach(a=>a.href=waLink(a.dataset.wa));
{const yr=$("#yr");if(yr)yr.textContent=new Date().getFullYear()}

/* navegación */
const menu=$("#menu"),burger=$("#burger"),hd=$("header"),scrim=$("#scrim"),prog=$("#prog");
function setMenu(o){if(o)ld("ig","wa");menu.classList.toggle("open",o);scrim.classList.toggle("on",o);burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Cerrar menú":"Abrir menú");document.body.classList.toggle("lock",o)}
burger.onclick=()=>setMenu(!menu.classList.contains("open"));
scrim.onclick=()=>setMenu(false);
$$("a",menu).forEach(a=>a.addEventListener("click",()=>setMenu(false)));
const mq=matchMedia("(min-width:961px)"),mqf=e=>{if(e.matches)setMenu(false)};mq.addEventListener?mq.addEventListener("change",mqf):mq.addListener(mqf);
const A=$(".art");let sMax=0,tick=0,lastT=-1;
const calc=()=>{sMax=document.documentElement.scrollHeight-innerHeight};calc();
addEventListener("resize",calc,{passive:true});addEventListener("load",calc);
if(window.ResizeObserver)new ResizeObserver(calc).observe(document.body);
const de=document.documentElement;let scrT=0,scrOn=0,ws=null;
function onScroll(){tick=0;const y=scrollY;if(!scrOn){scrOn=1;de.classList.add("scr")}clearTimeout(scrT);scrT=setTimeout(()=>{scrOn=0;de.classList.remove("scr")},140);const sc=y>30;if(sc!==ws){ws=sc;hd.classList.toggle("scrolled",sc)}prog.style.transform="scaleX("+(sMax>0?Math.min(y/sMax,1):0)+")";const t=Math.min(y,700)*.1;if(A&&!REDUCE&&!P.coarse&&t!==lastT){lastT=t;A.style.translate="0 "+t+"px"}}
addEventListener("scroll",()=>{if(!tick){tick=1;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
const links=$$("ul a",menu);
const nav=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle("on",l.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["inicio","esencia","musica","galeria","contratar","contacto"].forEach(i=>nav.observe($("#"+i)));
/* pausa de animaciones continuas fuera de pantalla (CSS: [data-vis="0"]) y con pestaña oculta */
const vo=new IntersectionObserver(es=>es.forEach(e=>e.target.dataset.vis=e.isIntersecting?"1":"0"),{rootMargin:"120px 0px"});
$$("#inicio,.marquee,#esencia,#musica,#galeria,#contratar,#contacto,footer").forEach(n=>vo.observe(n));
document.addEventListener("visibilitychange",()=>document.documentElement.classList.toggle("hid",document.hidden));
/* carga diferida de imágenes de fondo por sección */
const LZ={esencia:["instr"],musica:["mono","banner"],galeria:["hero","banner","instr","donde","circ"],contratar:["donde"],contacto:["ig","wa"],footer:["crown","horiz","ig","wa"]};
const lzo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){ld(...LZ[e.target.id||"footer"]);lzo.unobserve(e.target)}}),{rootMargin:"900px 0px"});
Object.keys(LZ).forEach(k=>lzo.observe($(k==="footer"?"footer":"#"+k)));

/* revelados: títulos, esencia, instrumentos, cobertura */
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}}),{threshold:.12});
$$(".stmt").forEach(h=>{const t=h.textContent.trim();h.setAttribute("aria-label",t);h.innerHTML=t.split(/\s+/).map((x,i)=>`<span class="w" aria-hidden="true" style="--i:${i}">${esc(x)}</span>`).join(" ")});
$$("section h2:not(.stmt)").forEach(h=>h.classList.add("tt"));
$$(".ins,.events span,.cbtn,form,.genre .card,.lead").forEach((n,i)=>{n.classList.add("rv");n.style.transitionDelay=(i%5)*100+"ms"});
$$(".tt,.stmt,.rv,.cov").forEach(n=>ro.observe(n));

/* visor con navegación */
const lb=$("#lb"),lbBody=$("#lbBody"),pv=$(".pv",lb),nx=$(".nx",lb);
let L=[],ix=0;
function ytId(u){const m=String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:u}
function show(list,i){
  L=list;ix=(i+L.length)%L.length;const g=L[ix];let h="";
  if(g.tipo==="foto")h=g.bg?`<div class="big" style="background:${g.bg.includes("--u-donde)")?(ld("donde-xl"),"var(--u-donde-xl) center/"+(g.fit||"cover")+" no-repeat,"+g.bg):g.bg} center/${g.fit||"cover"} no-repeat"></div>`:`<img src="${esc(g.src)}" alt="${esc(g.titulo||"")}">`;
  else if(g.tipo==="youtube")h=`<iframe src="https://www.youtube-nocookie.com/embed/${esc(ytId(g.src))}" allow="encrypted-media; picture-in-picture" allowfullscreen title="${esc(g.titulo||"Video")}"></iframe>`;
  else if(g.tipo==="instagram")h=`<iframe src="${esc(g.src.replace(/\/?$/,"/"))}embed" style="aspect-ratio:9/14;max-height:85vh" title="${esc(g.titulo||"Instagram")}"></iframe>`;
  else h=`<video controls playsinline preload="metadata" ${g.cors?'crossorigin="anonymous"':""} src="${esc(g.src)}"></video>`;
  stopEq();{const o=$("video",lbBody);if(o){o.pause();o.removeAttribute("src");o.load()}}lbBody.innerHTML=h;$("#lbCap").textContent=g.titulo||"";
  pv.hidden=nx.hidden=L.length<2;
  const v=$("video",lbBody);$("#eq2").hidden=!v;if(v)bindAudio(v,g.cors);
  if(!lb.open)lb.showModal();
}
pv.onclick=()=>show(L,ix-1);nx.onclick=()=>show(L,ix+1);
lb.addEventListener("click",e=>{if(e.target===lb||e.target.classList.contains("x"))lb.close()});
lb.addEventListener("close",()=>{const v=$("video",lbBody);if(v){v.pause();v.removeAttribute("src");v.load()}lbBody.innerHTML="";stopEq();if(AC&&AC.state==="running")AC.suspend()});
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);if(lb.open&&L.length>1){if(e.key==="ArrowLeft")show(L,ix-1);if(e.key==="ArrowRight")show(L,ix+1)}});
let tx=0;lbBody.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});
lbBody.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-tx;if(L.length>1&&Math.abs(d)>60)show(L,ix+(d<0?1:-1))},{passive:true});

/* ecualizador: solo se mueve con audio real */
$$(".eqb").forEach(q=>{for(let i=0;i<28;i++)q.append(el("i"))});
let AC,AN,raf;const bound=new WeakSet();
const bars=()=>$$(".eqb i");
function stopEq(){cancelAnimationFrame(raf);bars().forEach(b=>b.style.transform="")}
function bindAudio(v,cors){
  try{
    if(new URL(v.src,location.href).origin!==location.origin&&!cors)return;
    AC=AC||new(window.AudioContext||window.webkitAudioContext)();
    if(!bound.has(v)){AN=AN||AC.createAnalyser();AN.fftSize=128;AC.createMediaElementSource(v).connect(AN);AN.connect(AC.destination);bound.add(v)}
    v.addEventListener("play",()=>{AC.resume();draw(v)});
    v.addEventListener("pause",stopEq);v.addEventListener("ended",stopEq);
  }catch(e){}
}
function draw(v){
  cancelAnimationFrame(raf);const d=new Uint8Array(AN.frequencyBinCount),bs=bars(),n=bs.length/2;
  (function f(){AN.getByteFrequencyData(d);bs.forEach((b,i)=>{b.style.transform=`scaleY(${Math.max(.06,d[Math.floor((i%n)*d.length*.7/n)]/255)})`});
  if(!v.paused&&!v.ended)raf=requestAnimationFrame(f);else stopEq()})();
}

/* videos de música */
const V=$("#vids");
if(!CONFIG.videos.length)V.remove();
CONFIG.videos.forEach((v,i)=>{const th=v.thumb||(v.tipo==="youtube"?`https://i.ytimg.com/vi/${ytId(v.src)}/hqdefault.jpg`:"");
  const b=el("button","vc rv"+(v.vertical?" v":""),`${th?`<span class="gm" style="background-image:url('${esc(th)}')"></span>`:""}<span class="play" aria-hidden="true">▶</span><span class="cap">${esc(v.titulo||"")}</span>`);
  b.setAttribute("aria-label","Reproducir: "+(v.titulo||""));b.onclick=()=>show(CONFIG.videos,i);V.append(b);ro.observe(b)});

/* galería editorial */
const T=$("#tabs"),G=$("#gallery"),SZ=[[3,3],[3,1],[3,2],[2,2],[4,2]];let cat="Todo";
function drawGallery(){
  const cats=[...new Set(CONFIG.galeria.map(g=>g.cat).filter(Boolean))];
  T.innerHTML="";T.hidden=cats.length<2;
  if(cats.length>1)["Todo",...cats].forEach(c=>{const b=el("button","",esc(c));b.setAttribute("aria-pressed",c===cat);b.onclick=()=>{cat=c;drawGallery()};T.append(b)});
  G.innerHTML="";const list=CONFIG.galeria.filter(g=>cat==="Todo"||g.cat===cat);
  list.forEach((g,i)=>{
    const th=g.thumb||(g.tipo==="foto"?g.src:(g.tipo==="youtube"?`https://i.ytimg.com/vi/${ytId(g.src)}/hqdefault.jpg`:""));
    const bg=g.bg||(th?`url('${esc(th)}')`:"none"),[c,r]=SZ[i%SZ.length];
    const b=el("button","gi",`<span class="gm" style="background-image:${bg};${g.fit?"background-size:"+g.fit:""}"></span>${g.tipo!=="foto"?'<span class="play" aria-hidden="true">▶</span>':""}<span class="cap">${esc(g.titulo||"")}</span>`);
    b.style.cssText=`--c:${c};--r:${r};--d:${(i%5)*.12}s`;
    b.setAttribute("aria-label",(g.tipo==="foto"?"Ampliar: ":"Reproducir: ")+(g.titulo||""));
    b.onclick=()=>show(list,i);G.append(b)});
  if(G.dataset.seen)requestAnimationFrame(()=>$$(".gi",G).forEach(x=>x.classList.add("in")));
}
drawGallery();
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){G.dataset.seen=1;$$(".gi",G).forEach(x=>x.classList.add("in"));o.disconnect()}}),{threshold:.1}).observe(G);

/* cobertura */
const C=$("#cov"),openCov=()=>show([{tipo:"foto",bg:"var(--u-donde)",titulo:"Cobertura: Torreón, Gómez Palacio, Lerdo y toda la Comarca Lagunera"}],0);
C.onclick=openCov;C.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openCov()}});

/* ambiente del inicio */
const spot=P.coarse?null:el("div","spot");if(spot){spot.setAttribute("aria-hidden","true");document.body.append(spot)}
const putSpot=(x,y)=>{if(spot)spot.style.transform=`translate3d(${x-520}px,${y-520}px,0)`};putSpot(innerWidth*.5,innerHeight*.3);
if(!REDUCE){
  const NB=$("#notes"),SY=["♪","♫","♬","♩"];
  for(let i=0;i<P.n;i++){const s=el("span","",SY[i%4]);s.style.cssText=`left:${Math.random()*100}%;font-size:${14+Math.random()*22}px;animation-duration:${11+Math.random()*12}s;animation-delay:-${Math.random()*20}s`;NB.append(s)}
  if(matchMedia("(hover:hover) and (pointer:fine)").matches){let px=0,py=0,pt=0;addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;if(!pt){pt=1;requestAnimationFrame(()=>{pt=0;putSpot(px,py)})}},{passive:true})}
}
const TW=$("#tws");[[50,7],[40,17],[63,19],[53,46],[71,33],[30,40],[20,86],[88,60]].slice(0,P.t||8).forEach(([x,y],i)=>{const s=el("i");s.style.cssText=`left:${x}%;top:${y}%;animation-delay:-${i*.9}s;animation-duration:${3.2+i%3}s`;TW.append(s)});

/* formulario → WhatsApp */
$("#quote").addEventListener("submit",e=>{
  e.preventDefault();const f=e.target;let ok=true;
  $$("[required]",f).forEach(i=>{const bad=!i.value.trim(),er=i.parentElement.querySelector(".err");i.setAttribute("aria-invalid",bad);er.textContent=bad?"Completa este campo.":"";if(bad)ok=false});
  if(!ok){$("[aria-invalid=true]",f).focus();return}
  const d=Object.fromEntries(new FormData(f)),[y,m,dd]=d.fecha.split("-");
  window.open(waLink(`Hola, quiero solicitar una cotización con ALTA DINASTÍA.\n\nNombre: ${d.nombre}\nTipo de evento: ${d.tipo}\nFecha: ${dd}/${m}/${y}\nUbicación: ${d.lugar}\nHorario aproximado: ${d.hora||"Por definir"}\nInformación adicional: ${d.extra||"Ninguna"}`),"_blank","noopener");
});
/* música de fondo (Factura): arranca con el primer gesto del usuario.
   Los navegadores bloquean el audio sin interacción; tocar, hacer clic o pulsar una tecla lo desbloquea.
   Girar la rueda o deslizar se intenta también, pero solo funciona donde el navegador lo permite. */
{
  const SRC="audio/factura.mp3",VOL=.7;
  let a=null,want=true,vid=false,hid=false,fade=0;
  try{want=localStorage.getItem("ad-bgm")!=="off"}catch(e){}
  const btn=el("button","","");btn.id="bgm";btn.type="button";
  const svg=p=>`<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const IC_ON=svg('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>');
  const IC_OFF=svg('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6m0-6 6 6"/>');
  const sync=()=>{const on=!!a&&!a.paused;btn.innerHTML=on?IC_ON:IC_OFF;btn.setAttribute("aria-pressed",on);btn.setAttribute("aria-label",on?"Pausar música":"Reproducir música")};
  const get=()=>{if(!a){a=new Audio(SRC);a.loop=true;a.preload="none";a.addEventListener("play",sync);a.addEventListener("pause",sync)}return a};
  const start=()=>{
    const x=get(),p=x.play();
    if(p&&p.then)p.then(()=>{off();clearInterval(fade);x.volume=0;let v=0;fade=setInterval(()=>{v=Math.min(VOL,v+VOL/25);x.volume=v;if(v>=VOL)clearInterval(fade)},60)}).catch(()=>{});
    return p;
  };
  const EV=["pointerdown","pointerup","click","touchend","touchmove","keydown","wheel"];
  const gesture=e=>{if(want&&!btn.contains(e.target))start()};
  const on=()=>EV.forEach(t=>addEventListener(t,gesture,{passive:true,capture:true}));
  const off=()=>EV.forEach(t=>removeEventListener(t,gesture,{capture:true}));
  btn.onclick=()=>{
    if(a&&!a.paused){want=false;a.pause()}else{want=true;start()}
    try{localStorage.setItem("ad-bgm",want?"on":"off")}catch(e){}
  };
  document.body.append(btn);sync();
  if(want){on();start()}   /* si el navegador ya lo permite, suena desde el inicio */
  /* los videos de la galería tienen prioridad: se pausa la música y vuelve al cerrar el visor */
  document.addEventListener("play",e=>{if(e.target.tagName==="VIDEO"&&a&&!a.paused){vid=true;a.pause()}},true);
  lb.addEventListener("close",()=>{if(vid){vid=false;if(want)start()}});
  /* pestaña oculta: en pausa */
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){if(a&&!a.paused){hid=true;a.pause()}}
    else if(hid){hid=false;if(want&&!vid)start()}
  });
}
/* si el perfil baja de nivel en vivo, se retiran partículas sobrantes sin tocar el diseño */
P.on(p=>{$$("#notes span").slice(p.n).forEach(s=>s.remove());$$("#tws i").slice(p.t).forEach(s=>s.remove())});
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
