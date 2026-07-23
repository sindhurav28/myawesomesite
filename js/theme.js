/* =============================================================================
   K&S TRAVEL JOURNAL — THEME TOGGLE
   Remembers your choice (dark / light) and lets the map react to it.
   ========================================================================== */
(function () {
  const KEY = 'kns-theme';
  const root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '☾ dark mode' : '☀ light mode';
    // let the map (if present) swap its tiles
    if (typeof window.onThemeChange === 'function') window.onThemeChange(theme);
  }

  // Wire up the button once the DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      apply(current()); // sets the correct button label
      btn.addEventListener('click', function () {
        apply(current() === 'light' ? 'dark' : 'light');
      });
    }
  });

  window.KNSTheme = { current: current, apply: apply };
})();
