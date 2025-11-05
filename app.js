
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
