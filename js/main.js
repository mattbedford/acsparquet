/* =====================================================================
   AC Service Parquet — interactions
   Vanilla JS, no dependencies.
   ===================================================================== */
(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero reveal on load ---------- */
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));

  /* ---------- Header background on scroll ---------- */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
      mobileNav.hidden = !open;
      mobileNav.style.display = open ? 'flex' : 'none';
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------- Scroll-spy + sliding nav indicator ---------- */
  const links = Array.from(document.querySelectorAll('.nav__link'));
  const indicator = document.querySelector('.nav__indicator');
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const moveIndicator = (link) => {
    if (!indicator || !link) return;
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    indicator.classList.add('is-visible');
  };

  const setActive = (id) => {
    let active = null;
    links.forEach((l) => {
      const on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('is-active', on);
      if (on) active = l;
    });
    if (active) moveIndicator(active);
    else if (indicator) indicator.classList.remove('is-visible');
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry most in view near the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // Hover preview: glide the indicator to the hovered link, snap back on leave.
  links.forEach((l) => {
    l.addEventListener('mouseenter', () => moveIndicator(l));
  });
  const navList = document.querySelector('.nav__list');
  if (navList) {
    navList.addEventListener('mouseleave', () => {
      const current = links.find((l) => l.classList.contains('is-active'));
      if (current) moveIndicator(current);
    });
  }
  // Reposition indicator on resize.
  let rT;
  window.addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      const current = links.find((l) => l.classList.contains('is-active'));
      if (current) moveIndicator(current);
    }, 150);
  });

  /* ---------- FAQ: smooth height + single-open (accordion) ---------- */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    const summary = item.querySelector('summary');
    summary.addEventListener('click', () => {
      if (!item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('.lightbox__img');
  const lbCount = lightbox && lightbox.querySelector('.lightbox__count');
  const items = Array.from(document.querySelectorAll('.masonry__item'));
  let current = 0;
  let lastFocused = null;

  const show = (i) => {
    current = (i + items.length) % items.length;
    const btn = items[current];
    const src = btn.getAttribute('data-full');
    const img = btn.querySelector('img');
    lbImg.src = src;
    lbImg.alt = img ? img.alt : '';
    if (lbCount) lbCount.textContent = (current + 1) + ' / ' + items.length;
  };

  const open = (i) => {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    const closeBtn = lightbox.querySelector('.lightbox__close');
    if (closeBtn) closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    const done = () => {
      lightbox.hidden = true;
      lbImg.src = '';
      lightbox.removeEventListener('transitionend', done);
      if (lastFocused) lastFocused.focus();
    };
    if (prefersReduced) done();
    else lightbox.addEventListener('transitionend', done);
  };

  if (lightbox) {
    items.forEach((btn, i) => btn.addEventListener('click', () => open(i)));

    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
    });
  }
})();
