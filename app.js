// Today highlight in hours
(() => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours .row').forEach(r => {
    const label = r.firstElementChild?.textContent?.trim();
    if (label === today) r.classList.add('today');
  });
})();

// Scroll-spy: highlight current nav link
(() => {
  const links = Array.from(document.querySelectorAll('.nav .links a[href^="#"]'));
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