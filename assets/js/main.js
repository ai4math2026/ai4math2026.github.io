/* ============================================================
   AI for Math Workshop @ ICML 2026 — Main JS
   ============================================================ */

(function() {
  'use strict';

  // ---- Navbar scroll shadow ----
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64'
  );

  function setActiveLink() {
    let current = '';
    sections.forEach(function(section) {
      const top = section.getBoundingClientRect().top;
      if (top <= navHeight + 40) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- Scroll reveal and ambient motion ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.body.classList.add('motion-ready');
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const heroNodes = document.querySelectorAll('.hero-badge, .hero-title, .hero-meta, .hero-actions');
    heroNodes.forEach(function(el, index) {
      el.dataset.reveal = 'hero';
      el.style.setProperty('--reveal-delay', index * 110 + 'ms');
    });

    [
      ['.section-title', 'soft', 0],
      ['.section-subtitle', 'soft', 70],
      ['.subsection-title', 'soft', 0],
      ['.news-item', 'soft', 85],
      ['.about-panel', 'card', 90],
      ['.about-bridge, .about-footnote', 'soft', 90],
      ['#speakers .person-card', 'card', 85],
      ['#organizers .person-card.compact', 'card', 65],
      ['.schedule-column:first-child .schedule-item', 'left', 55],
      ['.schedule-column:last-child .schedule-item', 'right', 55],
      ['.schedule-cluster .schedule-item.poster', 'left', 80],
      ['.schedule-cluster .schedule-item.closing', 'right', 120],
      ['.topic-card', 'card', 70],
      ['.cfp-sidebar', 'right', 80],
      ['.challenge-card', 'card', 90],
      ['.sponsors-placeholder', 'soft', 0],
      ['.footer-col', 'soft', 55]
    ].forEach(function(config) {
      document.querySelectorAll(config[0]).forEach(function(el, index) {
        el.dataset.reveal = config[1];
        el.style.setProperty('--reveal-delay', index * config[2] + 'ms');
      });
    });

    requestAnimationFrame(function() {
      heroNodes.forEach(function(el) {
        el.classList.add('is-visible');
      });
    });

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -12% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  // ---- Hamburger animation ----
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const spans = navToggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
      }
    });
  }

})();
