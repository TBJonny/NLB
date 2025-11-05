
const $ = sel => document.querySelector(sel);
const menu = document.querySelector('.menu');
const burger = document.querySelector('.burger');
const closeMenu = () => menu.classList.remove('open');
burger && burger.addEventListener('click', ()=> menu.classList.toggle('open'));
menu && menu.addEventListener('click', (e)=>{ if(e.target.classList.contains('menu')) closeMenu(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click', closeMenu));
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',(e)=>{
    const id = link.getAttribute('href');
    if(id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});
(function(){
  const el = document.getElementById('tickerText'); if(!el) return;
  const dup = el.innerHTML + ' • ' + el.innerHTML + ' • ' + el.innerHTML;
  el.innerHTML = dup; let x = 0;
  setInterval(()=>{ x -= 1; el.style.transform = `translateX(${x}px)`; if(Math.abs(x) > el.scrollWidth/2) x = 0; }, 16);
})();
window.addEventListener('load', ()=>{ document.getElementById('loader')?.classList.add('hide'); });

// Inject star rows into existing review cards (no new reviews)
(() => {
  try {
    document.querySelectorAll('#Reviews .card').forEach(card => {
      if (!card.querySelector('.stars')) {
        const stars = document.createElement('span');
        stars.className = 'stars';
        stars.setAttribute('aria-label','5 out of 5 stars');
        for (let i=0;i<5;i++){ const s = document.createElement('span'); s.className='star'; stars.appendChild(s); }
        const strong = card.querySelector('strong');
        if (strong && strong.nextSibling) {
          strong.parentNode.insertBefore(stars, strong.nextSibling);
        } else {
          card.prepend(stars);
        }
      }
    });
  } catch {}
})();

// Scroll spy highlight for top nav
(() => {
  const links = Array.from(document.querySelectorAll('.nav .links a[href^="#"]'));
  if (!links.length) return;
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        links.forEach(l => l.classList.toggle('active', l === map.get(id)));
      }
    });
  }, {rootMargin:'-35% 0% -60% 0%', threshold:0.01});
  map.forEach((a,id) => {
    const sec = document.getElementById(id);
    if (sec) obs.observe(sec);
  });
})();
