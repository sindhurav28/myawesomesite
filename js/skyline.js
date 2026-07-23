/* =============================================================================
   K&S TRAVEL JOURNAL — ISOMETRIC SKYLINE
   Draws a colorful flat isometric tech-city that builds itself on load,
   à la the Silicon Valley opening credits.
   ========================================================================== */
(function () {
  const svg = document.getElementById('skyline');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const W = 1120, H = 300;
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('preserveAspectRatio', 'xMidYMax meet');

  const COLORS = ['#2d9cff', '#35c46a', '#ff5a5f', '#ffc42b', '#ff8a3d', '#a06bff', '#17c7c0'];
  const baseY = H - 26;

  /* ---- helpers ---- */
  function hexToRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function shade(hex, amt) {
    const c = hexToRgb(hex).map(v => Math.max(0, Math.min(255, v + amt)));
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }
  function poly(points, fill) {
    const p = document.createElementNS(NS, 'polygon');
    p.setAttribute('points', points.map(pt => pt[0].toFixed(1) + ',' + pt[1].toFixed(1)).join(' '));
    p.setAttribute('fill', fill);
    p.setAttribute('stroke', 'rgba(18,35,59,0.18)');
    p.setAttribute('stroke-width', '1');
    p.setAttribute('stroke-linejoin', 'round');
    return p;
  }

  /* ---- decorative clouds (day) / stars (night) ---- */
  [[140, 70, 34], [430, 45, 44], [760, 80, 30], [960, 55, 40]].forEach(c => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'cloud');
    [[0, 0, 1], [c[2] * 0.7, -c[2] * 0.35, 0.8], [-c[2] * 0.7, -c[2] * 0.2, 0.7], [c[2] * 0.3, -c[2] * 0.55, 0.6]]
      .forEach(o => {
        const e = document.createElementNS(NS, 'ellipse');
        e.setAttribute('cx', c[0] + o[0]); e.setAttribute('cy', c[1] + o[1]);
        e.setAttribute('rx', c[2] * o[2]); e.setAttribute('ry', c[2] * o[2] * 0.62);
        e.setAttribute('fill', '#ffffff');
        g.appendChild(e);
      });
    svg.appendChild(g);
  });
  for (let i = 0; i < 40; i++) {
    const s = document.createElementNS(NS, 'circle');
    s.setAttribute('class', 'sky-star');
    s.setAttribute('cx', Math.random() * W); s.setAttribute('cy', Math.random() * (H * 0.55));
    s.setAttribute('r', Math.random() * 1.2 + 0.4); s.setAttribute('fill', '#ffffff');
    svg.appendChild(s);
  }

  /* ---- ground strip ---- */
  const ground = document.createElementNS(NS, 'rect');
  ground.setAttribute('x', 0); ground.setAttribute('y', baseY - 2);
  ground.setAttribute('width', W); ground.setAttribute('height', 6);
  ground.setAttribute('rx', 3); ground.setAttribute('fill', 'rgba(18,35,59,0.10)');
  svg.appendChild(ground);

  /* ---- buildings ---- */
  const count = 16;
  const gap = W / (count + 1);
  for (let i = 1; i <= count; i++) {
    const ax = i * gap + (Math.random() * 10 - 5);
    const w = 20 + Math.random() * 10;         // iso half-width
    const h = 42 + Math.random() * 130;        // height
    const color = COLORS[(i + (Math.random() * 2 | 0)) % COLORS.length];
    drawBuilding(ax, baseY, w, h, color, i);
  }

  function drawBuilding(ax, ay, w, h, color, idx) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'bldg');

    const d = w * 0.5; // iso depth factor (2:1)
    const front = [ax, ay], right = [ax + w, ay - d], back = [ax, ay - w], left = [ax - w, ay - d];
    const fT = [ax, ay - h], rT = [ax + w, ay - d - h], bT = [ax, ay - w - h], lT = [ax - w, ay - d - h];

    // front-right face (darkest), front-left face (mid), top (lightest)
    g.appendChild(poly([front, right, rT, fT], shade(color, -34)));
    g.appendChild(poly([left, front, fT, lT], shade(color, -12)));
    g.appendChild(poly([lT, fT, rT, bT], shade(color, 28)));

    // a couple of "window" dots on the left face for character
    const rows = Math.max(1, Math.floor(h / 34));
    for (let r = 0; r < rows; r++) {
      const wy = ay - d * 0.5 - 16 - r * 30;
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', ax - w * 0.45); dot.setAttribute('cy', wy);
      dot.setAttribute('r', 2.4); dot.setAttribute('fill', 'rgba(255,255,255,0.75)');
      g.appendChild(dot);
    }

    svg.appendChild(g);
    setTimeout(() => g.classList.add('rise'), 250 + idx * 70);
  }
})();
