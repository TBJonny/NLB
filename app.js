
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
