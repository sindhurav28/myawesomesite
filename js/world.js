/* =============================================================================
   K&S VALLEY — explorable isometric world.
   Overworld: a dense Silicon-Valley city + theme-park country portals.
   Drill into a country: a 3D relief map of the real outline with pinned places.
   Click a place: its story opens in an in-world panel. Eggs reveal images.
   ========================================================================== */
(function () {
  const svg = document.getElementById('world');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const VB_W = 1280, VB_H = 860;
  svg.setAttribute('viewBox', '0 0 ' + VB_W + ' ' + VB_H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const cam = mk('g'); svg.appendChild(cam);
  const groundG = mk('g'), worldG = mk('g');
  cam.appendChild(groundG); cam.appendChild(worldG);

  const TW = 58, TH = 29, OX = 640, OY = 320;
  function iso(gx, gy) { return [OX + (gx - gy) * TW, OY + (gx + gy) * TH]; }
  function mk(t) { return document.createElementNS(NS, t); }
  function hexRgb(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function shade(hex, a) { const c = hexRgb(hex).map(v => Math.max(0, Math.min(255, v + a))); return 'rgb(' + c.join(',') + ')'; }
  function poly(pts, fill, stroke) {
    const p = mk('polygon');
    p.setAttribute('points', pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '));
    p.setAttribute('fill', fill);
    if (stroke) { p.setAttribute('stroke', stroke); p.setAttribute('stroke-width','1'); p.setAttribute('stroke-linejoin','round'); }
    return p;
  }

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

  /* real (simplified) country outlines in [lng, lat] for the 3D relief maps */
  const OUTLINES = {
    USA: [[-124.5,48.4],[-124,40],[-120.5,34.6],[-117.1,32.5],[-114.6,32.7],[-111,31.3],[-108,31.3],[-106.5,31.8],[-103,29],[-99.5,27.5],[-97.4,25.9],[-94,29.6],[-90,29.1],[-88,30.3],[-84,30],[-81.5,25.9],[-80.1,26.8],[-81,31],[-76.5,34.6],[-75,38],[-74,40.5],[-70.8,41.6],[-70,43.7],[-67,44.8],[-69.2,47.4],[-71.5,45],[-76.9,43.2],[-82.5,41.7],[-83.4,45.8],[-87.6,45.1],[-90,46.7],[-95,49],[-104,49],[-123,49]],
    India: [[77,35.5],[80,34],[81,30.4],[88.2,27.9],[89,26],[92,25],[95.2,27],[94,24],[92.8,22],[89,21.8],[87,21],[85,19.7],[82.5,17],[80.3,13.1],[79.8,10.3],[77.5,8.1],[76,9.5],[74.8,13],[73,16],[72.8,19.1],[70,21],[68.8,23.7],[70,24.5],[74,30],[76,32],[78,34.5]],
    Canada: [[-123,49],[-95,49],[-82,42],[-79,43],[-74,45],[-69.5,47],[-64,46],[-60,47],[-64,50.5],[-79,53],[-95,53],[-123,53]],
    Mexico: [[-117,32.5],[-108,31.3],[-103,29],[-97.4,25.9],[-97.2,20.5],[-94,18.2],[-90.5,21],[-86.8,21.4],[-88,18.5],[-92,14.5],[-96,15.6],[-104,19.5],[-110,23.5],[-114,28.5]]
  };

  /* ---------------- egg content ---------------- */
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

  /* ---------------- primitive drawing ---------------- */
  function drawGroundGrid(w, h, roadSet) {
    for (let gx = 0; gx <= w; gx++) for (let gy = 0; gy <= h; gy++) {
      const c = iso(gx, gy);
      const top=[c[0],c[1]-TH], right=[c[0]+TW,c[1]], bot=[c[0],c[1]+TH], left=[c[0]-TW,c[1]];
      const road = roadSet && roadSet.has(gx + ',' + gy);
      const fill = road ? '#c7ced8' : ((gx + gy) % 2 ? '#8fd06a' : '#82c760');
      groundG.appendChild(poly([top,right,bot,left], fill, 'rgba(18,35,59,0.05)'));
    }
  }

  function drawBuilding(e) {
    const c = iso(e.gx, e.gy), g = mk('g');
    const w = e.wHalf, d = w * 0.5, ax = c[0], ay = c[1] + TH;
    const front=[ax,ay], right=[ax+w,ay-d], fT=[ax,ay-e.h], rT=[ax+w,ay-d-e.h], bT=[ax,ay-w-e.h], lT=[ax-w,ay-d-e.h];
    const left=[ax-w,ay-d];
    g.appendChild(poly([front,right,rT,fT], shade(e.color,-34), 'rgba(18,35,59,0.16)'));
    g.appendChild(poly([left,front,fT,lT], shade(e.color,-12), 'rgba(18,35,59,0.16)'));
    g.appendChild(poly([lT,fT,rT,bT], shade(e.color,26), 'rgba(18,35,59,0.16)'));
    if (e.sign) {
      const sx = (left[0] + fT[0]) / 2, sy = (left[1] + fT[1]) / 2 + e.h * 0.16;
      const bw = Math.min(e.sign.length * 6.4 + 8, w * 1.7);
      const r = mk('rect'); r.setAttribute('x', sx - bw/2); r.setAttribute('y', sy - 8); r.setAttribute('width', bw); r.setAttribute('height', 16);
      r.setAttribute('rx', 3); r.setAttribute('fill', '#fff'); r.setAttribute('opacity', '0.92');
      const t = mk('text'); t.setAttribute('x', sx); t.setAttribute('y', sy); t.setAttribute('text-anchor','middle');
      t.setAttribute('font-family', "'JetBrains Mono', monospace"); t.setAttribute('font-size','9'); t.setAttribute('font-weight','700');
      t.setAttribute('fill', shade(e.color,-70)); t.setAttribute('style','dominant-baseline:central'); t.textContent = e.sign;
      g.appendChild(r); g.appendChild(t);
    }
    if (e.emoji) { const t = mk('text'); t.setAttribute('x', ax); t.setAttribute('y', ay - e.h - 20); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size', e.eSize || 26); t.setAttribute('style','dominant-baseline:central'); t.textContent = e.emoji; g.appendChild(t); }
    if (e.label) g.appendChild(label(ax, ay - e.h - (e.emoji ? 40 : 16), e.label));
    return g;
  }

  function drawSprite(e) {
    const c = iso(e.gx, e.gy), g = mk('g'), fy = c[1] + (e.float || 6);
    if (!e.deco) { const hit = mk('circle'); hit.setAttribute('cx', c[0]); hit.setAttribute('cy', fy); hit.setAttribute('r', e.size * 0.8); hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all'); g.appendChild(hit); }
    const t = mk('text'); t.setAttribute('x', c[0]); t.setAttribute('y', fy); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size', e.size); t.setAttribute('style','dominant-baseline:central'); t.textContent = e.emoji; g.appendChild(t);
    if (e.label) g.appendChild(label(c[0], fy - e.size*0.72, e.label));
    return g;
  }

  function drawPortal(e) {
    // theme-park entrance: colorful platform + arch banner + flag + ride
    const c = iso(e.gx, e.gy), g = mk('g'), m = COUNTRY[e.country];
    const cx = c[0], cy = c[1];
    // platform diamond
    g.appendChild(poly([[cx,cy-TH*1.4],[cx+TW*1.5,cy+6],[cx,cy+TH*1.4+6],[cx-TW*1.5,cy+6]], shade(m.color,40), 'rgba(18,35,59,0.18)'));
    g.appendChild(poly([[cx,cy-TH*1.4],[cx+TW*1.5,cy+6],[cx,cy+TH*1.4],[cx-TW*1.5,cy+6]], m.color, 'rgba(18,35,59,0.2)'));
    // arch posts + banner
    const pw = 8, ah = 46, half = 42;
    [-1,1].forEach(s => { const r = mk('rect'); r.setAttribute('x', cx + s*half - pw/2); r.setAttribute('y', cy - ah); r.setAttribute('width', pw); r.setAttribute('height', ah); r.setAttribute('rx',3); r.setAttribute('fill', shade(m.color,-40)); g.appendChild(r); });
    const ban = mk('rect'); ban.setAttribute('x', cx-half-4); ban.setAttribute('y', cy-ah-16); ban.setAttribute('width', (half+4)*2); ban.setAttribute('height', 20); ban.setAttribute('rx',5); ban.setAttribute('fill','#fff'); ban.setAttribute('stroke', shade(m.color,-30)); ban.setAttribute('stroke-width','2'); g.appendChild(ban);
    const bt = mk('text'); bt.setAttribute('x', cx); bt.setAttribute('y', cy-ah-6); bt.setAttribute('text-anchor','middle'); bt.setAttribute('font-family',"'Poppins',sans-serif"); bt.setAttribute('font-size','12'); bt.setAttribute('font-weight','700'); bt.setAttribute('fill', shade(m.color,-70)); bt.setAttribute('style','dominant-baseline:central'); bt.textContent = e.country + ' · ' + byCountry[e.country].length; g.appendChild(bt);
    // ride + flag emojis
    const ride = mk('text'); ride.setAttribute('x', cx); ride.setAttribute('y', cy-4); ride.setAttribute('text-anchor','middle'); ride.setAttribute('font-size','30'); ride.setAttribute('style','dominant-baseline:central'); ride.textContent = m.ride; g.appendChild(ride);
    const fl = mk('text'); fl.setAttribute('x', cx+half); fl.setAttribute('y', cy-ah-2); fl.setAttribute('text-anchor','middle'); fl.setAttribute('font-size','18'); fl.setAttribute('style','dominant-baseline:central'); fl.textContent = m.flag; g.appendChild(fl);
    return g;
  }

  function label(cx, y, text) {
    const g = mk('g'), w = text.length * 7.2 + 16;
    const r = mk('rect'); r.setAttribute('x', cx-w/2); r.setAttribute('y', y-12); r.setAttribute('width', w); r.setAttribute('height', 20); r.setAttribute('rx',6); r.setAttribute('fill','#fff'); r.setAttribute('stroke','rgba(18,35,59,0.2)');
    const tx = mk('text'); tx.setAttribute('x', cx); tx.setAttribute('y', y-2); tx.setAttribute('text-anchor','middle'); tx.setAttribute('font-family',"'JetBrains Mono', monospace"); tx.setAttribute('font-size','11'); tx.setAttribute('font-weight','600'); tx.setAttribute('fill','#14243a'); tx.textContent = text;
    g.appendChild(r); g.appendChild(tx); return g;
  }

  function renderEntities(list) {
    list.sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy) || a.gx - b.gx);
    list.forEach(e => {
      const g = e.kind === 'bldg' ? drawBuilding(e) : e.kind === 'portal' ? drawPortal(e) : drawSprite(e);
      if (!e.deco) {
        g.setAttribute('class', 'wobj');
        g.setAttribute('data-i', '1'); g.__act = e;
        if (e.tip) attachTip(g, e.tip);
      }
      worldG.appendChild(g);
    });
  }

  /* ---------------- tooltip ---------------- */
  let tip;
  function attachTip(el, text) {
    el.addEventListener('pointerenter', () => { if (!tip) { tip = document.createElement('div'); tip.className = 'wtip'; document.body.appendChild(tip); } tip.textContent = text; tip.classList.add('show'); });
    el.addEventListener('pointermove', e => { if (tip) { tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; } });
    el.addEventListener('pointerleave', () => { if (tip) tip.classList.remove('show'); });
  }

  /* ---------------- overworld ---------------- */
  function buildOverworld() {
    const N = 12;
    const roads = new Set();
    for (let i = 0; i <= N; i++) { roads.add('3,' + i); roads.add('8,' + i); roads.add(i + ',3'); roads.add(i + ',8'); }
    drawGroundGrid(N, N, roads);
    const E = [];
    const B = (gx,gy,w,h,color,extra) => E.push(Object.assign({kind:'bldg',gx,gy,wHalf:w,h,color},extra||{}));
    const S = (gx,gy,emoji,size,extra) => E.push(Object.assign({kind:'sprite',gx,gy,emoji,size:size||30},extra||{}));

    // Theme-park country portals (four corners)
    const pos = [[1,1],[11,1],[1,11],[11,11]];
    ORDER.forEach((country, i) => E.push({ kind: 'portal', gx: pos[i][0], gy: pos[i][1], country, tip: 'enter ' + country + ' 🎢', act: () => showScene(country) }));

    // Pied Piper HQ + Traction
    B(6,6,30,96,'#35c46a',{ label:'PIED PIPER HQ 🎂', emoji:'🥧', eSize:24, tip:'open the birthday launch 🎂', act: openMessage });
    B(5,7,22,66,'#a06bff',{ label:'TRACTION 📈', tip:'the numbers →', act: openStats });

    // Parody Silicon Valley companies (signs) — fills the city
    const comps = [
      [2,5,'HOOLI','#2d9cff',150],[9,4,'NUCLEUS','#ff5a5f',120],[4,10,'AVIATO','#ff8a3d',104],[10,7,'RAVIGA','#17c7c0',96],
      [6,2,'FACEBQQK','#3b5998',132],[2,9,'GOOGol','#e34b4b',110],[10,10,'NUTUBE','#ff3b3b',92],[7,10,'CHIRPER','#1da1f2',100],
      [10,2,'ORACIO','#c74634',140],[2,2,'WATSAPP','#25d366',84],[5,4,'ENDFRAME','#7a5cff',118],[9,9,'BREAM','#ff2fa0',96]
    ];
    comps.forEach(c => B(c[0],c[1],22,c[4],c[3],{ sign:c[2], tip:c[2].replace(/[0-9]/g,'') , act:(function(name){return ()=>KNS.toast('🏢 '+name, 'Definitely not a real company. Definitely making the world a better place. 🚀');})(c[2]) }));

    // filler generic buildings on empty non-road tiles
    const taken = new Set(E.filter(e=>e.gx!=null).map(e=>e.gx+','+e.gy));
    const fillerColors = ['#9fb4c9','#b8c6d6','#8fd06a','#cfd8e3','#a7d3f0'];
    let seed = 7;
    for (let gx=0; gx<=N; gx++) for (let gy=0; gy<=N; gy++) {
      const k = gx+','+gy;
      if (roads.has(k) || taken.has(k)) continue;
      seed = (seed*9301+49297) % 233280; const rnd = seed/233280;
      if (rnd < 0.45) B(gx,gy,16, 28+Math.floor(rnd*70), fillerColors[gx*gy%fillerColors.length], { deco:true });
      else if (rnd < 0.62) S(gx,gy,'🌳',22,{deco:true});
    }

    // cars on the roads + scenery
    ['3,1','3,6','3,10','8,2','8,7','8,11','1,3','6,3','10,3','2,8','7,8','11,8'].forEach((k,i)=>{ const [gx,gy]=k.split(',').map(Number); S(gx,gy,['🚗','🚕','🚙','🚌','🚚'][i%5],18,{deco:true,float:2}); });

    // Easter eggs (small, click to reveal the image)
    S(6,6,'🥧',22,{ egg:'piper', float:-108, tip:'a warm pie…?' });
    S(9,6,'🤖',24,{ egg:'robot', tip:'is that… a robot?' });
    S(4,7,'🖼️',22,{ egg:'painting', tip:'a suspicious painting' });
    S(2,6,'🧥',22,{ egg:'jacket', tip:'a dropped jacket' });
    S(10,5,'🍾',22,{ egg:'commas', tip:'fancy bottle' });
    S(5,2,'🖥️',22,{ egg:'anton', tip:'a humming server' });
    S(7,4,'📦',22,{ egg:'middleout', tip:'compress me' });
    S(4,4,'🌭',22,{ egg:'hotdog', tip:'hungry?' });

    E.forEach(e => { if (e.egg) e.act = (function(id){ return () => revealEgg(id); })(e.egg); });
    renderEntities(E);
  }

  /* ---------------- 3D country relief map ---------------- */
  function renderCountryMap(country) {
    const outline = OUTLINES[country], places = byCountry[country], m = COUNTRY[country];
    let minL=Infinity,maxL=-Infinity,minA=Infinity,maxA=-Infinity;
    outline.forEach(pt => { minL=Math.min(minL,pt[0]); maxL=Math.max(maxL,pt[0]); minA=Math.min(minA,pt[1]); maxA=Math.max(maxA,pt[1]); });
    const S = 780 / (maxL - minL), tilt = 0.66, T = 30;
    const proj = (lng,lat) => [ (lng-minL)*S, (maxA-lat)*S*tilt ];
    const top = outline.map(pt => proj(pt[0], pt[1]));
    const bot = top.map(p => [p[0], p[1]+T]);
    const xs = top.map(p=>p[0]), ys = top.map(p=>p[1]);
    const bb = { minx:Math.min.apply(null,xs), maxx:Math.max.apply(null,xs), miny:Math.min.apply(null,ys), maxy:Math.max.apply(null,ys) };
    // soft shadow
    const sh = mk('ellipse'); sh.setAttribute('cx',(bb.minx+bb.maxx)/2); sh.setAttribute('cy', bb.maxy+T+16); sh.setAttribute('rx',(bb.maxx-bb.minx)/2*0.92); sh.setAttribute('ry',18); sh.setAttribute('fill','rgba(18,35,59,0.16)'); worldG.appendChild(sh);
    // extruded side (bottom copy) then top face
    worldG.appendChild(poly(bot, shade(m.color,-55), 'rgba(18,35,59,0.28)'));
    worldG.appendChild(poly(top, shade(m.color,10), 'rgba(18,35,59,0.4)'));
    // gentle grid lines on top for a "map" feel
    // place pins
    places.forEach(p => {
      let x = (p.coords[1]-minL)*S, y = (maxA-p.coords[0])*S*tilt;
      x = Math.max(bb.minx+12, Math.min(bb.maxx-12, x));
      y = Math.max(bb.miny+10, Math.min(bb.maxy-6, y));
      const g = mk('g'); g.setAttribute('class','wobj'); g.setAttribute('data-i','1'); g.__act = { act: () => openPlace(p) };
      const hit = mk('circle'); hit.setAttribute('cx',x); hit.setAttribute('cy',y); hit.setAttribute('r',18); hit.setAttribute('fill','transparent'); hit.setAttribute('pointer-events','all'); g.appendChild(hit);
      const stem = mk('line'); stem.setAttribute('x1',x); stem.setAttribute('y1',y); stem.setAttribute('x2',x); stem.setAttribute('y2',y-16); stem.setAttribute('stroke', shade(m.color,-60)); stem.setAttribute('stroke-width','2'); g.appendChild(stem);
      const dot = mk('circle'); dot.setAttribute('cx',x); dot.setAttribute('cy',y-22); dot.setAttribute('r',12); dot.setAttribute('fill','#fff'); dot.setAttribute('stroke', shade(m.color,-40)); dot.setAttribute('stroke-width','2.5'); g.appendChild(dot);
      const t = mk('text'); t.setAttribute('x',x); t.setAttribute('y',y-22); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','15'); t.setAttribute('style','dominant-baseline:central'); t.textContent = p.emoji; g.appendChild(t);
      attachTip(g, p.name + ' · ' + p.date);
      worldG.appendChild(g);
    });
  }

  /* ---------------- scenes ---------------- */
  let currentScene = 'overworld';
  const titleEl = document.getElementById('scene-title');
  const crumbEl = document.getElementById('breadcrumb');
  const backBtn = document.getElementById('valley-back');
  function clearScene() { groundG.textContent = ''; worldG.textContent = ''; }

  function showScene(id) {
    currentScene = id; clearScene();
    if (id === 'overworld') {
      buildOverworld();
      titleEl.innerHTML = 'K&amp;S Valley 🥧';
      crumbEl.textContent = 'drag to explore · enter a country · find the secrets';
      backBtn.hidden = true;
    } else {
      renderCountryMap(id);
      titleEl.textContent = id + ' ' + (COUNTRY[id] ? COUNTRY[id].flag : '');
      crumbEl.textContent = 'K&S Valley › ' + id + ' · tap a pin';
      backBtn.hidden = false;
    }
    fitScene();
    if (window.KNS && window.KNS.rescan) window.KNS.rescan();
  }
  backBtn.addEventListener('click', () => showScene('overworld'));

  /* ---------------- panels ---------------- */
  const panel = document.getElementById('panel');
  const panelBody = document.getElementById('panel-body');
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

  function openMessage() {
    const tpl = document.getElementById('tpl-message');
    panelBody.innerHTML = ''; panelBody.appendChild(tpl.content.cloneNode(true));
    panel.hidden = false; panel.classList.add('open'); panelBody.parentElement.scrollTop = 0;
  }

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
      '<div class="badges"><span class="badge">stop <b>#' + (idx+1) + '</b>/' + PLACES.length + '</span>' +
      '<span class="badge">' + p.region + '</span><span class="badge">' + cat + '</span>' +
      '<span class="badge">tz <b>' + utcS + '</b></span>' +
      (prev ? '<span class="badge"><b>' + leg.toLocaleString() + '</b> mi from prev</span>' : '<span class="badge">the beginning ✦</span>') + '</div>' +
      '<div class="memory-card">' + escapeHtml(p.memory) + '</div>' +
      '<div class="gallery">' + photos + '</div>' +
      '<div class="pd-nav">' + nav + '</div></div>');
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

  /* ---------------- delegated clicks ---------------- */
  svg.addEventListener('click', ev => {
    if (suppressClick) return;
    const el = ev.target.closest('[data-i]');
    if (el && el.__act && typeof el.__act.act === 'function') el.__act.act();
  });

  /* ---------------- pan + zoom + fit ---------------- */
  let tx=0, ty=0, scale=1, minS=0.35, maxS=2.4, dragging=false, moved=false, sx=0, sy=0, suppressClick=false;
  function apply() { cam.setAttribute('transform','translate('+tx+','+ty+') scale('+scale+')'); }
  function fitScene() {
    const bb = worldG.getBBox(), pad = 80;
    scale = Math.max(minS, Math.min(maxS, Math.min(VB_W/(bb.width+pad*2), VB_H/(bb.height+pad*2))));
    tx = (VB_W - bb.width*scale)/2 - bb.x*scale; ty = (VB_H - bb.height*scale)/2 - bb.y*scale; apply();
  }
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
