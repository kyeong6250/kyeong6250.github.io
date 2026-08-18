document.addEventListener('DOMContentLoaded', function () {
  var navToggleBtn = document.getElementById('navToggleBtn');
  var siteNav = document.getElementById('siteNav');
  if (navToggleBtn && siteNav) {
    navToggleBtn.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      siteNav.style.maxHeight = isOpen ? '320px' : '0px';
      navToggleBtn.classList.toggle('open', isOpen);
      navToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        siteNav.style.maxHeight = '0px';
        navToggleBtn.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var els = Array.from(document.querySelectorAll('[data-reveal]'));
  function reveal(el) {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }
  function checkAll() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh - 60 && rect.bottom > 0) reveal(el);
    });
  }
  var io = null;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  window.addEventListener('scroll', checkAll, { passive: true });
  window.addEventListener('resize', checkAll);
  checkAll();
});
