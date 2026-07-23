/* =============================================================================
   K&S TRAVEL JOURNAL — SHARED FX + EASTER-EGG ENGINE  (window.KNS)
   Toasts, the egg-hunt HUD, and wiring for anything with a data-egg attribute
   (inline tokens in the dossier AND objects created in the isometric world).
   ========================================================================== */
(function () {
  const EGGS = {
    piper:   { title: 'Pied Piper', text: 'Our scrappy little startup. Turns out the best compression algorithm just squeezes 4 years and 36 destinations into one map. 🥧' },
    commas:  { title: 'Tres Commas', text: 'Three commas = a billion dollars 🤑 — and roughly the number of reasons I love you.' },
    anton:   { title: 'Anton', text: 'Anton is back online. 🖥️ Uptime since 2022. Zero downtime, zero regrets.' },
    middleout:{ title: 'Middle-Out', text: 'The infamous whiteboard. Peak efficiency — discovered... creatively. Weissman score: 5.2. 🍆➗ (iykyk)' },
    hotdog:  { title: 'SeeFood™', text: 'Running "Not Hotdog"… 🌭 → <span class="nothotdog">HOTDOG ✅</span> (it only knows two things, much like me before I met you).' },
    robot:   { title: 'Fiona', text: 'Fiona, the "companion" robot. 🤖 Deeply unsettling — yet still less complicated than dating was before I met you.' },
    painting:{ title: 'The Painting', text: 'The infamous painting — briefly worth more than the entire company. 🖼️ Our memories, though? Priceless, and not for sale.' },
    jacket:  { title: "Jared's Jacket", text: 'Jared folded it with love and walked away. 🧥 We just fold ours into a carry-on and go somewhere new.' }
  };
  const TOTAL = Object.keys(EGGS).length;

  /* ---------- toasts ---------- */
  let toastWrap;
  function toast(title, html) {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-wrap';
      document.body.appendChild(toastWrap);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = (title ? '<span class="toast-title">' + title + '</span>' : '') + html;
    toastWrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 5200);
  }

  /* ---------- egg tracking ---------- */
  let found;
  try { found = new Set(JSON.parse(sessionStorage.getItem('kns-eggs') || '[]')); }
  catch (e) { found = new Set(); }
  function persist() { try { sessionStorage.setItem('kns-eggs', JSON.stringify(Array.prototype.slice.call(found))); } catch (e) {} }

  const hud = document.createElement('div');
  hud.className = 'egg-hud';
  document.body.appendChild(hud);
  function renderHud() {
    const n = found.size;
    hud.innerHTML = '🥚 easter eggs · <b>' + n + '</b> / ' + TOTAL +
      '<span class="egg-hint">' +
        (n >= TOTAL
          ? 'you found them all. this guy <i>ships</i>. 🏆'
          : 'the valley is full of secrets. drag to explore & tap what looks clickable. 👀') +
      '</span>';
    hud.classList.toggle('complete', n >= TOTAL);
  }
  renderHud();

  function markFound(id) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-egg="' + id + '"]'), el => el.classList.add('found'));
  }
  function reveal(id) {
    const egg = EGGS[id];
    if (egg) toast('🥚 ' + egg.title, egg.text);
    markFound(id);
    if (!found.has(id)) {
      found.add(id); persist(); renderHud();
      if (found.size >= TOTAL) {
        setTimeout(() => toast('🏆 Acquisition complete', 'All secrets found. Hooli tried to buy them. We said no. 🥧'), 1000);
      }
    }
  }

  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-egg]'), el => {
      if (el.__eggWired) return;
      el.__eggWired = true;
      const id = el.getAttribute('data-egg');
      if (found.has(id)) el.classList.add('found');
      el.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); reveal(id); });
    });
  }

  window.KNS = { toast: toast, reveal: reveal, rescan: wire, foundCount: () => found.size, eggTotal: TOTAL };
  document.addEventListener('DOMContentLoaded', wire);
  wire();
})();
