
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


// Register service worker for PWA (Android + iOS Safari support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}


// Lightweight reveal-on-scroll + parallax (perf friendly)
(() => {
  try {
    const root = document.documentElement;
    const onScroll = () => root.style.setProperty('--scrollY', String(window.scrollY||0));
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add('in');
      }, {threshold: 0.12, rootMargin: '0px 0px -10% 0px'});
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
  } catch {}
})();


// Auto-highlight floating dock based on section visibility + Services polish
(() => {
  try {
    const anchors = Array.from(document.querySelectorAll('.bottom-dock a'));
    const map = new Map(anchors.map(a => [a.getAttribute('href').replace('#',''), a]));
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver((entries) => {
        let best = null, max = 0;
        for (const e of entries) {
          const id = (e.target.getAttribute('data-anchor')||'').trim();
          if (!id) continue;
          const ratio = e.intersectionRatio || 0;
          if (ratio > max) { max = ratio; best = id; }
        }
        if (best && map.has(best)) {
          anchors.forEach(a => a.classList.remove('active'));
          map.get(best).classList.add('active');
        }
      }, {threshold: [0,0.25,0.5,0.75,1]});
      document.querySelectorAll('section[data-anchor]').forEach(el => io2.observe(el));
    }
    // Wrap Services list in a section-card (non-destructive)
    const services = document.querySelector('#Services');
    if (services && !services.querySelector('.section-card')) {
      const firstList = services.querySelector('ul,ol');
      if (firstList) {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-card';
        firstList.parentNode.insertBefore(wrapper, firstList);
        wrapper.appendChild(firstList);
      }
    }
  } catch {}
})();


// Web Share for quick sharing (falls back to link selection)
(() => {
  try {
    const btn = document.getElementById('share-site');
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator.share({
          title: 'Next Level Barbershop',
          text: 'Book a cut, see prices, and get directions.',
          url: location.origin + location.pathname
        }).catch(()=>{});
      } else {
        // fallback: copy link
        navigator.clipboard?.writeText(location.href);
        btn.textContent = 'Link Copied';
        setTimeout(() => btn.textContent = 'Share', 1600);
      }
    });
  } catch {}
})();


// Highlight today's hours and clean stray text
(() => {
  try {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = days[new Date().getDay()];
    document.querySelectorAll('.hours .row, .section-card .row').forEach(r => {
      const t = r.textContent.trim();
      for (const d of days) {
        if (t.startsWith(d)) { if (d === today) r.classList.add('today'); break; }
      }
    });
    // Remove any stray bullets from legacy hero lines if still present
    document.querySelectorAll('p').forEach(p => {
      const txt = p.textContent || "";
      if (/Appointments Preferred|Coors|Bob's Burgers/i.test(txt)) p.remove();
    });
  } catch {}
})();
