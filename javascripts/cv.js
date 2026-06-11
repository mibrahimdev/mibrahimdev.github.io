// cv.js — scroll-reveal for the experience timeline (.tl-item).
// Adds `.is-visible` as each entry scrolls into view, which triggers the
// spine-draw / dot-pop / fade-up keyframes in style.scss. Under
// prefers-reduced-motion the CSS skips the animations, so adding the class
// just shows the content instantly. Degrades gracefully (reveal all) when
// IntersectionObserver is missing.
(function () {
  var items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
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
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.25 }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
