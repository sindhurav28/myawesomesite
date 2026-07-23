/* =============================================================================
   K&S TRAVEL JOURNAL — "K&S VALLEY" isometric explorable world
   A pannable / zoomable flat-isometric Silicon Valley. Company buildings are
   decorative + quippy; destination landmarks open their case study; hidden
   objects are easter eggs (wired through window.KNS).
   ========================================================================== */
(function () {
  const svg = document.getElementById('world');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const VB_W = 1200, VB_H = 820;
  svg.setAttribute('viewBox', '0 0 ' + VB_W + ' ' + VB_H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  const cam = mk('g'); svg.appendChild(cam);
  const groundG = mk('g'); const worldG = mk('g');
  cam.appendChild(groundG); cam.appendChild(worldG);

  const TW = 62, TH = 31, OX = 600, OY = 120;
  function iso(gx, gy) { return [OX + (gx - gy) * TW, OY + (gx + gy) * TH]; }
  function mk(t) { return document.createElementNS(NS, t); }
  function hexRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
  function shade(hex, a) { const c = hexRgb(hex).map(v => Math.max(0, Math.min(255, v + a))); return 'rgb(' + c.join(',') + ')'; }
  function poly(pts, fill, stroke) {
    const p = mk('polygon');
    p.setAttribute('points', pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '));
    p.setAttribute('fill', fill);
    if (stroke) { p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', '1'); p.setAttribute('stroke-linejoin', 'round'); }
    return p;
  }

  /* ---------- ground ---------- */
  const N = 9;
  const roads = new Set(['0,3','1,3','2,3','3,3','4,3','4,4','4,5','4,6','4,7','3,0','3,1','3,2','5,3','6,3','7,3','8,3','4,2','4,1','4,0','0,8','1,7','5,6','6,6','7,7','8,0','7,1','6,2']);
  for (let s = 0; s <= 2 * N; s++) {
    for (let gx = 0; gx <= N; gx++) {
      const gy = s - gx;
      if (gy < 0 || gy > N) continue;
      const c = iso(gx, gy);
      const isRoad = roads.has(gx + ',' + gy);
      const top = [c[0], c[1] - TH], right = [c[0] + TW, c[1]], bot = [c[0], c[1] + TH], left = [c[0] - TW, c[1]];
      const fill = isRoad ? '#c7ced8' : ((gx + gy) % 2 ? '#8fd06a' : '#82c760');
      groundG.appendChild(poly([top, right, bot, left], fill, 'rgba(18,35,59,0.06)'));
    }
  }

  /* ---------- entity registry ---------- */
  const entities = [];
  function building(gx, gy, wHalf, h, color, label, opts) {
    entities.push(Object.assign({ kind: 'bldg', gx, gy, wHalf, h, color, label }, opts || {}));
  }
  function sprite(gx, gy, emoji, size, label, opts) {
    entities.push(Object.assign({ kind: 'sprite', gx, gy, emoji, size: size || 34, label }, opts || {}));
  }

  /* Tech companies (decorative + quips) */
  building(7, 1, 30, 168, '#2d9cff', 'HOOLI', { quote: ['Hooli', 'Making the world a better place. (We beat them to it.) 🏢'] });
  building(8, 4, 26, 138, '#ff5a5f', 'NUCLEUS', { quote: ['Nucleus', 'Hooli’s “revolutionary” platform. It buffered. A lot. 📉'] });
  building(1, 6, 26, 120, '#a06bff', 'RAVIGA', { quote: ['Raviga Capital', 'The VCs. They’ll fund anything with a hockey-stick chart. 📈'] });
  building(6, 6, 24, 96,  '#ff8a3d', 'AVIATO', { quote: ['Aviato', 'It’s got a jetpack. Erlich’s finest work. ✈️'] });
  building(5, 2, 22, 74,  '#17c7c0', 'BACHMANITY', { quote: ['Bachmanity', 'Bachmanity Insanity. The party that ended an empire. 🎉'] });
  /* Pied Piper HQ (the incubator) — opens the dossier */
  building(2, 2, 26, 82, '#35c46a', 'PIED PIPER', { scroll: '#dossier', title: 'Pied Piper HQ — enter the dossier' });

  /* Destination landmarks — click to open the case study */
  sprite(0, 3, '❤️', 34, 'Toronto — where we met', { link: 'place.html?id=toronto-2022', post: 'Toronto' });
  sprite(3, 0, '💍', 34, 'Hyderabad — our wedding', { link: 'place.html?id=hyderabad-2023', post: 'Hyderabad' });
  sprite(4, 4, '🏠', 34, 'Atlanta — home base', { link: 'place.html?id=atlanta-2024', post: 'Atlanta' });
  sprite(8, 0, '🌊', 34, 'Crater Lake', { link: 'place.html?id=crater-lake-2025', post: 'Crater Lake' });
  sprite(0, 8, '🌺', 34, 'Hawaii', { link: 'place.html?id=hawaii-2025', post: 'Hawaii' });
  sprite(7, 7, '🗽', 34, 'New York', { link: 'place.html?id=new-york-2025', post: 'New York' });
  sprite(4, 7, '🧭', 36, 'All 36 destinations → the full roadmap', { scroll: '#roadmap', post: 'Roadmap' });

  /* Hidden easter-egg objects (wired via window.KNS) */
  sprite(2, 2, '🥧', 30, 'a warm pie…?', { egg: 'piper', float: -70 });   // sits atop Pied Piper HQ
  sprite(6, 3, '🤖', 32, 'is that… a robot?', { egg: 'robot' });
  sprite(3, 5, '🖼️', 30, 'a suspicious painting', { egg: 'painting' });
  sprite(1, 1, '🧥', 30, 'someone dropped a jacket', { egg: 'jacket' });

  /* Trees & scenery (non-interactive) */
  [[0,0],[1,4],[2,6],[5,5],[6,0],[8,2],[3,8],[7,4],[2,8],[0,6]].forEach(t => sprite(t[0], t[1], '🌳', 26, null, { deco: true }));

  /* ---------- render (painter's order: back → front) ---------- */
  entities.sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy) || a.gx - b.gx);
  entities.forEach(renderEntity);

  function renderEntity(e) {
    const c = iso(e.gx, e.gy);
    const g = mk('g');
    if (e.kind === 'bldg') {
      const w = e.wHalf, d = w * 0.5, ax = c[0], ay = c[1] + TH; // sit on tile
      const front=[ax,ay], right=[ax+w,ay-d], back=[ax,ay-w], left=[ax-w,ay-d];
      const fT=[ax,ay-e.h], rT=[ax+w,ay-d-e.h], bT=[ax,ay-w-e.h], lT=[ax-w,ay-d-e.h];
      g.appendChild(poly([front,right,rT,fT], shade(e.color,-34), 'rgba(18,35,59,0.18)'));
      g.appendChild(poly([left,front,fT,lT], shade(e.color,-12), 'rgba(18,35,59,0.18)'));
      g.appendChild(poly([lT,fT,rT,bT], shade(e.color,26), 'rgba(18,35,59,0.18)'));
      // windows
      const rows = Math.max(1, Math.floor(e.h / 30));
      for (let r = 0; r < rows; r++) {
        const dot = mk('circle');
        dot.setAttribute('cx', ax - w*0.45); dot.setAttribute('cy', ay - d*0.5 - 14 - r*26);
        dot.setAttribute('r', 2.6); dot.setAttribute('fill', 'rgba(255,255,255,0.8)');
        g.appendChild(dot);
      }
      if (e.label) g.appendChild(label(ax, ay - e.h - 16, e.label));
    } else {
      const fy = c[1] + (e.float || 6);
      if (!e.deco) {
        // transparent hit-area so the emoji is reliably clickable
        const hit = mk('circle');
        hit.setAttribute('cx', c[0]); hit.setAttribute('cy', fy);
        hit.setAttribute('r', e.size * 0.72);
        hit.setAttribute('fill', 'transparent');
        hit.setAttribute('pointer-events', 'all');
        g.appendChild(hit);
      }
      const t = mk('text');
      t.setAttribute('x', c[0]); t.setAttribute('y', fy);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-size', e.size);
      t.setAttribute('style', 'dominant-baseline:central');
      t.textContent = e.emoji;
      g.appendChild(t);
    }

    // interactivity
    if (!e.deco) {
      g.setAttribute('class', 'wobj');
      if (e.egg) { g.setAttribute('data-egg', e.egg); }
      else {
        g.setAttribute('data-i', '1');
        g.__act = e;
      }
      if (e.label || e.title) attachTip(g, e.title || e.label);
    }
    worldG.appendChild(g);
  }

  function label(cx, y, text) {
    const g = mk('g');
    const w = text.length * 7.4 + 16;
    const r = mk('rect');
    r.setAttribute('x', cx - w/2); r.setAttribute('y', y - 12); r.setAttribute('width', w); r.setAttribute('height', 20);
    r.setAttribute('rx', 6); r.setAttribute('fill', '#ffffff'); r.setAttribute('stroke', 'rgba(18,35,59,0.2)');
    const tx = mk('text');
    tx.setAttribute('x', cx); tx.setAttribute('y', y - 2); tx.setAttribute('text-anchor', 'middle');
    tx.setAttribute('font-family', "'JetBrains Mono', monospace"); tx.setAttribute('font-size', '11');
    tx.setAttribute('font-weight', '600'); tx.setAttribute('fill', '#14243a');
    tx.textContent = text;
    g.appendChild(r); g.appendChild(tx);
    return g;
  }

  /* ---------- tooltip ---------- */
  let tip;
  function attachTip(el, text) {
    el.addEventListener('pointerenter', () => {
      if (!tip) { tip = document.createElement('div'); tip.className = 'wtip'; document.body.appendChild(tip); }
      tip.textContent = text; tip.classList.add('show');
    });
    el.addEventListener('pointermove', (ev) => {
      if (tip) { tip.style.left = ev.clientX + 'px'; tip.style.top = ev.clientY + 'px'; }
    });
    el.addEventListener('pointerleave', () => { if (tip) tip.classList.remove('show'); });
  }

  /* ---------- act on click (non-egg interactives) ---------- */
  svg.addEventListener('click', (ev) => {
    if (suppressClick) return;
    const el = ev.target.closest('[data-i]');
    if (!el || !el.__act) return;
    const e = el.__act;
    if (e.link) { window.location.href = e.link; }
    else if (e.scroll) { const t = document.querySelector(e.scroll); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
    else if (e.quote && window.KNS) { window.KNS.toast('🏢 ' + e.quote[0], e.quote[1]); }
  });

  /* ---------- pan + zoom ---------- */
  let tx = 0, ty = 0, scale = 1, minS = 0.55, maxS = 1.8;
  let dragging = false, moved = false, sx = 0, sy = 0, suppressClick = false;
  function apply() { cam.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ')'); }
  apply();

  svg.style.touchAction = 'none';
  svg.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; suppressClick = false;
    sx = e.clientX; sy = e.clientY;
    const v = document.getElementById('valley'); if (v) v.classList.add('grabbing');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    // convert screen px delta to viewBox units
    const rect = svg.getBoundingClientRect();
    const kx = VB_W / rect.width, ky = VB_H / rect.height;
    tx += dx * kx; ty += dy * ky;
    sx = e.clientX; sy = e.clientY;
    apply();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (moved) { suppressClick = true; setTimeout(() => { suppressClick = false; }, 30); }
    const v = document.getElementById('valley'); if (v) v.classList.remove('grabbing');
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  function zoomTo(newS) {
    newS = Math.max(minS, Math.min(maxS, newS));
    // keep center roughly stable
    const cxv = (VB_W / 2 - tx) / scale, cyv = (VB_H / 2 - ty) / scale;
    scale = newS;
    tx = VB_W / 2 - cxv * scale; ty = VB_H / 2 - cyv * scale;
    apply();
  }
  svg.addEventListener('wheel', (e) => { e.preventDefault(); zoomTo(scale * (e.deltaY < 0 ? 1.12 : 0.9)); }, { passive: false });

  const zi = document.getElementById('vz-in'), zo = document.getElementById('vz-out'), zr = document.getElementById('vz-reset');
  if (zi) zi.addEventListener('click', () => zoomTo(scale * 1.2));
  if (zo) zo.addEventListener('click', () => zoomTo(scale * 0.83));
  if (zr) zr.addEventListener('click', () => { tx = 0; ty = 0; scale = 1; apply(); });

  // let the egg engine wire the world's egg objects
  if (window.KNS && window.KNS.rescan) window.KNS.rescan();
})();
