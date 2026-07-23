/* =============================================================================
   K&S VALLEY — explorable isometric world.
   Overworld: a detailed Silicon-Valley tech campus (streets, blocks, parking,
   landscaping, distinct buildings). Countries are gateways around the campus.
   Drill into a country: a 3D relief map of the real outline with pinned places.
   Click a place: its story opens in an in-world panel. Eggs reveal images.
   ========================================================================== */
(function () {
  const svg = document.getElementById('world');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const XLINK = 'http://www.w3.org/1999/xlink';
  const VB_W = 1360, VB_H = 900;
  svg.setAttribute('viewBox', '0 0 ' + VB_W + ' ' + VB_H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const cam = mk('g'); svg.appendChild(cam);
  const groundG = mk('g'), worldG = mk('g');
  cam.appendChild(groundG); cam.appendChild(worldG);

  const TW = 42, TH = 21, OX = 680, OY = 260;
  function iso(gx, gy) { return [OX + (gx - gy) * TW, OY + (gx + gy) * TH]; }
  function mk(t) { return document.createElementNS(NS, t); }
  function hexRgb(h) { h = h.replace('#',''); if (h.length===3) h=h.split('').map(c=>c+c).join(''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function shade(hex, a) { const c = hexRgb(hex).map(v => Math.max(0, Math.min(255, v + a))); return 'rgb(' + c.join(',') + ')'; }
  function poly(pts, fill, stroke, sw) {
    const p = mk('polygon');
    p.setAttribute('points', pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '));
    p.setAttribute('fill', fill);
    if (stroke) { p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', sw || 1); p.setAttribute('stroke-linejoin','round'); }
    return p;
  }
  function lerp(a, b, t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }
  function bil(q, u, v) { return lerp(lerp(q[0],q[1],u), lerp(q[3],q[2],u), v); } // q=[bl,br,tr,tl]

  const PLACES = window.PLACES, CATS = window.CATEGORIES;
  const byCountry = {};
  PLACES.forEach(p => { (byCountry[p.country] = byCountry[p.country] || []).push(p); });

  const COUNTRY = {
    'India':  { flag: '🇮🇳', color: '#ff9933', ride: '🕌' },
    'USA':    { flag: '🇺🇸', color: '#3b6fd4', ride: '🎢' },
    'Canada': { flag: '🇨🇦', color: '#e34b4b', ride: '🎡' },
    'Mexico': { flag: '🇲🇽', color: '#2fa35a', ride: '🎠' }
  };
  const ORDER = ['India', 'USA', 'Canada', 'Mexico'].filter(c => byCountry[c]);

  const OUTLINES = {
    USA: [[-124.5,48.4],[-124,40],[-120.5,34.6],[-117.1,32.5],[-114.6,32.7],[-111,31.3],[-108,31.3],[-106.5,31.8],[-103,29],[-99.5,27.5],[-97.4,25.9],[-94,29.6],[-90,29.1],[-88,30.3],[-84,30],[-81.5,25.9],[-80.1,26.8],[-81,31],[-76.5,34.6],[-75,38],[-74,40.5],[-70.8,41.6],[-70,43.7],[-67,44.8],[-69.2,47.4],[-71.5,45],[-76.9,43.2],[-82.5,41.7],[-83.4,45.8],[-87.6,45.1],[-90,46.7],[-95,49],[-104,49],[-123,49]],
    India: [[77,35.5],[80,34],[81,30.4],[88.2,27.9],[89,26],[92,25],[95.2,27],[94,24],[92.8,22],[89,21.8],[87,21],[85,19.7],[82.5,17],[80.3,13.1],[79.8,10.3],[77.5,8.1],[76,9.5],[74.8,13],[73,16],[72.8,19.1],[70,21],[68.8,23.7],[70,24.5],[74,30],[76,32],[78,34.5]],
    Canada: [[-123,49],[-95,49],[-82,42],[-79,43],[-74,45],[-69.5,47],[-64,46],[-60,47],[-64,50.5],[-79,53],[-95,53],[-123,53]],
    Mexico: [[-117,32.5],[-108,31.3],[-103,29],[-97.4,25.9],[-97.2,20.5],[-94,18.2],[-90.5,21],[-86.8,21.4],[-88,18.5],[-92,14.5],[-96,15.6],[-104,19.5],[-110,23.5],[-114,28.5]]
  };

  const EGGDATA = {
    piper:   { emoji: '🥧', title: 'Pied Piper', quote: 'Our scrappy little startup — the best compression algorithm just squeezes 4 years and 36 destinations into one map.' },
    robot:   { emoji: '🤖', title: 'Fiona', quote: 'The "companion" robot. Deeply unsettling — yet still less complicated than dating was before I met you.' },
    painting:{ emoji: '🖼️', title: 'The Painting', quote: 'That infamous mural — briefly worth more than the whole company. Our memories, though? Priceless, and not for sale.', asset: 'assets/painting.jpg' },
    jacket:  { emoji: '🧥', title: "Jared's Jacket", quote: 'Folded with love and left behind. We just fold ours into a carry-on and go somewhere new.', asset: 'assets/jacket.jpg' },
    commas:  { emoji: '🍾', title: 'Tres Commas', quote: 'Three commas = a billion dollars — and roughly the number of reasons I love you.', asset: 'assets/tres-commas.jpg' },
    anton:   { emoji: '🖥️', title: 'Anton', quote: 'Anton is back online. Uptime since 2022. Zero downtime, zero regrets.' },
    middleout:{ emoji: '📦', title: 'Middle-Out', quote: 'Peak efficiency, discovered... creatively. Weissman score: 5.2. (iykyk)' },
    hotdog:  { emoji: '🌭', title: 'Not Hotdog', quote: 'SeeFood™ says: 🌭 → HOTDOG ✅ (it only knows two things, much like me before I met you).' }
  };

  /* ===================== campus ground ===================== */
  function tileDiamond(gx, gy) { const c = iso(gx, gy); return [[c[0],c[1]-TH],[c[0]+TW,c[1]],[c[0],c[1]+TH],[c[0]-TW,c[1]]]; }
  function paintGround(N) {
    for (let gx = 0; gx <= N; gx++) for (let gy = 0; gy <= N; gy++) {
      const road = (gx % 5 === 0) || (gy % 5 === 0);
      const grass = !road && (gx % 5 === 4 || gy % 5 === 4);
      let fill = road ? '#4b525d' : grass ? '#6fae5a' : '#c9ced6';
      const d = tileDiamond(gx, gy);
      groundG.appendChild(poly(d, fill, 'rgba(18,35,59,0.05)'));
      if (road) {
        // faint center dash
        const c = iso(gx, gy);
        const dash = mk('line');
        if (gx % 5 === 0 && gy % 5 !== 0) { dash.setAttribute('x1', c[0]-4); dash.setAttribute('y1', c[1]-2); dash.setAttribute('x2', c[0]+4); dash.setAttribute('y2', c[1]+2); }
        else { dash.setAttribute('x1', c[0]-4); dash.setAttribute('y1', c[1]+2); dash.setAttribute('x2', c[0]+4); dash.setAttribute('y2', c[1]-2); }
        dash.setAttribute('stroke', 'rgba(255,220,120,0.5)'); dash.setAttribute('stroke-width', '2');
        groundG.appendChild(dash);
      }
    }
  }

  /* ===================== buildings ===================== */
  function windows(g, q, cols, rows, col) {
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const u0 = (i+0.16)/cols, u1 = (i+0.84)/cols, v0 = (j+0.18)/rows, v1 = (j+0.82)/rows;
      g.appendChild(poly([bil(q,u0,v0), bil(q,u1,v0), bil(q,u1,v1), bil(q,u0,v1)], col));
    }
  }
  function miniBox(cx, cy, s, hh, col) {
    const g = mk('g');
    const A=[cx,cy-s*0.5], B=[cx+s,cy], C=[cx,cy+s*0.5], D=[cx-s,cy], up=p=>[p[0],p[1]-hh];
    g.appendChild(poly([C,D,up(D),up(C)], shade(col,-30)));
    g.appendChild(poly([B,C,up(C),up(B)], shade(col,-12)));
    g.appendChild(poly([up(A),up(B),up(C),up(D)], shade(col,16)));
    return g;
  }
  // one extruded volume; returns { g, top:[At,Bt,Ct,Dt] }
  function volume(gx, gy, fx, fy, baseH, h, color, glass) {
    const g = mk('g');
    const A=iso(gx,gy), B=iso(gx+fx,gy), C=iso(gx+fx,gy+fy), D=iso(gx,gy+fy);
    const dn=p=>[p[0],p[1]-baseH], up=p=>[p[0],p[1]-baseH-h];
    const Ab=dn(A),Bb=dn(B),Cb=dn(C),Db=dn(D), At=up(A),Bt=up(B),Ct=up(C),Dt=up(D);
    const rightFace=[Bb,Cb,Ct,Bt], leftFace=[Cb,Db,Dt,Ct], topFace=[At,Bt,Ct,Dt];
    g.appendChild(poly(leftFace, shade(color,-40), 'rgba(18,35,59,0.16)'));
    g.appendChild(poly(rightFace, shade(color,-16), 'rgba(18,35,59,0.16)'));
    g.appendChild(poly(topFace, shade(color,16), 'rgba(18,35,59,0.16)'));
    const wc = glass || 'rgba(255,255,255,0.20)';
    windows(g, rightFace, Math.max(2, Math.round(fx*1.6)), Math.max(2, Math.round(h/22)), wc);
    windows(g, leftFace,  Math.max(2, Math.round(fy*1.6)), Math.max(2, Math.round(h/22)), 'rgba(255,255,255,0.10)');
    return { g: g, top: [At,Bt,Ct,Dt] };
  }
  function roofDetails(g, top, color) {
    const cx = (top[0][0]+top[2][0])/2, cy = (top[0][1]+top[2][1])/2;
    g.appendChild(miniBox(cx-10, cy+3, 6, 7, shade(color,-6)));
    g.appendChild(miniBox(cx+12, cy-2, 5, 9, shade(color,-6)));
  }
  function signNode(cx, cy, name, slug) {
    const g = mk('g');
    const w = Math.max(name.length * 6.6 + 12, 46), hh = 18;
    const r = mk('rect'); r.setAttribute('x', cx-w/2); r.setAttribute('y', cy-hh); r.setAttribute('width', w); r.setAttribute('height', hh); r.setAttribute('rx', 4);
    r.setAttribute('fill', '#fff'); r.setAttribute('stroke', 'rgba(18,35,59,0.25)'); r.setAttribute('stroke-width', '1.5');
    const t = mk('text'); t.setAttribute('x', cx); t.setAttribute('y', cy-hh/2); t.setAttribute('text-anchor','middle'); t.setAttribute('font-family',"'Poppins',sans-serif"); t.setAttribute('font-size','11'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#14243a'); t.setAttribute('style','dominant-baseline:central'); t.textContent = name;
    g.appendChild(r); g.appendChild(t);
    if (slug) {
      const im = mk('image');
      const src = 'assets/logos/' + slug + '.png';
      im.setAttribute('href', src); im.setAttributeNS(XLINK, 'href', src);
      im.setAttribute('x', cx-w/2+2); im.setAttribute('y', cy-hh+1); im.setAttribute('width', w-4); im.setAttribute('height', hh-2);
      im.setAttribute('preserveAspectRatio','xMidYMid meet');
      im.setAttribute('onerror', 'this.remove()');
      g.appendChild(im);
    }
    return g;
  }
  // build a whole building group by archetype; returns {g, cx, top}
  function building(b) {
    const g = mk('g');
    const color = b.color, glass = b.glass;
    let top;
    if (b.arch === 'setback') {
      const v1 = volume(b.gx, b.gy, b.fx, b.fy, 0, b.h*0.55, color, glass); g.appendChild(v1.g);
      const v2 = volume(b.gx+0.6, b.gy+0.6, b.fx-1.2, b.fy-1.2, b.h*0.55, b.h*0.45, color, glass); g.appendChild(v2.g);
      roofDetails(g, v2.top, color); top = v2.top;
    } else if (b.arch === 'podium') {
      const v1 = volume(b.gx, b.gy, b.fx, b.fy, 0, b.h*0.28, shade(color,10), glass); g.appendChild(v1.g);
      const tw = Math.max(1, b.fx-1.4);
      const v2 = volume(b.gx+(b.fx-tw)/2, b.gy+(b.fy-tw)/2, tw, tw, b.h*0.28, b.h*0.72, color, glass); g.appendChild(v2.g);
      roofDetails(g, v2.top, color); top = v2.top;
    } else {
      const v = volume(b.gx, b.gy, b.fx, b.fy, 0, b.h, color, glass); g.appendChild(v.g);
      roofDetails(g, v.top, color); top = v.top;
    }
    const cx = (top[0][0]+top[2][0])/2, cyTop = Math.min(top[0][1],top[1][1],top[2][1],top[3][1]);
    g.appendChild(signNode(cx, cyTop - 6, b.name, b.slug));
    return { g: g, depth: b.gx + b.gy + (b.fx+b.fy)/2 };
  }

  /* trees / cars */
  function tree(cx, cy) {
    const g = mk('g');
    const tr = mk('rect'); tr.setAttribute('x', cx-1.5); tr.setAttribute('y', cy-6); tr.setAttribute('width',3); tr.setAttribute('height',8); tr.setAttribute('fill','#7a5230'); g.appendChild(tr);
    [[0,-12,7,'#3f8f43'],[-4,-9,6,'#4aa04e'],[4,-9,6,'#4aa04e']].forEach(o=>{ const c=mk('circle'); c.setAttribute('cx',cx+o[0]); c.setAttribute('cy',cy+o[1]); c.setAttribute('r',o[2]); c.setAttribute('fill',o[3]); g.appendChild(c); });
    return g;
  }
  function car(cx, cy, col) {
    const g = mk('g');
    const b = mk('rect'); b.setAttribute('x',cx-9); b.setAttribute('y',cy-5); b.setAttribute('width',18); b.setAttribute('height',9); b.setAttribute('rx',3); b.setAttribute('fill',col); b.setAttribute('stroke','rgba(0,0,0,0.2)'); g.appendChild(b);
    const w=mk('rect'); w.setAttribute('x',cx-4); w.setAttribute('y',cy-4); w.setAttribute('width',9); w.setAttribute('height',5); w.setAttribute('rx',1.5); w.setAttribute('fill','rgba(255,255,255,0.55)'); g.appendChild(w);
    return g;
  }

  /* theme-park style country gate */
  function portalNode(gx, gy, country) {
    const g = mk('g'), m = COUNTRY[country], c = iso(gx, gy), cx = c[0], cy = c[1];
    g.appendChild(poly([[cx,cy-TH*1.7],[cx+TW*1.7,cy+6],[cx,cy+TH*1.7+6],[cx-TW*1.7,cy+6]], shade(m.color,42), 'rgba(18,35,59,0.2)'));
    g.appendChild(poly([[cx,cy-TH*1.7],[cx+TW*1.7,cy+6],[cx,cy+TH*1.7],[cx-TW*1.7,cy+6]], m.color, 'rgba(18,35,59,0.22)'));
    const ah = 50, half = 46, pw = 9;
    [-1,1].forEach(s => { const r = mk('rect'); r.setAttribute('x', cx+s*half-pw/2); r.setAttribute('y', cy-ah); r.setAttribute('width', pw); r.setAttribute('height', ah); r.setAttribute('rx',3); r.setAttribute('fill', shade(m.color,-40)); g.appendChild(r); });
    const ban = mk('rect'); ban.setAttribute('x', cx-half-5); ban.setAttribute('y', cy-ah-18); ban.setAttribute('width', (half+5)*2); ban.setAttribute('height', 22); ban.setAttribute('rx',6); ban.setAttribute('fill','#fff'); ban.setAttribute('stroke', shade(m.color,-30)); ban.setAttribute('stroke-width','2'); g.appendChild(ban);
    const bt = mk('text'); bt.setAttribute('x', cx); bt.setAttribute('y', cy-ah-7); bt.setAttribute('text-anchor','middle'); bt.setAttribute('font-family',"'Poppins',sans-serif"); bt.setAttribute('font-size','13'); bt.setAttribute('font-weight','800'); bt.setAttribute('fill', shade(m.color,-70)); bt.setAttribute('style','dominant-baseline:central'); bt.textContent = country + ' · ' + byCountry[country].length; g.appendChild(bt);
    const ride = mk('text'); ride.setAttribute('x', cx); ride.setAttribute('y', cy-6); ride.setAttribute('text-anchor','middle'); ride.setAttribute('font-size','34'); ride.setAttribute('style','dominant-baseline:central'); ride.textContent = m.ride; g.appendChild(ride);
    const fl = mk('text'); fl.setAttribute('x', cx+half); fl.setAttribute('y', cy-ah-4); fl.setAttribute('text-anchor','middle'); fl.setAttribute('font-size','20'); fl.setAttribute('style','dominant-baseline:central'); fl.textContent = m.flag; g.appendChild(fl);
    return g;
  }

  function spriteNode(gx, gy, emoji, size, float) {
    const g = mk('g'), c = iso(gx, gy), fy = c[1] + (float || 4);
    const hit = mk('circle'); hit.setAttribute('cx', c[0]); hit.setAttribute('cy', fy); hit.setAttribute('r', size*0.8); hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all'); g.appendChild(hit);
    const t = mk('text'); t.setAttribute('x', c[0]); t.setAttribute('y', fy); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size', size); t.setAttribute('style','dominant-baseline:central'); t.textContent = emoji; g.appendChild(t);
    return g;
  }

  /* ===================== overworld ===================== */
  function buildOverworld() {
    const N = 15;
    paintGround(N);
    const items = []; // {depth, g, act, tip}

    // decorations: trees along grass strips, cars in a couple lots
    for (let gx = 0; gx <= N; gx++) for (let gy = 0; gy <= N; gy++) {
      if ((gx % 5 === 4 || gy % 5 === 4) && (gx % 5 !== 0 && gy % 5 !== 0)) {
        if ((gx + gy) % 3 === 0) { const c = iso(gx, gy); items.push({ depth: gx+gy-0.1, g: tree(c[0], c[1]) }); }
      }
    }
    [['2,4','#d64545'],['3,4','#4571d6'],['7,4','#e0a030'],['8,4','#3aa35a'],['12,9','#8a4fd6'],['13,9','#d64590']].forEach(p=>{ const [k,col]=p; const [gx,gy]=k.split(',').map(Number); const c=iso(gx,gy); items.push({depth:gx+gy-0.1, g:car(c[0],c[1],col)}); });

    // buildings (real names; logos load from assets/logos/<slug>.png if present)
    const B = [
      { gx:1, gy:1, fx:3, fy:3, h:150, color:'#2f6fd0', glass:'rgba(180,220,255,0.35)', name:'Hooli', slug:'hooli', arch:'tower', quip:'Making the world a better place. (We beat them to it.)' },
      { gx:6, gy:1, fx:4, fy:3, h:58,  color:'#3b5998', name:'Facebook', slug:'facebook', arch:'low', quip:'Move fast. Collect memories.' },
      { gx:11,gy:1, fx:3, fy:3, h:150, color:'#c74634', name:'Oracle', slug:'oracle', arch:'setback', quip:'Enterprise-grade romance since 2022.' },
      { gx:1, gy:6, fx:3, fy:3, h:132, color:'#ff3b30', name:'YouTube', slug:'youtube', arch:'podium', quip:'Now streaming: our home movies.' },
      { gx:6, gy:6, fx:4, fy:4, h:184, color:'#22c07a', glass:'rgba(200,255,225,0.4)', name:'PIED PIPER HQ', arch:'tower', hq:true },
      { gx:11,gy:6, fx:4, fy:3, h:56,  color:'#4285F4', name:'Google', slug:'google', arch:'low', quip:'We indexed every place we\'ve been.' },
      { gx:1, gy:11,fx:3, fy:3, h:98,  color:'#1da1f2', name:'Twitter', slug:'twitter', arch:'tower', quip:'280 characters can\'t hold this story.' },
      { gx:6, gy:11,fx:3, fy:3, h:76,  color:'#b81d24', name:'Netflix', slug:'netflix', arch:'tower', quip:'Are you still watching... our adventures?' },
      { gx:11,gy:11,fx:4, fy:4, h:50,  color:'#b9bec8', glass:'rgba(255,255,255,0.3)', name:'Apple', slug:'apple', arch:'low', quip:'Designed in K&S Valley.' },
      // secondaries
      { gx:9, gy:6, fx:1, fy:2, h:70,  color:'#a06bff', name:'TRACTION', arch:'tower', stats:true },
      { gx:4, gy:1, fx:1, fy:2, h:48,  color:'#25d366', name:'WhatsApp', slug:'whatsapp', arch:'tower', quip:'Read receipts on since day one. 💚' },
      { gx:9, gy:1, fx:1, fy:2, h:62,  color:'#0b0b0b', name:'Uber', slug:'uber', arch:'tower', quip:'Your ride to everywhere, together.' },
      { gx:4, gy:11,fx:1, fy:2, h:52,  color:'#ff2fa0', name:'Lyft', slug:'lyft', arch:'tower', quip:'Pink mustache, big adventures.' },
      { gx:9, gy:11,fx:1, fy:2, h:46,  color:'#232f3e', name:'Amazon', slug:'amazon', arch:'tower', quip:'One-day shipping to your heart.' }
    ];
    B.forEach(b => {
      const built = building(b);
      const act = b.hq ? openMessage : b.stats ? openStats : (function(name,quip){ return () => KNS.toast('🏢 ' + name, quip || 'Definitely making the world a better place. 🚀'); })(b.name, b.quip);
      items.push({ depth: built.depth, g: built.g, act: act, tip: b.hq ? 'open the birthday launch 🎂' : b.stats ? 'the numbers →' : b.name });
    });

    // country gateways around the campus
    const gates = { India:[7,-3], USA:[18,7], Canada:[-3,7], Mexico:[7,18] };
    ORDER.forEach(country => { const p = gates[country] || [7,-3]; items.push({ depth: p[0]+p[1], g: portalNode(p[0], p[1], country), act: (function(c){ return () => showScene(c); })(country), tip: 'enter ' + country + ' 🎢' }); });

    // easter eggs
    const eggs = [ ['piper',7,7,-150],['robot',9,9,0],['painting',4,9,0],['jacket',4,6,0],['commas',13,6,0],['anton',9,4,0],['middleout',6,9,0],['hotdog',4,4,0] ];
    eggs.forEach(e => { items.push({ depth: e[1]+e[2]+2, g: spriteNode(e[1], e[2], EGGDATA[e[0]].emoji, 22, e[3]), act: (function(id){ return () => revealEgg(id); })(e[0]), tip: 'a curious thing…' }); });

    // paint in depth order + wire interactivity
    items.sort((a,b) => a.depth - b.depth);
    items.forEach(it => {
      if (it.act) { it.g.setAttribute('class','wobj'); it.g.setAttribute('data-i','1'); it.g.__act = { act: it.act }; if (it.tip) attachTip(it.g, it.tip); }
      worldG.appendChild(it.g);
    });
  }

  /* ===================== 3D country relief map ===================== */
  function renderCountryMap(country) {
    const outline = OUTLINES[country], places = byCountry[country], m = COUNTRY[country];
    let minL=Infinity,maxL=-Infinity,minA=Infinity,maxA=-Infinity;
    outline.forEach(pt => { minL=Math.min(minL,pt[0]); maxL=Math.max(maxL,pt[0]); minA=Math.min(minA,pt[1]); maxA=Math.max(maxA,pt[1]); });
    const S = 820 / (maxL - minL), tilt = 0.66, T = 30;
    const proj = (lng,lat) => [ (lng-minL)*S, (maxA-lat)*S*tilt ];
    const top = outline.map(pt => proj(pt[0], pt[1])), bot = top.map(p => [p[0], p[1]+T]);
    const xs = top.map(p=>p[0]), ys = top.map(p=>p[1]);
    const bb = { minx:Math.min.apply(null,xs), maxx:Math.max.apply(null,xs), miny:Math.min.apply(null,ys), maxy:Math.max.apply(null,ys) };
    const sh = mk('ellipse'); sh.setAttribute('cx',(bb.minx+bb.maxx)/2); sh.setAttribute('cy', bb.maxy+T+16); sh.setAttribute('rx',(bb.maxx-bb.minx)/2*0.92); sh.setAttribute('ry',18); sh.setAttribute('fill','rgba(18,35,59,0.16)'); worldG.appendChild(sh);
    worldG.appendChild(poly(bot, shade(m.color,-55), 'rgba(18,35,59,0.28)'));
    worldG.appendChild(poly(top, shade(m.color,10), 'rgba(18,35,59,0.4)'));
    places.forEach(p => {
      let x = (p.coords[1]-minL)*S, y = (maxA-p.coords[0])*S*tilt;
      x = Math.max(bb.minx+12, Math.min(bb.maxx-12, x)); y = Math.max(bb.miny+10, Math.min(bb.maxy-6, y));
      const g = mk('g'); g.setAttribute('class','wobj'); g.setAttribute('data-i','1'); g.__act = { act: () => openPlace(p) };
      const hit = mk('circle'); hit.setAttribute('cx',x); hit.setAttribute('cy',y); hit.setAttribute('r',18); hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all'); g.appendChild(hit);
      const stem = mk('line'); stem.setAttribute('x1',x); stem.setAttribute('y1',y); stem.setAttribute('x2',x); stem.setAttribute('y2',y-16); stem.setAttribute('stroke', shade(m.color,-60)); stem.setAttribute('stroke-width','2'); g.appendChild(stem);
      const dot = mk('circle'); dot.setAttribute('cx',x); dot.setAttribute('cy',y-22); dot.setAttribute('r',12); dot.setAttribute('fill','#fff'); dot.setAttribute('stroke', shade(m.color,-40)); dot.setAttribute('stroke-width','2.5'); g.appendChild(dot);
      const t = mk('text'); t.setAttribute('x',x); t.setAttribute('y',y-22); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','15'); t.setAttribute('style','dominant-baseline:central'); t.textContent = p.emoji; g.appendChild(t);
      attachTip(g, p.name + ' · ' + p.date);
      worldG.appendChild(g);
    });
  }

  /* ===================== tooltip ===================== */
  let tip;
  function attachTip(el, text) {
    el.addEventListener('pointerenter', () => { if (!tip) { tip = document.createElement('div'); tip.className = 'wtip'; document.body.appendChild(tip); } tip.textContent = text; tip.classList.add('show'); });
    el.addEventListener('pointermove', e => { if (tip) { tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; } });
    el.addEventListener('pointerleave', () => { if (tip) tip.classList.remove('show'); });
  }

  /* ===================== scenes ===================== */
  let currentScene = 'overworld';
  const titleEl = document.getElementById('scene-title'), crumbEl = document.getElementById('breadcrumb'), backBtn = document.getElementById('valley-back');
  function clearScene() { groundG.textContent = ''; worldG.textContent = ''; }
  function showScene(id) {
    currentScene = id; clearScene();
    if (id === 'overworld') { buildOverworld(); titleEl.innerHTML = 'K&amp;S Valley 🥧'; crumbEl.textContent = 'drag to explore · enter a country · find the secrets'; backBtn.hidden = true; }
    else { renderCountryMap(id); titleEl.textContent = id + ' ' + (COUNTRY[id] ? COUNTRY[id].flag : ''); crumbEl.textContent = 'K&S Valley › ' + id + ' · tap a pin'; backBtn.hidden = false; }
    fitScene();
    if (window.KNS && window.KNS.rescan) window.KNS.rescan();
  }
  backBtn.addEventListener('click', () => showScene('overworld'));

  /* ===================== panels ===================== */
  const panel = document.getElementById('panel'), panelBody = document.getElementById('panel-body');
  document.getElementById('panel-close').addEventListener('click', closePanel);
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  function openPanel(html) { panelBody.innerHTML = html; panel.hidden = false; panel.classList.add('open'); panelBody.parentElement.scrollTop = 0; }
  function closePanel() { panel.classList.remove('open'); panel.hidden = true; }

  function revealEgg(id) {
    const e = EGGDATA[id];
    const img = e.asset ? '<img class="egg-img" src="' + e.asset + '" alt="' + e.title + '" onerror="this.remove();var f=document.getElementById(\'egg-fb\');if(f)f.style.display=\'flex\'">' : '';
    const fb = '<div id="egg-fb" class="egg-fb"' + (e.asset ? ' style="display:none"' : '') + '><div class="egg-fb-emoji">' + e.emoji + '</div>' + (e.asset ? '<div class="egg-fb-note">drop the real still at <b>' + e.asset + '</b> and it appears here</div>' : '') + '</div>';
    openPanel('<div class="egg-reveal"><h2 class="panel-h">🥚 ' + e.title + '</h2>' + img + fb + '<p class="egg-quote">' + e.quote + '</p></div>');
    if (window.KNS && window.KNS.collect) window.KNS.collect(id);
  }
  function openMessage() { const tpl = document.getElementById('tpl-message'); panelBody.innerHTML = ''; panelBody.appendChild(tpl.content.cloneNode(true)); panel.hidden = false; panel.classList.add('open'); panelBody.parentElement.scrollTop = 0; }

  function openPlace(p) {
    const idx = PLACES.indexOf(p), list = byCountry[p.country], li = list.indexOf(p);
    const coords = p.coords[0].toFixed(3) + '°, ' + p.coords[1].toFixed(3) + '°';
    const utc = Math.round(p.coords[1]/15), utcS = 'UTC' + (utc>=0?'+'+utc:utc);
    const prev = PLACES[idx-1], leg = prev ? Math.round(window.haversineMiles(prev.coords, p.coords)) : 0;
    const cat = (CATS[p.category]||{}).label || p.category;
    let photos;
    if (p.photos && p.photos.length) photos = p.photos.map(f => '<img loading="lazy" src="photos/' + p.id + '/' + f + '" alt="' + p.name + '">').join('');
    else { const ph = '<div class="photo-placeholder"><div class="big">📷</div>drop photos in<br><b>photos/' + p.id + '/</b></div>'; photos = ph + ph; }
    const nav = (li>0 ? '<button class="pd-navb" data-go="' + list[li-1].id + '">← ' + list[li-1].name + '</button>' : '<span></span>') +
                (li<list.length-1 ? '<button class="pd-navb next" data-go="' + list[li+1].id + '">' + list[li+1].name + ' →</button>' : '<span></span>');
    openPanel('<div class="pd"><div class="pd-emoji">' + p.emoji + '</div><h2>' + p.name + '</h2>' +
      '<div class="pd-meta">' + p.date + ' · ' + coords + '</div>' +
      '<div class="badges"><span class="badge">stop <b>#' + (idx+1) + '</b>/' + PLACES.length + '</span><span class="badge">' + p.region + '</span><span class="badge">' + cat + '</span><span class="badge">tz <b>' + utcS + '</b></span>' +
      (prev ? '<span class="badge"><b>' + leg.toLocaleString() + '</b> mi from prev</span>' : '<span class="badge">the beginning ✦</span>') + '</div>' +
      '<div class="memory-card">' + escapeHtml(p.memory) + '</div><div class="gallery">' + photos + '</div><div class="pd-nav">' + nav + '</div></div>');
    panelBody.querySelectorAll('.pd-navb').forEach(b => b.addEventListener('click', () => { const np = PLACES.find(x=>x.id===b.getAttribute('data-go')); if (np) openPlace(np); }));
    panelBody.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => window.open(img.src,'_blank')));
  }

  function openStats() {
    const countries = new Set(PLACES.map(p=>p.country)), regions = new Set(PLACES.map(p=>p.region));
    const parks = PLACES.reduce((s,p)=>s+(p.nationalParks||0),0);
    const years = new Date().getFullYear() - parseInt(PLACES[0].sort.slice(0,4),10);
    const miles = Math.floor(window.totalJourneyMiles/100)*100;
    const counts = {}; PLACES.forEach(p=>{ const y=p.sort.slice(0,4); counts[y]=(counts[y]||0)+1; });
    const yrs = Object.keys(counts).sort(), max = Math.max.apply(null, yrs.map(y=>counts[y]));
    const cards = [[PLACES.length,'Markets Entered'],[countries.size,'Global Reach'],[parks+'+','Parks Shipped'],[regions.size+'+','Regions Scaled'],[years+'+','Runway (yrs)'],[miles.toLocaleString()+'+','Distance (mi)']]
      .map(c=>'<div class="stat"><div class="num">'+c[0]+'</div><div class="label">'+c[1]+'</div></div>').join('');
    const bars = yrs.map(y=>'<div class="chart-col"><div class="chart-bar" style="height:'+(counts[y]/max*100)+'%"><span class="cval">'+counts[y]+'</span></div><div class="chart-year">'+y+'</div></div>').join('');
    openPanel('<h2 class="panel-h">Traction 📈</h2><div class="stats compact">'+cards+'</div><h3 class="panel-h3">Hockey-Stick Growth</h3><div class="chart">'+bars+'</div>');
  }

  function escapeHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ===================== interaction ===================== */
  svg.addEventListener('click', ev => { if (suppressClick) return; const el = ev.target.closest('[data-i]'); if (el && el.__act && typeof el.__act.act === 'function') el.__act.act(); });

  let tx=0, ty=0, scale=1, minS=0.3, maxS=2.6, dragging=false, moved=false, sx=0, sy=0, suppressClick=false;
  function apply() { cam.setAttribute('transform','translate('+tx+','+ty+') scale('+scale+')'); }
  function fitScene() { const bb = worldG.getBBox(), pad = 70; scale = Math.max(minS, Math.min(maxS, Math.min(VB_W/(bb.width+pad*2), VB_H/(bb.height+pad*2)))); tx = (VB_W - bb.width*scale)/2 - bb.x*scale; ty = (VB_H - bb.height*scale)/2 - bb.y*scale; apply(); }
  svg.style.touchAction = 'none';
  svg.addEventListener('pointerdown', e => { dragging=true; moved=false; suppressClick=false; sx=e.clientX; sy=e.clientY; const v=document.getElementById('valley'); if(v) v.classList.add('grabbing'); });
  window.addEventListener('pointermove', e => { if(!dragging) return; const dx=e.clientX-sx, dy=e.clientY-sy; if(Math.abs(dx)+Math.abs(dy)>5) moved=true; const r=svg.getBoundingClientRect(); tx+=dx*(VB_W/r.width); ty+=dy*(VB_H/r.height); sx=e.clientX; sy=e.clientY; apply(); });
  function endDrag() { if(!dragging) return; dragging=false; if(moved){ suppressClick=true; setTimeout(()=>{suppressClick=false;},30);} const v=document.getElementById('valley'); if(v) v.classList.remove('grabbing'); }
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
  function zoomTo(ns){ ns=Math.max(minS,Math.min(maxS,ns)); const cx=(VB_W/2-tx)/scale, cy=(VB_H/2-ty)/scale; scale=ns; tx=VB_W/2-cx*scale; ty=VB_H/2-cy*scale; apply(); }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomTo(scale*(e.deltaY<0?1.12:0.9)); }, { passive:false });
  document.getElementById('vz-in').addEventListener('click', ()=>zoomTo(scale*1.2));
  document.getElementById('vz-out').addEventListener('click', ()=>zoomTo(scale*0.83));
  document.getElementById('vz-reset').addEventListener('click', fitScene);

  const cta = document.createElement('button'); cta.className='valley-cta'; cta.type='button'; cta.innerHTML='🎂 read the birthday message'; cta.addEventListener('click', openMessage); document.getElementById('valley').appendChild(cta);

  showScene('overworld');
})();
