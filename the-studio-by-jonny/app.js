(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const topbar = document.getElementById('topbar');
  const menu = document.getElementById('mobileMenu');
  const menuButton = document.getElementById('menuBtn');
  const pageStarted = performance.now();

  let introComplete = false;
  const revealPage = () => {
    if (introComplete) return;
    introComplete = true;
    body.classList.add('page-ready');
  };

  const finishIntro = () => {
    const elapsed = performance.now() - pageStarted;
    const delay = reduceMotion ? 0 : Math.max(0, 520 - elapsed);
    window.setTimeout(revealPage, delay);
  };

  // Never make the visitor wait for every photo or a cached script lifecycle.
  finishIntro();
  window.setTimeout(revealPage, 1200);
  if (document.readyState !== 'complete') window.addEventListener('load', finishIntro, { once: true });

  const updateHeader = () => topbar?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const setMenu = (open) => {
    if (!menu || !menuButton) return;
    menu.classList.toggle('open', open);
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      const offset = topbar?.offsetHeight || 74;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  const revealTargets = document.querySelectorAll([
    '.section-heading',
    '.section-heading-stacked',
    '.service-row',
    '.gallery-item',
    '.instagram-row',
    '.portrait-wrap',
    '.about-copy',
    '.booking-card',
    '.policy-cards article',
    '.faq-grid > div',
    '.accordion details',
    '.location-card'
  ].join(','));

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const gallery = document.querySelector('.gallery');
  const galleryCards = [...document.querySelectorAll('.gallery-item')];
  const mobileGallery = window.matchMedia('(max-width: 680px)');

  if (gallery && galleryCards.length && mobileGallery.matches && 'IntersectionObserver' in window) {
    galleryCards[0].classList.add('is-active');
    const cardObserver = new IntersectionObserver((entries) => {
      const centered = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!centered || centered.intersectionRatio < 0.52) return;
      galleryCards.forEach((card) => card.classList.toggle('is-active', card === centered.target));
    }, { root: gallery, threshold: [0.35, 0.52, 0.7, 0.9] });
    galleryCards.forEach((card) => cardObserver.observe(card));
  }

  const heroVisual = document.querySelector('[data-parallax]');
  const heroImage = heroVisual?.querySelector(':scope > img');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 821px)').matches;

  if (heroVisual && heroImage && finePointer && !reduceMotion) {
    heroVisual.addEventListener('pointermove', (event) => {
      const bounds = heroVisual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;
      heroImage.style.setProperty('--shift-x', `${x}px`);
      heroImage.style.setProperty('--shift-y', `${y}px`);
    });

    heroVisual.addEventListener('pointerleave', () => {
      heroImage.style.setProperty('--shift-x', '0px');
      heroImage.style.setProperty('--shift-y', '0px');
    });
  }

  document.querySelectorAll('.accordion details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open || window.innerWidth > 680) return;
      document.querySelectorAll('.accordion details[open]').forEach((openItem) => {
        if (openItem !== details) openItem.removeAttribute('open');
      });
    });
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js?v=2', { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch(() => {});
    });
  }
})();
