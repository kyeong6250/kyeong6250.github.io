document.addEventListener('DOMContentLoaded', function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var heroPortrait = document.querySelector('#home > div:last-child');
  var projectSection = document.getElementById('projects');
  if (!heroPortrait || !projectSection || reducedMotion.matches) return;

  var queued = false;
  function moveCamera() {
    var distance = Math.min(window.scrollY * .08, 42);
    heroPortrait.style.setProperty('--camera-shift', distance + 'px');
    queued = false;
  }
  window.addEventListener('scroll', function () {
    if (!queued && window.scrollY < window.innerHeight * 1.5) {
      queued = true;
      requestAnimationFrame(moveCamera);
    }
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        projectSection.classList.add('cinematic-in-view');
        observer.disconnect();
      }
    }, { threshold: .14 });
    observer.observe(projectSection);
  }
});
