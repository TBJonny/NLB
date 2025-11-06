// Sticky shadow on scroll
const topbar = document.getElementById('topbar');
const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 6);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Drawer controls
const drawer = document.getElementById('drawer');
const menuBtn = document.getElementById('menuBtn');

function openDrawer(open) {
  drawer.classList.toggle('open', open);
  menuBtn.classList.toggle('active', open);
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.documentElement.style.overflowY = open ? 'hidden' : '';
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
menuBtn?.addEventListener('click', () => openDrawer(!drawer.classList.contains('open')));
drawer?.addEventListener('click', (e) => { if (e.target === drawer) openDrawer(false); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') openDrawer(false); });

// Smooth scroll with sticky offset
function stickyScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const barH = topbar.getBoundingClientRect().height || 64;
  const y = target.getBoundingClientRect().top + window.scrollY - (barH + 8);
  window.scrollTo({ top: y, behavior: 'smooth' });
}

const allNavLinks = document.querySelectorAll('[data-nav]');
allNavLinks.forEach((a) => {
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const id = a.getAttribute('href').slice(1);
    openDrawer(false);
    stickyScrollTo(id);
    history.replaceState(null, '', '#' + id);
  });
});

// Scroll spy to keep pills active
const linkMap = new Map();
allNavLinks.forEach(a => {
  const key = a.getAttribute('href').slice(1);
  linkMap.set(key, (linkMap.get(key) || []).concat(a));
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      linkMap.forEach((arr, key) => arr.forEach(el => el.classList.toggle('active', key === id)));
    }
  });
}, { rootMargin: "-35% 0% -60% 0%", threshold: 0.01 });
['Home', 'Barbers', 'Services', 'Reviews', 'Map'].forEach(id => {
  const sec = document.getElementById(id);
  if (sec) io.observe(sec);
});

// Highlight today's hours
(() => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours .row').forEach(r => {
    const label = r.firstElementChild?.textContent?.trim();
    if (label === today) r.classList.add('today');
  });
})();

// Safety net: if any review missing stars, add 5
(() => {
  document.querySelectorAll('#Reviews .review').forEach(el => {
    if (el.querySelector('.stars')) return;
    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.setAttribute('aria-label','5 out of 5');
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      stars.appendChild(s);
    }
    el.querySelector('.review-meta')?.appendChild(stars);
  });
})();

// PWA SW (kept, does nothing if sw.js absent)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  );
}