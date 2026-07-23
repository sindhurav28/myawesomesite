/* =============================================================================
   K&S VALLEY — a single explorable isometric world.
   Overworld (Silicon Valley + country portals) → drill into a country → pick a
   place → its story opens in an in-world panel. Nothing scrolls; it's all map.
   ========================================================================== */
(function () {
  const svg = document.getElementById('world');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const VB_W = 1200, VB_H = 820;
  svg.setAttribute('viewBox', '0 0 ' + VB_W + ' ' + VB_H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const cam = mk('g'); svg.appendChild(cam);
  const groundG = mk('g'), worldG = mk('g');
  cam.appendChild(groundG); cam.appendChild(worldG);

  const TW = 62, TH = 31, OX = 600, OY = 300;
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
    'India':  { flag: '🇮🇳', color: '#ff9933', g: ['#ffe0b0', '#ffd497'] },
    'USA':    { flag: '🇺🇸', color: '#3b6fd4', g: ['#cfe0ff', '#bdd4ff'] },
    'Canada': { flag: '🇨🇦', color: '#e34b4b', g: ['#ffd2d2', '#ffc2c2'] },
    'Mexico': { flag: '🇲🇽', color: '#2fa35a', g: ['#c9f0d2', '#b6e8c2'] }
  };
  const ORDER = ['India', 'USA', 'Canada', 'Mexico'].filter(c => byCountry[c]);

  /* ---------------- entity rendering ---------------- */
  function drawGroundGrid(w, h, cols, tint) {
    for (let gx = 0; gx <= w; gx++) for (let gy = 0; gy <= h; gy++) {
      const c = iso(gx, gy);
      const top=[c[0],c[1]-TH], right=[c[0]+TW,c[1]], bot=[c[0],c[1]+TH], left=[c[0]-TW,c[1]];
      let fill;
      if (tint) fill = (gx + gy) % 2 ? tint[0] : tint[1];
      else fill = cols.has(gx + ',' + gy) ? '#c7ced8' : ((gx + gy) % 2 ? '#8fd06a' : '#82c760');
      groundG.appendChild(poly([top,right,bot,left], fill, 'rgba(18,35,59,0.05)'));
    }
  }

  function drawBuilding(e) {
    const c = iso(e.gx, e.gy), g = mk('g');
    const w = e.wHalf, d = w * 0.5, ax = c[0], ay = c[1] + TH;
    const front=[ax,ay], right=[ax+w,ay-d], back=[ax,ay-w], left=[ax-w,ay-d];
    const fT=[ax,ay-e.h], rT=[ax+w,ay-d-e.h], bT=[ax,ay-w-e.h], lT=[ax-w,ay-d-e.h];
    g.appendChild(poly([front,right,rT,fT], shade(e.color,-34), 'rgba(18,35,59,0.18)'));
    g.appendChild(poly([left,front,fT,lT], shade(e.color,-12), 'rgba(18,35,59,0.18)'));
    g.appendChild(poly([lT,fT,rT,bT], shade(e.color,26), 'rgba(18,35,59,0.18)'));
    const rows = Math.max(1, Math.floor(e.h / 30));
    for (let r = 0; r < rows; r++) {
      const dot = mk('circle');
      dot.setAttribute('cx', ax - w*0.45); dot.setAttribute('cy', ay - d*0.5 - 14 - r*26);
      dot.setAttribute('r', 2.6); dot.setAttribute('fill', 'rgba(255,255,255,0.85)');
      g.appendChild(dot);
    }
    if (e.emoji) {
      const t = mk('text'); t.setAttribute('x', ax); t.setAttribute('y', ay - e.h - 22);
      t.setAttribute('text-anchor','middle'); t.setAttribute('font-size', e.eSize || 26);
      t.setAttribute('style','dominant-baseline:central'); t.textContent = e.emoji; g.appendChild(t);
    }
    if (e.label) g.appendChild(label(ax, ay - e.h - (e.emoji ? 40 : 16), e.label));
    return g;
  }

  function drawSprite(e) {
    const c = iso(e.gx, e.gy), g = mk('g'), fy = c[1] + (e.float || 6);
    if (!e.deco) {
      const hit = mk('circle');
      hit.setAttribute('cx', c[0]); hit.setAttribute('cy', fy); hit.setAttribute('r', e.size * 0.8);
      hit.setAttribute('fill', 'transparent'); hit.setAttribute('pointer-events', 'all');
      g.appendChild(hit);
    }
    const t = mk('text'); t.setAttribute('x', c[0]); t.setAttribute('y', fy);
    t.setAttribute('text-anchor','middle'); t.setAttribute('font-size', e.size);
    t.setAttribute('style','dominant-baseline:central'); t.textContent = e.emoji; g.appendChild(t);
    if (e.label) g.appendChild(label(c[0], fy - e.size * 0.72, e.label));
    return g;
  }

  function label(cx, y, text) {
    const g = mk('g'), w = text.length * 7.2 + 16;
    const r = mk('rect');
    r.setAttribute('x', cx - w/2); r.setAttribute('y', y - 12); r.setAttribute('width', w); r.setAttribute('height', 20);
    r.setAttribute('rx', 6); r.setAttribute('fill', '#ffffff'); r.setAttribute('stroke', 'rgba(18,35,59,0.2)');
    const tx = mk('text'); tx.setAttribute('x', cx); tx.setAttribute('y', y - 2); tx.setAttribute('text-anchor','middle');
    tx.setAttribute('font-family', "'JetBrains Mono', monospace"); tx.setAttribute('font-size','11');
    tx.setAttribute('font-weight','600'); tx.setAttribute('fill','#14243a'); tx.textContent = text;
    g.appendChild(r); g.appendChild(tx); return g;
  }

  function renderEntities(list) {
    list.sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy) || a.gx - b.gx);
    list.forEach(e => {
      const g = e.kind === 'bldg' ? drawBuilding(e) : drawSprite(e);
      if (!e.deco) {
        g.setAttribute('class', 'wobj');
        if (e.egg) g.setAttribute('data-egg', e.egg);
        else { g.setAttribute('data-i', '1'); g.__act = e; }
        if (e.tip) attachTip(g, e.tip);
      }
      worldG.appendChild(g);
    });
  }

  /* ---------------- tooltip ---------------- */
  let tip;
  function attachTip(el, text) {
    el.addEventListener('pointerenter', () => {
      if (!tip) { tip = document.createElement('div'); tip.className = 'wtip'; document.body.appendChild(tip); }
      tip.textContent = text; tip.classList.add('show');
    });
    el.addEventListener('pointermove', e => { if (tip) { tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; } });
    el.addEventListener('pointerleave', () => { if (tip) tip.classList.remove('show'); });
  }

  /* ---------------- scenes ---------------- */
  let currentScene = 'overworld';
  const titleEl = document.getElementById('scene-title');
  const crumbEl = document.getElementById('breadcrumb');
  const backBtn = document.getElementById('valley-back');

  function clearScene() { groundG.textContent = ''; worldG.textContent = ''; }

  function buildOverworld() {
    const roads = new Set(['3,3','4,3','5,3','3,4','3,5','4,4','5,5','5,4','4,5','2,4','6,4','4,2','4,6']);
    drawGroundGrid(9, 9, roads, null);
    const E = [];
    const B = (gx,gy,w,h,color,label,extra) => E.push(Object.assign({kind:'bldg',gx,gy,wHalf:w,h,color,label},extra||{}));
    const S = (gx,gy,emoji,size,extra) => E.push(Object.assign({kind:'sprite',gx,gy,emoji,size:size||32},extra||{}));

    // Country portals — the heart of the map
    let idx = 0;
    const portalPos = [[1,1],[8,1],[1,8],[8,8]];
    ORDER.forEach((country) => {
      const m = COUNTRY[country], pos = portalPos[idx++] || [idx, idx];
      B(pos[0], pos[1], 34, 60, m.color, country + ' · ' + byCountry[country].length, {
        emoji: m.flag, eSize: 30,
        tip: 'enter ' + country + ' (' + byCountry[country].length + ' places)',
        act: () => showScene(country)
      });
    });

    // Pied Piper HQ → the birthday message
    B(4, 4, 30, 92, '#35c46a', 'PIED PIPER HQ 🎂', { emoji: '🥧', eSize: 26, tip: 'open the birthday launch 🎂', act: openMessage });
    // Traction billboard → stats + chart
    B(5, 2, 24, 70, '#a06bff', 'TRACTION 📈', { tip: 'the numbers →', act: openStats });

    // Silicon Valley flavor
    B(8, 4, 26, 150, '#2d9cff', 'HOOLI', { tip: 'Hooli', act: () => KNS.toast('🏢 Hooli', 'Making the world a better place. (We beat them to it.)') });
    B(0, 4, 24, 120, '#ff5a5f', 'NUCLEUS', { tip: 'Nucleus', act: () => KNS.toast('🏢 Nucleus', 'Hooli’s “revolutionary” platform. It buffered. A lot. 📉') });
    B(4, 0, 22, 104, '#ff8a3d', 'AVIATO', { tip: 'Aviato', act: () => KNS.toast('🏢 Aviato', 'It’s got a jetpack. Erlich’s finest work. ✈️') });
    B(2, 6, 22, 84,  '#17c7c0', 'RAVIGA', { tip: 'Raviga', act: () => KNS.toast('🏢 Raviga', 'The VCs. They’ll fund anything with a hockey-stick chart. 📈') });

    // Easter eggs (all 8 live in the world now)
    S(4, 4, '🥧', 26, { egg: 'piper', float: -104, tip: 'a warm pie…?' });
    S(6, 3, '🤖', 30, { egg: 'robot', tip: 'is that… a robot?' });
    S(3, 5, '🖼️', 28, { egg: 'painting', tip: 'a suspicious painting' });
    S(1, 4, '🧥', 28, { egg: 'jacket', tip: 'a dropped jacket' });
    S(6, 6, '💵', 26, { egg: 'commas', tip: '$$$' });
    S(2, 2, '🖥️', 26, { egg: 'anton', tip: 'a humming server' });
    S(6, 1, '📦', 26, { egg: 'middleout', tip: 'compress me' });
    S(2, 0, '🌭', 26, { egg: 'hotdog', tip: 'hungry?' });

    // Trees
    [[0,0],[7,2],[0,7],[7,7],[3,7],[5,7],[7,5],[0,2]].forEach(t => S(t[0], t[1], '🌳', 24, { deco: true }));

    renderEntities(E);
  }

  function buildRegion(country) {
    const m = COUNTRY[country], list = byCountry[country];
    const cols = Math.ceil(Math.sqrt(list.length));
    const rows = Math.ceil(list.length / cols);
    drawGroundGrid(cols * 2 + 1, rows * 2 + 1, null, m.g);
    const E = [];
    list.forEach((p, i) => {
      const gx = (i % cols) * 2 + 1, gy = Math.floor(i / cols) * 2 + 1;
      E.push({ kind: 'sprite', gx, gy, emoji: p.emoji, size: 40, label: p.name.length > 16 ? p.name.slice(0,15)+'…' : p.name,
        tip: p.date, act: () => openPlace(p) });
    });
    renderEntities(E);
  }

  function showScene(id) {
    currentScene = id;
    clearScene();
    if (id === 'overworld') {
      buildOverworld();
      titleEl.innerHTML = 'K&amp;S Valley 🥧';
      crumbEl.textContent = 'drag to explore · click a building or country';
      backBtn.hidden = true;
    } else {
      buildRegion(id);
      titleEl.textContent = id + ' ' + (COUNTRY[id] ? COUNTRY[id].flag : '');
      crumbEl.textContent = 'K&S Valley › ' + id + ' · pick a place';
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

  function openMessage() {
    const tpl = document.getElementById('tpl-message');
    panelBody.innerHTML = '';
    panelBody.appendChild(tpl.content.cloneNode(true));
    panel.hidden = false; panel.classList.add('open');
  }

  function openPlace(p) {
    const idx = PLACES.indexOf(p);
    const list = byCountry[p.country];
    const li = list.indexOf(p);
    const coords = p.coords[0].toFixed(3) + '°, ' + p.coords[1].toFixed(3) + '°';
    const utc = Math.round(p.coords[1] / 15); const utcS = 'UTC' + (utc >= 0 ? '+' + utc : utc);
    const prev = PLACES[idx - 1];
    const leg = prev ? Math.round(window.haversineMiles(prev.coords, p.coords)) : 0;
    const cat = (CATS[p.category] || {}).label || p.category;
    let photos = '';
    if (p.photos && p.photos.length) {
      photos = p.photos.map(f => '<img loading="lazy" src="photos/' + p.id + '/' + f + '" alt="' + p.name + '">').join('');
    } else {
      const ph = '<div class="photo-placeholder"><div class="big">📷</div>drop photos in<br><b>photos/' + p.id + '/</b></div>';
      photos = ph + ph;
    }
    const nav =
      (li > 0 ? '<button class="pd-navb" data-go="' + list[li-1].id + '">← ' + list[li-1].name + '</button>' : '<span></span>') +
      (li < list.length - 1 ? '<button class="pd-navb next" data-go="' + list[li+1].id + '">' + list[li+1].name + ' →</button>' : '<span></span>');

    openPanel(
      '<div class="pd">' +
      '<div class="pd-emoji">' + p.emoji + '</div>' +
      '<h2>' + p.name + '</h2>' +
      '<div class="pd-meta">' + p.date + ' · ' + coords + '</div>' +
      '<div class="badges">' +
        '<span class="badge">stop <b>#' + (idx+1) + '</b>/' + PLACES.length + '</span>' +
        '<span class="badge">' + p.region + '</span>' +
        '<span class="badge">' + cat + '</span>' +
        '<span class="badge">tz <b>' + utcS + '</b></span>' +
        (prev ? '<span class="badge"><b>' + leg.toLocaleString() + '</b> mi from prev</span>' : '<span class="badge">the beginning ✦</span>') +
      '</div>' +
      '<div class="memory-card">' + escapeHtml(p.memory) + '</div>' +
      '<div class="gallery">' + photos + '</div>' +
      '<div class="pd-nav">' + nav + '</div>' +
      '</div>'
    );
    panelBody.querySelectorAll('.pd-navb').forEach(b => b.addEventListener('click', () => {
      const np = PLACES.find(x => x.id === b.getAttribute('data-go')); if (np) openPlace(np);
    }));
    panelBody.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => window.open(img.src, '_blank')));
  }

  function openStats() {
    const countries = new Set(PLACES.map(p => p.country));
    const regions = new Set(PLACES.map(p => p.region));
    const parks = PLACES.reduce((s, p) => s + (p.nationalParks || 0), 0);
    const years = new Date().getFullYear() - parseInt(PLACES[0].sort.slice(0,4), 10);
    const miles = Math.floor(window.totalJourneyMiles / 100) * 100;
    const counts = {}; PLACES.forEach(p => { const y = p.sort.slice(0,4); counts[y] = (counts[y]||0)+1; });
    const yrs = Object.keys(counts).sort(); const max = Math.max.apply(null, yrs.map(y => counts[y]));
    const cards = [
      [PLACES.length, 'Markets Entered'], [countries.size, 'Global Reach'], [parks + '+', 'Parks Shipped'],
      [regions.size + '+', 'Regions Scaled'], [years + '+', 'Runway (yrs)'], [miles.toLocaleString() + '+', 'Distance (mi)']
    ].map(c => '<div class="stat"><div class="num">' + c[0] + '</div><div class="label">' + c[1] + '</div></div>').join('');
    const bars = yrs.map(y => '<div class="chart-col"><div class="chart-bar" style="height:' + (counts[y]/max*100) + '%"><span class="cval">' + counts[y] + '</span></div><div class="chart-year">' + y + '</div></div>').join('');
    openPanel(
      '<h2 class="panel-h">Traction 📈</h2>' +
      '<div class="stats compact">' + cards + '</div>' +
      '<h3 class="panel-h3">Hockey-Stick Growth</h3>' +
      '<div class="chart">' + bars + '</div>'
    );
  }

  function escapeHtml(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------------- act (delegated clicks) ---------------- */
  svg.addEventListener('click', ev => {
    if (suppressClick) return;
    const el = ev.target.closest('[data-i]');
    if (el && el.__act && typeof el.__act.act === 'function') el.__act.act();
  });

  /* ---------------- pan + zoom + fit ---------------- */
  let tx = 0, ty = 0, scale = 1, minS = 0.4, maxS = 2.2;
  let dragging = false, moved = false, sx = 0, sy = 0, suppressClick = false;
  function apply() { cam.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ')'); }
  function fitScene() {
    const bb = worldG.getBBox(); const pad = 70;
    scale = Math.max(minS, Math.min(maxS, Math.min(VB_W/(bb.width+pad*2), VB_H/(bb.height+pad*2))));
    tx = (VB_W - bb.width*scale)/2 - bb.x*scale;
    ty = (VB_H - bb.height*scale)/2 - bb.y*scale;
    apply();
  }

  svg.style.touchAction = 'none';
  svg.addEventListener('pointerdown', e => {
    dragging = true; moved = false; suppressClick = false; sx = e.clientX; sy = e.clientY;
    const v = document.getElementById('valley'); if (v) v.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    const rect = svg.getBoundingClientRect();
    tx += dx * (VB_W/rect.width); ty += dy * (VB_H/rect.height);
    sx = e.clientX; sy = e.clientY; apply();
  });
  function endDrag() {
    if (!dragging) return; dragging = false;
    if (moved) { suppressClick = true; setTimeout(() => { suppressClick = false; }, 30); }
    const v = document.getElementById('valley'); if (v) v.classList.remove('grabbing');
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  function zoomTo(ns) {
    ns = Math.max(minS, Math.min(maxS, ns));
    const cx = (VB_W/2 - tx)/scale, cy = (VB_H/2 - ty)/scale;
    scale = ns; tx = VB_W/2 - cx*scale; ty = VB_H/2 - cy*scale; apply();
  }
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomTo(scale * (e.deltaY < 0 ? 1.12 : 0.9)); }, { passive: false });
  document.getElementById('vz-in').addEventListener('click', () => zoomTo(scale * 1.2));
  document.getElementById('vz-out').addEventListener('click', () => zoomTo(scale * 0.83));
  document.getElementById('vz-reset').addEventListener('click', fitScene);

  /* floating birthday CTA so the message is never missed */
  const cta = document.createElement('button');
  cta.className = 'valley-cta'; cta.type = 'button'; cta.innerHTML = '🎂 read the birthday message';
  cta.addEventListener('click', openMessage);
  document.getElementById('valley').appendChild(cta);

  /* go! */
  showScene('overworld');
})();
