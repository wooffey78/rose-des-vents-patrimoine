/* ============================================================
   ROSE DES VENTS PATRIMOINE — main.js  v2.0
   Vanilla JS · Mobile First · Sans framework
   ============================================================ */

'use strict';

/* ── 1. MENU MOBILE ──────────────────────────────────────────
   Gestion ouverture / fermeture du menu overlay mobile.
   ─────────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const btn       = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn  = document.querySelector('.mobile-nav-close');

  if (!btn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });
}());


/* ── 2. ANNÉE DYNAMIQUE FOOTER ───────────────────────────────
   Injecte l'année courante dans tous les éléments .js-year.
   ─────────────────────────────────────────────────────────── */
(function setYear() {
  var year = new Date().getFullYear();
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = year;
  });
}());


/* ── 3. LIEN ACTIF NAVIGATION ────────────────────────────────
   Ajoute la classe .active sur le lien correspondant à la page.
   ─────────────────────────────────────────────────────────── */
(function setActiveNav() {
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html') ||
        href === '/' + current) {
      link.classList.add('active');
    }
  });
}());


/* ── 4. BARRE DE PROGRESSION DU SCROLL ──────────────────────
   Fine barre colorée en haut de page indiquant l'avancement
   dans le défilement du document.
   ─────────────────────────────────────────────────────────── */
(function initScrollProgress() {
  var bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'height:3px',
    'width:0%',
    'background:linear-gradient(90deg, rgb(96,46,25), rgb(210,180,155))',
    'z-index:2000',
    'transition:width 0.1s linear',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(bar);

  function updateBar() {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}());


/* ── 5. HEADER — EFFET SCROLL ────────────────────────────────
   Le header gagne une ombre portée et se compacte légèrement
   dès que l'utilisateur commence à défiler.
   ─────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  /* Injection des styles dynamiques via une <style> dédiée */
  var style = document.createElement('style');
  style.textContent = [
    '.site-header {',
    '  transition: box-shadow 0.35s ease, background-color 0.35s ease;',
    '}',
    '.site-header.scrolled {',
    '  box-shadow: 0 4px 24px rgba(96,46,25,0.28);',
    '  background-color: rgba(10,8,6,0.97);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());


/* ── 6. RÉVÉLATION AU SCROLL (Intersection Observer) ─────────
   Les éléments ciblés s'animent à l'entrée dans le viewport.
   Trois variantes : fade-up (défaut), fade-left, fade-right.
   Les cartes de service reçoivent un délai en cascade (stagger).
   ─────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  /* ── Injection des classes CSS nécessaires ── */
  var style = document.createElement('style');
  style.textContent = [
    /* État initial : invisible, décalé */
    '.sr-hidden {',
    '  opacity: 0;',
    '  transition: opacity 0.65s ease, transform 0.65s ease;',
    '}',
    '.sr-up    { transform: translateY(2rem); }',
    '.sr-left  { transform: translateX(-2rem); }',
    '.sr-right { transform: translateX(2rem); }',

    /* État visible : animation terminée */
    '.sr-visible {',
    '  opacity: 1 !important;',
    '  transform: none !important;',
    '}',

    /* Délais de cascade pour les grilles */
    '.sr-delay-1 { transition-delay: 0.10s; }',
    '.sr-delay-2 { transition-delay: 0.20s; }',
    '.sr-delay-3 { transition-delay: 0.30s; }',
    '.sr-delay-4 { transition-delay: 0.40s; }',
    '.sr-delay-5 { transition-delay: 0.50s; }',
    '.sr-delay-6 { transition-delay: 0.60s; }'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Sélecteurs à animer ── */
  var selectors = [
    { sel: '.section-header',  dir: 'up'    },
    { sel: '.intro-quote',     dir: 'left'  },
    { sel: '.intro-text',      dir: 'right' },
    { sel: '.service-card',    dir: 'up',   stagger: true },
    { sel: '.contact-info',    dir: 'up',   stagger: true },
    { sel: '.reg-item',        dir: 'up',   stagger: true },
    { sel: '.dirigeant-block', dir: 'up'    },
    { sel: '.bareme-block',    dir: 'up'    },
    { sel: '.page-hero',       dir: 'up'    }
  ];

  /* ── Préparation des éléments ── */
  selectors.forEach(function (def) {
    var els = document.querySelectorAll(def.sel);
    els.forEach(function (el, idx) {
      el.classList.add('sr-hidden', 'sr-' + def.dir);
      if (def.stagger) {
        var delayClass = 'sr-delay-' + Math.min(idx + 1, 6);
        el.classList.add(delayClass);
      }
    });
  });

  /* ── Observer ── */
  if (!('IntersectionObserver' in window)) {
    /* Fallback navigateurs anciens : tout afficher immédiatement */
    document.querySelectorAll('.sr-hidden').forEach(function (el) {
      el.classList.add('sr-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target); /* Jouer l'animation une seule fois */
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -3% 0px'
  });

  document.querySelectorAll('.sr-hidden').forEach(function (el) {
    observer.observe(el);
  });
}());


/* ── 7. BOUTON RETOUR EN HAUT ────────────────────────────────
   Bouton circulaire ↑ qui apparaît après 400 px de défilement
   et remonte la page en douceur au clic.
   ─────────────────────────────────────────────────────────── */
(function initBackToTop() {
  var style = document.createElement('style');
  style.textContent = [
    '#back-to-top {',
    '  position: fixed;',
    '  bottom: 2rem;',
    '  right: 1.5rem;',
    '  width: 3rem;',
    '  height: 3rem;',
    '  border-radius: 50%;',
    '  background-color: rgb(96,46,25);',
    '  color: rgb(244,239,225);',
    '  border: none;',
    '  cursor: pointer;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  font-size: 1.2rem;',
    '  z-index: 1500;',
    '  opacity: 0;',
    '  transform: translateY(1rem);',
    '  transition: opacity 0.35s ease, transform 0.35s ease, background-color 0.25s ease;',
    '  pointer-events: none;',
    '  box-shadow: 0 4px 16px rgba(96,46,25,0.4);',
    '}',
    '#back-to-top.visible {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '  pointer-events: auto;',
    '}',
    '#back-to-top:hover {',
    '  background-color: rgb(140,80,45);',
    '  transform: translateY(-3px);',
    '  box-shadow: 0 8px 24px rgba(96,46,25,0.5);',
    '}',
    '#back-to-top:focus-visible {',
    '  outline: 2px solid rgb(210,180,155);',
    '  outline-offset: 3px;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Retour en haut de page');
  btn.innerHTML = '&#8679;'; /* ↑ */
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());


/* ── 8. MICRO-INTERACTIONS CARTES SERVICE ────────────────────
   Effet de lumière (spotlight) qui suit le pointeur à l'intérieur
   de chaque carte, renforçant la sensation de profondeur.
   Désactivé sur mobile / appareils sans pointeur précis.
   ─────────────────────────────────────────────────────────── */
(function initCardSpotlight() {
  /* Uniquement pour les appareils avec pointeur précis (souris) */
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var style = document.createElement('style');
  style.textContent = [
    '.service-card {',
    '  --spot-x: 50%;',
    '  --spot-y: 50%;',
    '}',
    '.service-card::after {',
    '  content: "";',
    '  position: absolute;',
    '  inset: 0;',
    '  border-radius: inherit;',
    '  background: radial-gradient(',
    '    circle at var(--spot-x) var(--spot-y),',
    '    rgba(96,46,25,0.07) 0%,',
    '    transparent 65%',
    '  );',
    '  opacity: 0;',
    '  transition: opacity 0.3s ease;',
    '  pointer-events: none;',
    '}',
    '.service-card:hover::after {',
    '  opacity: 1;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--spot-x', x);
      card.style.setProperty('--spot-y', y);
    });
  });
}());


