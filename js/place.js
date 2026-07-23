/* =============================================================================
   OUR JOURNEY — PLACE DETAIL PAGE SCRIPT
   Reads ?id=... from the address bar and shows that place's memories + photos.
   You normally don't need to edit this file — edit js/data.js instead.
   ========================================================================== */

(function () {
  const places = window.PLACES;

  /* Floating hearts */
  (function hearts() {
    const wrap = document.getElementById('hearts');
    const symbols = ['💖', '💕', '💗', '🤍', '✨', '💞'];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.textContent = symbols[i % symbols.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
      s.style.animationDuration = (12 + Math.random() * 16) + 's';
      s.style.animationDelay = (Math.random() * 16) + 's';
      wrap.appendChild(s);
    }
  })();

  /* Which place are we showing? */
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const index = places.findIndex(p => p.id === id);
  const place = places[index];

  if (!place) {
    document.getElementById('place-hero').innerHTML =
      '<h1>Hmm…</h1><p class="place-sub">We couldn\'t find that place. ' +
      '<a class="back-link" href="index.html">← Back to our map</a></p>';
    return;
  }

  document.title = place.name + ' — Our Memories';

  /* Hero */
  document.getElementById('place-hero').innerHTML =
    '<a class="back-link" href="index.html">← Back to our map</a>' +
    '<div class="place-emoji">' + place.emoji + '</div>' +
    '<h1>' + place.name + '</h1>' +
    '<div class="place-date">' + place.date + '</div>' +
    '<div class="place-sub">' + place.subtitle + '</div>';

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
        'Add photos to<br><b>photos/' + place.id + '/</b><br>' +
        '<span style="font-size:0.8rem">then list the file names in js/data.js</span>';
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
      ? '<a href="place.html?id=' + prev.id + '"><div class="nav-label">← Previous stop</div>' +
        '<div class="nav-name">' + prev.emoji + ' ' + prev.name + '</div></a>'
      : '<a class="empty">.</a>') +
    (next
      ? '<a class="next" href="place.html?id=' + next.id + '"><div class="nav-label">Next stop →</div>' +
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
