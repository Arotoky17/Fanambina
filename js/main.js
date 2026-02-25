/**
 * Association Fanambina — Script commun
 * Navbar, back to top, dark mode, reveal animations (gérés aussi en inline sur l’index si besoin)
 */
(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Back to top (si pas déjà géré en inline)
  ready(function() {
    var backToTop = document.getElementById('backToTop') || document.querySelector('.btn-back-top');
    if (backToTop && !backToTop.dataset.inited) {
      backToTop.dataset.inited = '1';
      window.addEventListener('scroll', function() {
        backToTop.classList.toggle('visible', window.scrollY > 400);
      });
      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Dark mode
    var darkToggle = document.getElementById('darkModeToggle') || document.querySelector('.btn-dark-mode');
    if (darkToggle && !darkToggle.dataset.inited) {
      darkToggle.dataset.inited = '1';
      function updateDarkModeBtn(isDark) {
        var label = isDark ? 'Désactiver le mode sombre' : 'Activer le mode sombre';
        darkToggle.setAttribute('aria-label', label);
        darkToggle.setAttribute('title', label);
      }
      var initDark = localStorage.getItem('theme') === 'dark';
      if (initDark) document.body.classList.add('dark-mode');
      updateDarkModeBtn(initDark);
      darkToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateDarkModeBtn(isDark);
      });
    }

    // Navbar scrolled
    var navbar = document.querySelector('.navbar-fanambina') || document.querySelector('.navbar');
    if (navbar) {
      function checkScroll() { navbar.classList.toggle('scrolled', window.scrollY > 50); }
      window.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    // Reveal au scroll (si pas déjà fait en inline)
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length && !document.querySelector('.reveal.revealed')) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) e.target.classList.add('revealed');
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function(el) { observer.observe(el); });
    }

    // Fermer menu mobile au clic sur un lien (y compris les ancres)
    document.querySelectorAll('.navbar .nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        var collapse = document.querySelector('.navbar-collapse.show');
        if (collapse && window.bootstrap && window.bootstrap.Collapse) {
          var c = bootstrap.Collapse.getOrCreateInstance(collapse);
          if (c) c.hide();
        }
      });
    });

    // Animation compteur pour les stat-number
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length) {
      var statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = '1';
            var target = parseInt(entry.target.getAttribute('data-count'));
            var suffix = entry.target.getAttribute('data-suffix') || '';
            var duration = 1400;
            var startTime = null;
            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(ease * target);
              entry.target.textContent = current + suffix;
              if (progress < 1) requestAnimationFrame(step);
              else entry.target.textContent = target + suffix;
            }
            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.6 });
      statNumbers.forEach(function(el) { statObserver.observe(el); });
    }
  });
})();