/* ── 9. PARALLAXE LÉGÈRE SUR LE HERO ─────────────────────────
   Le logo du hero se décale légèrement à la descente pour
   donner une sensation de profondeur subtile.
   Désactivé si l'utilisateur préfère les mouvements réduits.
   ─────────────────────────────────────────────────────────── */
(function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var heroLogo = document.querySelector('.hero-logo');
  var heroSub  = document.querySelector('.hero-sub');
  if (!heroLogo) return;

  var ticking = false;

  function applyParallax() {
    var scrollY = window.scrollY;
    heroLogo.style.transform = 'translateY(' + (scrollY * 0.18).toFixed(2) + 'px)';
    if (heroSub) {
      heroSub.style.transform = 'translateY(' + (scrollY * 0.08).toFixed(2) + 'px)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
}());


/* ── 10. LIEN ACTIF AU SCROLL (ancres internes) ──────────────
   Sur les pages avec sections ancrées, met à jour le lien
   actif dans la nav en fonction de la section visible.
   ─────────────────────────────────────────────────────────── */
(function initAnchorHighlight() {
  var anchors = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.site-nav a[href*="#"]');
  if (!anchors.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href.endsWith('#' + id) || href === '#' + id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }, { threshold: 0.45 });

  anchors.forEach(function (section) { observer.observe(section); });
}());