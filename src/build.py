import re, base64, urllib.parse
from PIL import Image
src = open('src/index.original.html', encoding='utf8').read().replace('\r\n', '\n')
L = src.split('\n')

# --- favicon y versión ligera de la imagen de cobertura ---
fav = re.search(r'href="data:image/png;base64,([^"]+)"', L[12]).group(1)
open('img/favicon.png', 'wb').write(base64.b64decode(fav))
Image.open('/mnt/user-data/uploads/donde.png').convert('RGB').resize((1024, 683), Image.LANCZOS).save('img/donde-s.webp', quality=80, method=6)

# --- CSS ---
rest = open('src/_rest.css', encoding='utf8').read().replace('\r\n', '\n')
rest, k = re.subn(r'\.emblem \.emblem\s*(/\*.*?\*/\s*)?', '', rest, flags=re.S)  # fragmento roto que absorbía la regla siguiente
assert k == 1
rest = re.sub(r'/\*.*?\*/', '', rest, flags=re.S)
rest = re.sub(r'\n\s*\n+', '\n', rest)
mask64 = re.search(r'--u-heromask:url\(data:image/webp;base64,([A-Za-z0-9+/=]+)\)', L[20]).group(1)  # las máscaras CSS exigen CORS: bajo file:// fallarían como archivo
root = ':root{--u-hero:url(img/hero.webp);--u-heromask:url(data:image/webp;base64,' + mask64 + ');--u-iso:url(img/iso.webp);--u-sep1:url(img/sep1.webp);--u-sep2:url(img/sep2.webp)}\n'
open('style.css', 'w', encoding='utf8').write(root + rest + open('src/_opt.css', encoding='utf8').read())

# --- HTML ---
head_meta = '\n'.join(L[0:12])
ld = '\n'.join(L[16:19])
fonts = L[15].split('href="')[1].split('"')[0]
body = '\n'.join(L[402:494])  # <body> ... </footer>
def wa(m):
    t = m.group(1)
    return f'href="https://wa.me/528713596173?text={urllib.parse.quote(t, safe="!\'()*~")}" data-wa="{t}"'
body, k = re.subn(r'data-wa="([^"]*)"', wa, body)
assert k >= 4
html = f'''{head_meta}
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="img/hero.webp" fetchpriority="high">
<link rel="preload" as="style" href="{fonts}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{fonts}"></noscript>
{ld}
<link rel="stylesheet" href="style.css">
<script src="js/perf.js"></script>
</head>
{body}
<script src="js/main.js" defer></script>
</body>
</html>
'''
open('index.html', 'w', encoding='utf8').write(html)

# --- JS (parches sobre el script original) ---
js = '\n'.join(L[497:630])
def rep(a, b):
    global js
    assert js.count(a) == 1, a[:60]
    js = js.replace(a, b)

rep('const REDUCE=matchMedia("(prefers-reduced-motion:reduce)").matches;',
 '''const REDUCE=matchMedia("(prefers-reduced-motion:reduce)").matches;
const P=window.PERF||{n:16,t:8,on(){}};
/* imágenes secundarias: se piden solo al acercarse su sección (var CSS definida bajo demanda) */
const IMG={donde:"donde-s","donde-xl":"donde"},RS=document.documentElement.style,got=new Set();
const ld=(...a)=>a.forEach(k=>{if(!got.has(k)){got.add(k);RS.setProperty("--u-"+k,`url(${new URL(`img/${IMG[k]||k}.webp`,document.baseURI).href})`)}});''')
rep('function setMenu(o){', 'function setMenu(o){if(o)ld("ig","wa");')
rep('matchMedia("(min-width:961px)").addEventListener("change",e=>{if(e.matches)setMenu(false)});',
 'const mq=matchMedia("(min-width:961px)"),mqf=e=>{if(e.matches)setMenu(false)};mq.addEventListener?mq.addEventListener("change",mqf):mq.addListener(mqf);')
