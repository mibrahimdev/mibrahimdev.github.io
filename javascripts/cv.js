// cv.js — scroll-reveal for CV timeline items (.cv-reveal).
// Adds `.is-visible` as each element scrolls into view. Honors
// prefers-reduced-motion by revealing everything immediately, and
// degrades gracefully (reveal all) when IntersectionObserver is missing.
(function () {
  var items = document.querySelectorAll('.cv-reveal');
  if (!items.length) return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
