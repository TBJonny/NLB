// Highlight today's hours
(() => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours .row').forEach(r => {
    const label = r.firstElementChild?.textContent?.trim();
    if (label === today) r.classList.add('today');
  });
})();

// Scroll-spy: set active tab as you scroll
(() => {
  const links = Array.from(document.querySelectorAll('.tabs a[href^="#"]'));
  if (!links.length) return;
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l === map.get(id)));
      }
    });
  }, { rootMargin: "-35% 0% -60% 0%", threshold: 0.01 });
  map.forEach((a, id) => {
    const sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
})();

// Reviews: add gold stars to your EXISTING reviews (no text changes)
(() => {
  const scope = document.querySelector('#Reviews');
  if (!scope) return;
  // Look for common review blocks: list items, paragraphs, or elements with .review
  const candidates = scope.querySelectorAll('li, p, .review');
  candidates.forEach(el => {
    if (el.querySelector('.stars')) return; // already has stars
    const txt = (el.textContent || '').trim();
    if (!txt) return;
    const stars = document.createElement('span');
    stars.className = 'stars small';
    stars.setAttribute('aria-label','5 out of 5');
    for (let i=0;i<5;i++){
      const s = document.createElement('span');
      s.className = 'star';
      stars.appendChild(s);
    }
    el.appendChild(stars);
  });
})();

// Safety: remove any stray loader/extra block above nav if it exists
(() => {
  const stray = document.getElementById('loader');
  if (stray) stray.remove();
})();