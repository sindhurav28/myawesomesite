/* =============================================================================
   K&S TRAVEL JOURNAL — PLACE DETAIL PAGE SCRIPT
   Reads ?id=... from the address bar and shows that place's log + photos.
   You normally don't need to edit this file — edit js/data.js instead.
   ========================================================================== */

(function () {
  const places = window.PLACES;

  /* Which place are we showing? */
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const index = places.findIndex(p => p.id === id);
  const place = places[index];

  if (!place) {
    document.getElementById('place-hero').innerHTML =
      '<h1>404</h1><p class="place-sub">We couldn\'t find that place. ' +
      '<a class="back-link" href="index.html">← back to the map</a></p>';
    return;
  }

  document.title = place.name + ' — K&S Travel Journal';

  const coords = place.coords[0].toFixed(4) + '°, ' + place.coords[1].toFixed(4) + '°';

  /* Techy metadata */
  const stopNo = index + 1;
  // Rough UTC offset from longitude (solar time) — labelled "approx"
  const utc = Math.round(place.coords[1] / 15);
  const utcStr = 'UTC' + (utc >= 0 ? '+' + utc : utc);
  const prevStop = places[index - 1];
  const legMiles = prevStop ? Math.round(window.haversineMiles(prevStop.coords, place.coords)) : 0;
  const catLabel = (window.CATEGORIES[place.category] || {}).label || place.category;

  const badges =
    '<div class="badges">' +
      '<span class="badge">stop <b>#' + stopNo + '</b> / ' + places.length + '</span>' +
      '<span class="badge">lat <b>' + place.coords[0].toFixed(4) + '</b> · lng <b>' + place.coords[1].toFixed(4) + '</b></span>' +
      '<span class="badge">' + place.region + '</span>' +
      '<span class="badge">' + catLabel + '</span>' +
      '<span class="badge">tz <b>' + utcStr + '</b> <span style="opacity:.6">(approx)</span></span>' +
      (prevStop ? '<span class="badge"><b>' + legMiles.toLocaleString() + '</b> mi from prev stop</span>' : '<span class="badge"><b>the beginning</b> ✦</span>') +
    '</div>';

  /* Hero */
  document.getElementById('place-hero').innerHTML =
    '<a class="back-link" href="index.html">← back to the map</a>' +
    '<div class="place-emoji">' + place.emoji + '</div>' +
    '<h1>' + place.name + '</h1>' +
    '<div class="place-meta">' + place.date +
      ' <span class="place-coords">· ' + coords + '</span></div>' +
    '<div class="place-sub">' + place.subtitle + '</div>' +
    badges;

  /* Body: memory card + gallery + prev/next */
  const body = document.getElementById('place-body');

  const memory = document.createElement('div');
  memory.className = 'memory-card';
  memory.textContent = place.memory;
  body.appendChild(memory);

  /* Gallery */
  const gallery = document.createElement('div');
  gallery.className = 'gallery';

  if (place.photos && place.photos.length) {
    place.photos.forEach(file => {
      const img = document.createElement('img');
      img.src = 'photos/' + place.id + '/' + file;
      img.alt = place.name;
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(img.src));
      gallery.appendChild(img);
    });
  } else {
    // Friendly placeholders shown until you add real photos
    for (let i = 0; i < 3; i++) {
      const ph = document.createElement('div');
      ph.className = 'photo-placeholder';
      ph.innerHTML = '<div class="big">📷</div>' +
        'drop photos in<br><b>photos/' + place.id + '/</b><br>' +
        'then list the file names in js/data.js';
      gallery.appendChild(ph);
    }
  }
  body.appendChild(gallery);

  /* Prev / next navigation through the journey */
  const prev = places[index - 1];
  const next = places[index + 1];
  const nav = document.createElement('div');
  nav.className = 'place-nav';
  nav.innerHTML =
    (prev
      ? '<a href="place.html?id=' + prev.id + '"><div class="nav-label">← previous stop</div>' +
        '<div class="nav-name">' + prev.emoji + ' ' + prev.name + '</div></a>'
      : '<a class="empty">.</a>') +
    (next
      ? '<a class="next" href="place.html?id=' + next.id + '"><div class="nav-label">next stop →</div>' +
        '<div class="nav-name">' + next.name + ' ' + next.emoji + '</div></a>'
      : '<a class="empty">.</a>');
  body.appendChild(nav);

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();
