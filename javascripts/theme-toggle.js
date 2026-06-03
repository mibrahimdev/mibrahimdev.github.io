(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function effectiveTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (e) {}
    if (stored === 'dark' || stored === 'light') return stored;
    // No manual choice: fall back to the OS preference (light otherwise).
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  btn.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });
})();
