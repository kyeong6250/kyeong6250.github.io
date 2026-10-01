document.addEventListener('DOMContentLoaded', function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var progress = document.createElement('div');
  progress.id = 'scrollProgress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  var scrollQueued = false;
  function updateProgress() {
    var maximum = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0) + ')';
    scrollQueued = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  var navToggleBtn = document.getElementById('navToggleBtn');
  var siteNav = document.getElementById('siteNav');
  if (navToggleBtn && siteNav) {
    var setNavOpen = function (isOpen) {
      siteNav.classList.toggle('open', isOpen);
      navToggleBtn.classList.toggle('open', isOpen);
      navToggleBtn.setAttribute('aria-expanded', String(isOpen));
    };
    navToggleBtn.addEventListener('click', function () {
      setNavOpen(!siteNav.classList.contains('open'));
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNavOpen(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('open')) {
        setNavOpen(false);
        navToggleBtn.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!siteNav.classList.contains('open')) return;
      if (siteNav.contains(event.target) || navToggleBtn.contains(event.target)) return;
      setNavOpen(false);
    });
  }

  var projectTabs = Array.from(document.querySelectorAll('#projects [role="tab"]'));
  function selectProjectTab(tab, moveFocus) {
    projectTabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  }
  function selectProjectTabFromHash() {
    var wanted = projectTabs.filter(function (tab) {
      return '#' + tab.getAttribute('aria-controls') === location.hash;
    })[0];
    if (wanted) selectProjectTab(wanted, false);
    return Boolean(wanted);
  }
  if (projectTabs.length) {
    projectTabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectProjectTab(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var target = null;
        if (event.key === 'ArrowRight') target = projectTabs[(index + 1) % projectTabs.length];
        else if (event.key === 'ArrowLeft') target = projectTabs[(index - 1 + projectTabs.length) % projectTabs.length];
        else if (event.key === 'Home') target = projectTabs[0];
        else if (event.key === 'End') target = projectTabs[projectTabs.length - 1];
        if (target) { event.preventDefault(); selectProjectTab(target, true); }
      });
    });
    if (!selectProjectTabFromHash()) selectProjectTab(projectTabs[0], false);
    window.addEventListener('hashchange', selectProjectTabFromHash);
  }

  var els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (reducedMotion.matches) {
    els.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
  }
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

  var navLinks = Array.from(document.querySelectorAll('header nav.site-nav a[href^="#"]'));
  var sections = navLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  function updateActiveNav() {
    var marker = window.scrollY + window.innerHeight * .35;
    var current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top + window.scrollY <= marker) current = section.id;
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  if (!reducedMotion.matches) {
    document.querySelectorAll('#projects article').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        if (event.pointerType === 'touch') return;
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--pointer-x', (x * 100) + '%');
        card.style.setProperty('--pointer-y', (y * 100) + '%');
        card.style.setProperty('--ry', ((x - .5) * 5) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 5) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
});
