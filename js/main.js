/* =============================================================================
   K&S TRAVEL JOURNAL — HOME PAGE SCRIPT
   Builds the stats dashboard, the interactive map with the trail, the legend,
   and the timeline. You normally don't need to edit this file.
   ========================================================================== */

(function () {
  const places = window.PLACES;
  const categories = window.CATEGORIES;

  /* ---------- Fun-fact stats ---------- */
  (function stats() {
    const countries = new Set(places.map(p => p.country));
    const regions = new Set(places.map(p => p.region));
    const parks = places.reduce((sum, p) => sum + (p.nationalParks || 0), 0);
    const firstYear = parseInt(places[0].sort.slice(0, 4), 10);
    const yearsTogether = new Date().getFullYear() - firstYear;

    const data = [
      { num: places.length, label: 'Destinations' },
      { num: countries.size, label: 'Countries' },
      { num: parks + '+', label: 'National Parks' },
      { num: regions.size + '+', label: 'States & Regions' },
      { num: yearsTogether + '+', label: 'Years Together' },
    ];

    const box = document.getElementById('stats');
    data.forEach(d => {
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML = '<div class="num">' + d.num + '</div><div class="label">' + d.label + '</div>';
      box.appendChild(el);
    });

    const fc = document.getElementById('footer-count');
    if (fc) fc.textContent = places.length;
  })();

  /* ---------- Map legend ---------- */
  (function legend() {
    const box = document.getElementById('legend');
    Object.keys(categories).forEach(key => {
      const c = categories[key];
      const el = document.createElement('div');
      el.className = 'legend-item';
      el.innerHTML = '<span class="legend-dot" style="background:' + c.color + ';color:' + c.color + '"></span>' + c.label;
      box.appendChild(el);
    });
  })();

  /* ---------- Timeline ---------- */
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

  /* ---------- Map (built last & guarded so nothing else depends on it) ---------- */
  (function drawMap() {
    try {
      // scrollWheelZoom starts OFF so scrolling the page doesn't hijack into the map.
      const map = L.map('map', { scrollWheelZoom: false });

      // Two tile sets so the map matches the light/dark theme.
      const TILES = {
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      };
      let tileLayer = null;
      function setTiles(theme) {
        if (tileLayer) map.removeLayer(tileLayer);
        tileLayer = L.tileLayer(TILES[theme === 'light' ? 'light' : 'dark'], {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);
      }
      const startTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTiles(startTheme);
      // theme.js calls this when the toggle is clicked
      window.onThemeChange = setTiles;

      // Enable wheel-zoom only while the user is interacting with the map,
      // so it never fights with normal page scrolling (and the page won't zoom).
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur', () => map.scrollWheelZoom.disable());
      map.on('click', () => map.scrollWheelZoom.enable());
      map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

      // The dotted "journey trail" connecting places in chronological order
      const trail = places.map(p => p.coords);
      L.polyline(trail, {
        color: '#2dd4bf',
        weight: 2.5,
        opacity: 0.8,
        dashArray: '2, 10',
        lineCap: 'round'
      }).addTo(map);

      // A pin for each place
      const bounds = [];
      places.forEach(p => {
        const cat = categories[p.category] || { color: '#2dd4bf' };
        const icon = L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + cat.color + '"><span>' + p.emoji + '</span></div>',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -32]
        });

        const marker = L.marker(p.coords, { icon: icon }).addTo(map);
        const coords = p.coords[0].toFixed(3) + ', ' + p.coords[1].toFixed(3);
        marker.bindPopup(
          '<p class="popup-title">' + p.name + '</p>' +
          '<p class="popup-meta">' + p.date + ' · ' + coords + '</p>' +
          '<a class="popup-link" href="place.html?id=' + p.id + '">open log →</a>'
        );
        bounds.push(p.coords);
      });

      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (err) {
      const el = document.getElementById('map');
      if (el) {
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.textAlign = 'center';
        el.innerHTML = '<div style="padding:2rem;color:var(--muted);font-family:var(--mono)">' +
          'The map needs an internet connection to load. 🌍<br>The full journey is listed below. ↓</div>';
      }
      console.error('Map failed to load:', err);
    }
  })();
})();
