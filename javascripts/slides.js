// Lightweight carousel for [data-slides]. CSS scroll-snap does the heavy
// lifting; this adds prev/next buttons, a live counter, and keyboard support.
// Degrades gracefully: with JS off, the track is still horizontally swipeable.
(function () {
  function setup(root) {
    var track = root.querySelector('.slides-track');
    var slides = root.querySelectorAll('.slide');
    var cur = root.querySelector('[data-cur]');
    var prev = root.querySelector('.slides-prev');
    var next = root.querySelector('.slides-next');
    if (!track || !slides.length) return;

    function index() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function go(delta) {
      var i = Math.max(0, Math.min(slides.length - 1, index() + delta));
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    }
    function sync() {
      var i = index();
      if (cur) cur.textContent = i + 1;
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= slides.length - 1;
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    });
    var raf;
    track.addEventListener('scroll', function () {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(sync);
    });
    window.addEventListener('resize', sync);
    sync();
  }
  document.querySelectorAll('[data-slides]').forEach(setup);
})();