i0 = js.index('const A=$(".art");'); i1 = js.index('const links=$$("ul a",menu);')
js = js[:i0] + '''const A=$(".art");let sMax=0,tick=0,lastT=-1;
const calc=()=>{sMax=document.documentElement.scrollHeight-innerHeight};calc();
addEventListener("resize",calc,{passive:true});addEventListener("load",calc);
if(window.ResizeObserver)new ResizeObserver(calc).observe(document.body);
function onScroll(){tick=0;const y=scrollY;hd.classList.toggle("scrolled",y>30);prog.style.transform="scaleX("+(sMax>0?Math.min(y/sMax,1):0)+")";const t=Math.min(y,700)*.1;if(A&&!REDUCE&&t!==lastT){lastT=t;A.style.translate="0 "+t+"px"}}
addEventListener("scroll",()=>{if(!tick){tick=1;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
''' + js[i1:]
rep('[\"inicio\",\"esencia\",\"musica\",\"galeria\",\"contratar\",\"contacto\"].forEach(i=>nav.observe($(\"#\"+i)));',
 '''["inicio","esencia","musica","galeria","contratar","contacto"].forEach(i=>nav.observe($("#"+i)));
/* pausa de animaciones continuas fuera de pantalla (CSS: [data-vis="0"]) y con pestaña oculta */
const vo=new IntersectionObserver(es=>es.forEach(e=>e.target.dataset.vis=e.isIntersecting?"1":"0"),{rootMargin:"120px 0px"});
$$("#inicio,.marquee,#esencia,#musica,#galeria,#contratar,#contacto,footer").forEach(n=>vo.observe(n));
document.addEventListener("visibilitychange",()=>document.documentElement.classList.toggle("hid",document.hidden));
/* carga diferida de imágenes de fondo por sección */
const LZ={esencia:["instr"],musica:["mono","banner"],galeria:["hero","banner","instr","donde","circ"],contratar:["donde"],contacto:["ig","wa"],footer:["crown","horiz","ig","wa"]};
const lzo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){ld(...LZ[e.target.id||"footer"]);lzo.unobserve(e.target)}}),{rootMargin:"900px 0px"});
Object.keys(LZ).forEach(k=>lzo.observe($(k==="footer"?"footer":"#"+k)));''')
rep('h=g.bg?`<div class="big" style="background:${g.bg} center/${g.fit||"cover"} no-repeat"></div>`',
 'h=g.bg?`<div class="big" style="background:${g.bg.includes("--u-donde)")?(ld("donde-xl"),"var(--u-donde-xl) center/"+(g.fit||"cover")+" no-repeat,"+g.bg):g.bg} center/${g.fit||"cover"} no-repeat"></div>`')
rep('stopEq();lbBody.innerHTML=h;', 'stopEq();{const o=$("video",lbBody);if(o){o.pause();o.removeAttribute("src");o.load()}}lbBody.innerHTML=h;')
rep('lb.addEventListener("close",()=>{lbBody.innerHTML="";stopEq()});',
 'lb.addEventListener("close",()=>{const v=$("video",lbBody);if(v){v.pause();v.removeAttribute("src");v.load()}lbBody.innerHTML="";stopEq();if(AC&&AC.state==="running")AC.suspend()});')
i0 = js.index('if(!REDUCE){\n  const NB'); i1 = js.index('const TW=$("#tws");')
js = js[:i0] + '''const spot=el("div","spot");spot.setAttribute("aria-hidden","true");document.body.append(spot);
const putSpot=(x,y)=>{spot.style.transform=`translate3d(${x-520}px,${y-520}px,0)`};putSpot(innerWidth*.5,innerHeight*.3);
if(!REDUCE){
  const NB=$("#notes"),SY=["♪","♫","♬","♩"];
  for(let i=0;i<P.n;i++){const s=el("span","",SY[i%4]);s.style.cssText=`left:${Math.random()*100}%;font-size:${14+Math.random()*22}px;animation-duration:${11+Math.random()*12}s;animation-delay:-${Math.random()*20}s`;NB.append(s)}
  if(matchMedia("(hover:hover) and (pointer:fine)").matches){let px=0,py=0,pt=0;addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;if(!pt){pt=1;requestAnimationFrame(()=>{pt=0;putSpot(px,py)})}},{passive:true})}
}
''' + js[i1:]
rep('[[50,7],[40,17],[63,19],[53,46],[71,33],[30,40],[20,86],[88,60]].forEach(', '[[50,7],[40,17],[63,19],[53,46],[71,33],[30,40],[20,86],[88,60]].slice(0,P.t||8).forEach(')
js += '''
/* si el perfil baja de nivel en vivo, se retiran partículas sobrantes sin tocar el diseño */
P.on(p=>{$$("#notes span").slice(p.n).forEach(s=>s.remove());$$("#tws i").slice(p.t).forEach(s=>s.remove())});
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
'''
open('js/main.js', 'w', encoding='utf8').write(js)
print('ok')
