// ===== Mobile drawer (fix: close reliably on X, link tap, backdrop or ESC) =====
const body = document.body;
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const openBtn = document.getElementById('navToggle');
const closeBtn = document.getElementById('navClose');
const links = Array.from(document.querySelectorAll('.drawer-links .dl'));

function openMenu() {
  body.classList.add('menu-open');
  backdrop.hidden = false;
  drawer.setAttribute('aria-hidden','false');
  openBtn.setAttribute('aria-expanded','true');
  body.classList.add('no-scroll');
}

function closeMenu() {
  body.classList.remove('menu-open','no-scroll');
  drawer.setAttribute('aria-hidden','true');
  openBtn.setAttribute('aria-expanded','false');
  // Wait for transition then hide backdrop for a11y
  setTimeout(()=>backdrop.hidden = true, 250);
}

// open / close events
openBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
backdrop?.addEventListener('click', closeMenu);
links.forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('keyup', (e)=>{ if(e.key==='Escape') closeMenu(); });
window.addEventListener('resize', ()=>{ if (window.innerWidth >= 1020) closeMenu(); });

// ===== Smooth scroll for internal anchors =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// ===== Hours (Mon → Sun, bold + highlight today) =====
const hours = [
  { d:'Monday',    h:'9:00 AM – 3:30 PM'  },
  { d:'Tuesday',   h:'9:00 AM – 5:30 PM'  },
  { d:'Wednesday', h:'9:00 AM – 5:30 PM'  },
  { d:'Thursday',  h:'9:00 AM – 5:30 PM'  },
  { d:'Friday',    h:'9:00 AM – 5:30 PM'  },
  { d:'Saturday',  h:'9:00 AM – 5:30 PM'  },
  { d:'Sunday',    h:'9:00 AM – 3:30 PM'  },
];

const list = document.getElementById('hours');
if(list){
  const weekdayIdx = new Date().getDay(); // Sun=0..Sat=6
  const mapIdx = [6,0,1,2,3,4,5]; // convert to Mon=0..Sun=6
  const today = mapIdx[weekdayIdx];

  list.innerHTML = '';
  hours.forEach((row, i)=>{
    const li = document.createElement('li');
    if(i === today) li.classList.add('today');
    li.innerHTML = `<b>${row.d}</b><span>${row.h}</span>`;
    list.appendChild(li);
  });
}

// ===== Prevent rogue sideways scroll on transforms (belt & suspenders) =====
document.documentElement.style.overflowX = 'hidden';
