/* =============================================================================
   OUR JOURNEY — HOME PAGE SCRIPT
   Builds the fun-fact stats, the interactive map with the dotted trail,
   the map legend, and the timeline. You normally don't need to edit this file.
   ========================================================================== */

(function () {
  const places = window.PLACES;
  const categories = window.CATEGORIES;

  /* ---------- Floating hearts decoration ---------- */
  (function hearts() {
    const wrap = document.getElementById('hearts');
    const symbols = ['💖', '💕', '💗', '🤍', '✨', '💞'];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.textContent = symbols[i % symbols.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
      s.style.animationDuration = (12 + Math.random() * 16) + 's';
      s.style.animationDelay = (Math.random() * 16) + 's';
      wrap.appendChild(s);
    }
  })();

  /* ---------- Fun-fact stats ---------- */
  (function stats() {
    const countries = new Set(places.map(p => p.country));
    const regions = new Set(places.map(p => p.region));
    const parks = places.reduce((sum, p) => sum + (p.nationalParks || 0), 0);
    const firstYear = parseInt(places[0].sort.slice(0, 4), 10);
    const yearsTogether = new Date().getFullYear() - firstYear;

    const data = [
      { emoji: '📍', num: places.length, label: 'Destinations' },
      { emoji: '🌎', num: countries.size, label: 'Countries' },
      { emoji: '🏞️', num: parks + '+', label: 'National Parks' },
      { emoji: '🗺️', num: regions.size + '+', label: 'States & Regions' },
      { emoji: '💞', num: yearsTogether + '+', label: 'Years Together' },
    ];

    const box = document.getElementById('stats');
    data.forEach(d => {
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML =
        '<div class="emoji">' + d.emoji + '</div>' +
        '<div class="num">' + d.num + '</div>' +
        '<div class="label">' + d.label + '</div>';
      box.appendChild(el);
    });
  })();

  /* ---------- Map legend ---------- */
  (function legend() {
    const box = document.getElementById('legend');
    Object.keys(categories).forEach(key => {
      const c = categories[key];
      const el = document.createElement('div');
      el.className = 'legend-item';
      el.innerHTML = '<span class="legend-dot" style="background:' + c.color + '"></span>' + c.label;
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
      const map = L.map('map', { scrollWheelZoom: false });

      // Soft, light-toned map tiles (CARTO "Positron") to match the pastel theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // The dotted "journey trail" connecting places in chronological order
      const trail = places.map(p => p.coords);
      L.polyline(trail, {
        color: '#e5679b',
        weight: 2.5,
        opacity: 0.75,
        dashArray: '2, 10',
        lineCap: 'round'
      }).addTo(map);

      // A pin for each place
      const bounds = [];
      places.forEach(p => {
        const cat = categories[p.category] || { color: '#e5679b' };
        const icon = L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + cat.color + '"><span>' + p.emoji + '</span></div>',
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36]
        });

        const marker = L.marker(p.coords, { icon: icon }).addTo(map);
        marker.bindPopup(
          '<p class="popup-title">' + p.name + '</p>' +
          '<p class="popup-date">' + p.date + '</p>' +
          '<a class="popup-link" href="place.html?id=' + p.id + '">Open our memories →</a>'
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
        el.innerHTML = '<div style="padding:2rem;color:#8a7680;font-family:Playfair Display,serif">' +
          'The map needs an internet connection to load. 🌍<br>Our journey is still listed below. 💗</div>';
      }
      console.error('Map failed to load:', err);
    }
  })();
})();
