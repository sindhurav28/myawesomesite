/* =============================================================================
   K&S TRAVEL JOURNAL — HOME PAGE SCRIPT
   Stats dashboard (with count-up), trips-by-year chart, interactive map with
   an animated self-drawing trail + traveling pulse, category filters, timeline,
   and a terminal "boot" intro with a self-typing title.
   You normally don't need to edit this file.
   ========================================================================== */

(function () {
  const places = window.PLACES;
  const categories = window.CATEGORIES;

  /* ============================ TERMINAL BOOT INTRO ======================== */
  (function boot() {
    let booted = false;
    try { booted = sessionStorage.getItem('kns-booted') === '1'; } catch (e) {}

    if (booted) { showTitleStatic(); return; }

    const overlay = document.createElement('div');
    overlay.className = 'boot';
    overlay.innerHTML = '<div class="boot-inner"></div><div class="skip">click anywhere to skip</div>';
    document.body.appendChild(overlay);
    const inner = overlay.querySelector('.boot-inner');

    const lines = [
      '> booting <span class="accent">Pied Piper</span> platform ...........',
      '> initializing middle-out compression ... <span class="ok">ok</span>',
      '> Weissman score: <span class="accent">5.2</span> (optimal) ......... <span class="ok">ok</span>',
      '> mounting <span class="accent">relationship.db</span> (' + places.length + ' memories) <span class="ok">ok</span>',
      '> SmartPipe™ syncing .................... <span class="ok">ok</span>',
      '> "this could be worth <span class="accent">billions</span>" — Russ <span class="ok">✓</span>',
      '> launch <span class="ok">🥧</span>'
    ];

    let i = 0, timer = null, finished = false;
    function step() {
      if (i < lines.length) {
        inner.innerHTML = lines.slice(0, i + 1).join('<br>') +
          (i < lines.length - 1 ? ' <span class="cursor"></span>' : '');
        i++;
        timer = setTimeout(step, 230);
      } else {
        timer = setTimeout(finish, 550);
      }
    }
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try { sessionStorage.setItem('kns-booted', '1'); } catch (e) {}
      overlay.classList.add('done');
      setTimeout(() => overlay.remove(), 550);
      typeTitle();
    }
    overlay.addEventListener('click', finish);
    document.addEventListener('keydown', function onKey(e) {
      document.removeEventListener('keydown', onKey); finish();
    });
    step();
  })();

  function showTitleStatic() {
    const el = document.getElementById('hero-title');
    if (el) el.innerHTML = 'K&amp;S Travel Journal';
  }

  function typeTitle() {
    const el = document.getElementById('hero-title');
    if (!el) return;
    const text = 'K&S Travel Journal';
    let i = 0;
    (function stepType() {
      if (i <= text.length) {
        el.innerHTML = text.slice(0, i).replace(/&/g, '&amp;') + '<span class="type-cursor">▋</span>';
        i++;
        setTimeout(stepType, 75);
      } else {
        setTimeout(() => { el.innerHTML = text.replace(/&/g, '&amp;'); }, 1200);
      }
    })();
  }

  /* ============================ COUNT-UP HELPERS ========================== */
  function animateCount(el, target, opts) {
    opts = opts || {};
    const dur = 1200;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = Math.round(target * eased);
      el.textContent = (opts.format ? opts.format(val) : val) + (opts.suffix || '');
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const withCommas = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /* ============================ STATS DASHBOARD =========================== */
  const statTargets = [];
  (function stats() {
    const countries = new Set(places.map(p => p.country));
    const regions = new Set(places.map(p => p.region));
    const parks = places.reduce((sum, p) => sum + (p.nationalParks || 0), 0);
    const firstYear = parseInt(places[0].sort.slice(0, 4), 10);
    const yearsTogether = new Date().getFullYear() - firstYear;
    const miles = Math.floor(window.totalJourneyMiles / 100) * 100;

    // Lists shown in the pop-up when a stat is clicked
    const countryCounts = {}, regionCounts = {};
    places.forEach(p => {
      countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
      regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
    });
    const destList = places.map(p => ({ name: p.emoji + ' ' + p.name, meta: p.date }));
    const countryList = Object.keys(countryCounts).sort().map(c => ({ name: c, meta: countryCounts[c] + ' stops' }));
    const regionList = Object.keys(regionCounts).sort().map(r => ({ name: r, meta: regionCounts[r] + '' }));
    const parkList = (window.NATIONAL_PARKS || []).map(n => ({ name: n, meta: '' }));

    const data = [
      { num: places.length, label: 'Markets Entered', title: 'All ' + places.length + ' Destinations', list: destList },
      { num: countries.size, label: 'Global Reach', title: 'Countries Visited', list: countryList },
      { num: parks, suffix: '+', label: 'Parks Shipped', title: 'National Parks Explored', list: parkList },
      { num: regions.size, suffix: '+', label: 'Regions Scaled', title: 'States & Regions', list: regionList },
      { num: yearsTogether, suffix: '+', label: 'Runway (yrs)' },
      { num: miles, suffix: '+', label: 'Distance Scaled (mi)', format: withCommas },
    ];

    const box = document.getElementById('stats');
    data.forEach(d => {
      const el = document.createElement('div');
      el.className = 'stat' + (d.list ? ' clickable' : '');
      const numEl = document.createElement('div');
      numEl.className = 'num';
      numEl.textContent = '0' + (d.suffix || '');
      const labelEl = document.createElement('div');
      labelEl.className = 'label';
      labelEl.textContent = d.label;
      el.appendChild(numEl);
      el.appendChild(labelEl);
      if (d.list) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', () => showList(d.title, d.list));
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showList(d.title, d.list); } });
      }
      box.appendChild(el);
      statTargets.push({ el: numEl, target: d.num, suffix: d.suffix, format: d.format });
    });

    const fc = document.getElementById('footer-count');
    if (fc) fc.textContent = places.length;

    // Count up when the stats scroll into view (once)
    observeOnce(box, () => {
      statTargets.forEach(s => animateCount(s.el, s.target, { suffix: s.suffix, format: s.format }));
    });
  })();

  /* ============================ TRIPS-PER-YEAR CHART ====================== */
  (function chart() {
    const box = document.getElementById('chart');
    if (!box) return;
    const counts = {};
    places.forEach(p => {
      const y = p.sort.slice(0, 4);
      counts[y] = (counts[y] || 0) + 1;
    });
    const years = Object.keys(counts).sort();
    const max = Math.max.apply(null, years.map(y => counts[y]));

    const bars = [];
    years.forEach(y => {
      const col = document.createElement('div');
      col.className = 'chart-col';
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.innerHTML = '<span class="cval">' + counts[y] + '</span>';
      const yr = document.createElement('div');
      yr.className = 'chart-year';
      yr.textContent = y;
      col.appendChild(bar);
      col.appendChild(yr);
      box.appendChild(col);
      bars.push({ bar: bar, pct: (counts[y] / max) * 100 });
    });

    observeOnce(box, () => {
      bars.forEach((b, idx) => {
        setTimeout(() => { b.bar.style.height = b.pct + '%'; }, idx * 120);
      });
    });
  })();

  /* ============================ TIMELINE ================================== */
  (function timeline() {
    const box = document.getElementById('timeline');
    places.forEach(p => {
      const item = document.createElement('div');
      item.className = 'tl-item';
      item.innerHTML =
        '<div class="dot">' + p.emoji + '</div>' +
        '<a href="place.html?id=' + p.id + '">' +
          '<div class="tl-date">' + p.date + '</div>' +
          '<div class="tl-name">' + p.name + '</div>' +
          '<div class="tl-sub">' + p.subtitle + '</div>' +
        '</a>';
      box.appendChild(item);
    });
  })();

  /* ============================ MAP ====================================== */
  (function drawMap() {
    try {
      const map = L.map('map', { scrollWheelZoom: false, zoomControl: true });

      const TILES = {
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      };
      let tileLayer = null;
      function setTiles(theme) {
        if (tileLayer) map.removeLayer(tileLayer);
        tileLayer = L.tileLayer(TILES[theme === 'light' ? 'light' : 'dark'], {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd', maxZoom: 19
        }).addTo(map);
      }
      setTiles(document.documentElement.getAttribute('data-theme') || 'dark');
      window.onThemeChange = setTiles;

      // wheel-zoom only while interacting with the map (never zooms the page)
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur', () => map.scrollWheelZoom.disable());
      map.on('click', () => map.scrollWheelZoom.enable());
      map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

      // Markers grouped by category (for filtering)
      const groups = {};
      Object.keys(categories).forEach(k => { groups[k] = L.layerGroup().addTo(map); });

      const bounds = [];
      places.forEach(p => {
        const cat = categories[p.category] || { color: '#2dd4bf' };
        const icon = L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + cat.color + '"><span>' + p.emoji + '</span></div>',
          iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32]
        });
        const marker = L.marker(p.coords, { icon: icon });
        const coords = p.coords[0].toFixed(3) + ', ' + p.coords[1].toFixed(3);
        marker.bindPopup(
          '<p class="popup-title">' + p.name + '</p>' +
          '<p class="popup-meta">' + p.date + ' · ' + coords + '</p>' +
          '<a class="popup-link" href="place.html?id=' + p.id + '">open case study →</a>'
        );
        (groups[p.category] || groups[Object.keys(groups)[0]]).addLayer(marker);
        bounds.push(p.coords);
      });

      map.fitBounds(bounds, { padding: [50, 50] });

      // ---- Filter buttons (double as the legend) ----
      const filterBox = document.getElementById('filters');
      if (filterBox) {
        Object.keys(categories).forEach(key => {
          const c = categories[key];
          const btn = document.createElement('button');
          btn.className = 'filter-btn';
          btn.type = 'button';
          btn.innerHTML = '<span class="fdot" style="background:' + c.color + '"></span>' + c.label;
          btn.addEventListener('click', () => {
            const off = btn.classList.toggle('off');
            if (off) map.removeLayer(groups[key]); else map.addLayer(groups[key]);
          });
          filterBox.appendChild(btn);
        });
      }

      // ---- Animated self-drawing trail + traveling pulse ----
      const pts = places.map(p => p.coords);
      const trail = L.polyline([pts[0]], {
        color: '#3ecf8e', weight: 2.5, opacity: 0.9, dashArray: '2, 10', lineCap: 'round'
      }).addTo(map);

      const pulseIcon = L.divIcon({ className: '', html: '<div class="pulse-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
      const pulse = L.marker(pts[0], { icon: pulseIcon, interactive: false }).addTo(map);

      try {
        const drawn = [pts[0]];
        let seg = 1, stepN = 0;
        const STEPS = 7;
        const iv = setInterval(() => {
          if (seg >= pts.length) { clearInterval(iv); return; }
          const a = pts[seg - 1], b = pts[seg];
          stepN++;
          const f = stepN / STEPS;
          const cur = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
          trail.setLatLngs(drawn.concat([cur]));
          pulse.setLatLng(cur);
          if (stepN >= STEPS) { drawn.push(b); seg++; stepN = 0; }
        }, 18);
      } catch (e) {
        trail.setLatLngs(pts); // fallback: show full trail at once
        pulse.setLatLng(pts[pts.length - 1]);
      }
    } catch (err) {
      const el = document.getElementById('map');
      if (el) {
        el.style.cssText += 'display:flex;align-items:center;justify-content:center;text-align:center;';
        el.innerHTML = '<div style="padding:2rem;color:var(--muted);font-family:var(--mono)">' +
          'The map needs an internet connection to load. 🌍<br>The full journey is listed below. ↓</div>';
      }
      console.error('Map failed to load:', err);
    }
  })();

  /* ============================ STAT LIST POP-UP ========================= */
  let listpopEl = null;
  function showList(title, items) {
    if (!listpopEl) {
      listpopEl = document.createElement('div');
      listpopEl.className = 'listpop';
      listpopEl.innerHTML = '<div class="listpop-card"><h3></h3><ul></ul>' +
        '<button class="listpop-close" type="button">close</button></div>';
      document.body.appendChild(listpopEl);
      listpopEl.addEventListener('click', e => { if (e.target === listpopEl) hideList(); });
      listpopEl.querySelector('.listpop-close').addEventListener('click', hideList);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') hideList(); });
    }
    listpopEl.querySelector('h3').textContent = title;
    const ul = listpopEl.querySelector('ul');
    ul.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(it.name));
      if (it.meta) {
        const m = document.createElement('span');
        m.textContent = it.meta;
        li.appendChild(m);
      }
      ul.appendChild(li);
    });
    listpopEl.classList.add('open');
  }
  function hideList() { if (listpopEl) listpopEl.classList.remove('open'); }

  /* ============================ UTIL ===================================== */
  function observeOnce(target, cb) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { cb(); io.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(target);
  }
})();
