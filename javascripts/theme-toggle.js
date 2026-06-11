(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function effectiveTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (e) {}
    if (stored === 'dark' || stored === 'light') return stored;
    // No manual choice: dark is the design default (matches the CSS :root).
    return 'dark';
  }

  btn.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });
})();
