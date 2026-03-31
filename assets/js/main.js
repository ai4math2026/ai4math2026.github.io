/* ============================================================
   AI for Math Workshop @ ICML 2026 — Main JS
   ============================================================ */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');

  // ---- Navbar scroll shadow ----
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

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

  // ---- Scroll reveal and ambient motion ----
  if (!prefersReducedMotion) {
    document.body.classList.add('motion-ready');
  }

  function updateHeroMotion() {
    if (prefersReducedMotion || !hero) {
      return;
    }

    const maxScroll = Math.max(hero.offsetHeight - navHeight + 80, 1);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty('--hero-content-shift', (-32 * progress).toFixed(2) + 'px');
    rootStyle.setProperty('--hero-content-scale', (1 - 0.018 * progress).toFixed(4));
    rootStyle.setProperty('--hero-content-opacity', (1 - 0.14 * progress).toFixed(4));
    rootStyle.setProperty('--hero-overlay-shift', (18 * progress).toFixed(2) + 'px');
    rootStyle.setProperty('--hero-overlay-opacity', (1 - 0.18 * progress).toFixed(4));
    rootStyle.setProperty('--hero-bg-shift', (-20 * progress).toFixed(2) + 'px');
  }

  let scrollFrame = null;
  function syncScrollState() {
    handleScroll();
    setActiveLink();
    updateHeroMotion();
    scrollFrame = null;
  }

  function queueScrollSync() {
    if (scrollFrame !== null) {
      return;
    }
    scrollFrame = window.requestAnimationFrame(syncScrollState);
  }

  window.addEventListener('scroll', queueScrollSync, { passive: true });
  window.addEventListener('resize', queueScrollSync);
  syncScrollState();

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const heroNodes = document.querySelectorAll('.hero-badge, .hero-title, .hero-meta, .hero-actions');
    heroNodes.forEach(function(el, index) {
      el.dataset.reveal = 'hero';
      el.style.setProperty('--reveal-delay', index * 85 + 'ms');
    });

    [
      ['.section-title', 'soft', 0],
      ['.section-subtitle', 'soft', 55],
      ['.subsection-title', 'soft', 0],
      ['.news-item', 'soft', 70],
      ['.about-panel', 'card', 70],
      ['.about-bridge, .about-footnote', 'soft', 70],
      ['.topic-list li', 'soft', 45],
      ['.info-card', 'soft', 60],
      ['#speakers .person-card', 'card', 70],
      ['#organizers .person-card.compact', 'card', 55],
      ['.schedule-column:first-child .schedule-item', 'left', 45],
      ['.schedule-column:last-child .schedule-item', 'right', 45],
      ['.schedule-cluster .schedule-item.poster', 'left', 65],
      ['.schedule-cluster .schedule-item.closing', 'right', 90],
      ['.topic-card', 'card', 60],
      ['.cfp-sidebar', 'right', 65],
      ['.challenge-card', 'card', 75],
      ['.sponsors-placeholder', 'soft', 0],
      ['.footer-col', 'soft', 45]
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
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  // ---- Expandable speaker bios ----
  (function setupSpeakerBioToggles() {
    const bios = Array.from(document.querySelectorAll('#speakers .person-bio'));
    if (!bios.length) {
      return;
    }

    const refreshers = [];
    let allExpanded = false;

    function syncState(bio, expanded) {
      bio.classList.toggle('is-expanded', expanded);
      if (!bio.classList.contains('is-static')) {
        bio.setAttribute('aria-expanded', String(expanded));
      }
    }

    function setAllBios(expanded) {
      allExpanded = expanded;
      bios.forEach(function(bio) {
        if (!bio.classList.contains('is-static')) {
          syncState(bio, expanded);
        }
      });
    }

    bios.forEach(function(bio) {
      bio.classList.add('is-collapsed');

      function handleToggle() {
        if (bio.classList.contains('is-static')) {
          return;
        }
        setAllBios(!allExpanded);
      }

      bio.setAttribute('role', 'button');
      bio.setAttribute('tabindex', '0');
      bio.setAttribute('aria-expanded', 'false');

      bio.addEventListener('click', handleToggle);
      bio.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      });

      refreshers.push(function() {
        syncState(bio, false);
        const needsToggle = bio.scrollHeight > bio.clientHeight + 4;
        bio.classList.toggle('is-static', !needsToggle);

        if (needsToggle) {
          bio.setAttribute('role', 'button');
          bio.setAttribute('tabindex', '0');
          syncState(bio, allExpanded);
        } else {
          bio.removeAttribute('role');
          bio.removeAttribute('tabindex');
          bio.removeAttribute('aria-expanded');
        }
      });
    });

    function refreshSpeakerBios() {
      refreshers.forEach(function(refresh) {
        refresh();
      });
    }

    window.addEventListener('resize', refreshSpeakerBios);
    window.requestAnimationFrame(refreshSpeakerBios);
  })();

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
