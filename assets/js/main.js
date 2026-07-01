/* ============================================================
   SHIP IT STUDIO — shared scripts
   ============================================================ */

/* ---- project data (shared across pages) ---- */
const PROJECTS = [
  { name:"Car Events Near Me", tag:"Platform", g:"linear-gradient(135deg,#123a6b,#0a1a33)",
    desc:"Search-and-book platform for every UK car event — filter by region, date and price, then book direct. Next.js + Stripe.",
    url:"https://careventsnearme.uk", repo:"https://github.com/triggsoliver-ship-it/Car-Events-Near-Me-" },
  { name:"GenoVaq", tag:"Marketplace", g:"linear-gradient(135deg,#3a1f6b,#1a0d33)",
    desc:"Global marketplace for animal breeding genetics. Verified sellers, KYC and Stripe Connect with automatic 10% commission.",
    url:"", private:true, repo:"" },
  { name:"Prime Origins Atlas", tag:"Marketplace", g:"linear-gradient(135deg,#0e4d39,#06231a)",
    desc:"Verified carbon-credit marketplace. Browse by registry & vintage, buy with Stripe Checkout, 4% platform fee.",
    url:"https://primeoriginsatlas.org", repo:"https://github.com/triggsoliver-ship-it/prime-origins-atlas" },
  { name:"Prime Origins Global", tag:"Brand site", g:"linear-gradient(135deg,#14463a,#08231c)",
    desc:"Corporate brand site for Prime Origins — the story, mission and offering behind the carbon platform.",
    url:"https://primeoriginsglobal.org", repo:"https://github.com/triggsoliver-ship-it/prime-origins-global" },
  { name:"Bromspec Motorworks", tag:"Business site", g:"linear-gradient(135deg,#5a1d1d,#2a0c0c)",
    desc:"Dark, premium multi-page site for a performance garage. Auto-loading gallery, brands strip, enquiry form.",
    url:"https://bromspec.co.uk", repo:"https://github.com/triggsoliver-ship-it/Bromspec" },
  { name:"AJS Vehicle Services", tag:"Business site", g:"linear-gradient(135deg,#0e4458,#06222c)",
    desc:"Fast one-page site for an independent garage in Andover. WhatsApp lead capture, gallery lightbox, click-to-call.",
    url:"https://ajsvehicleservices.co.uk", repo:"https://github.com/triggsoliver-ship-it/AJS" },
  { name:"Man With A Whistle", tag:"Business site", g:"linear-gradient(135deg,#4a3a14,#231b08)",
    desc:"Clean marketing site for a bespoke dog trainer — services, training videos and a clear booking call-to-action.",
    url:"https://manwithawhistle.co.uk", repo:"https://github.com/triggsoliver-ship-it/manwithawhistle" },
  { name:"Veles Capital", tag:"Finance", g:"linear-gradient(135deg,#243140,#0e151c)",
    desc:"Sharp, corporate brand site for Veles Capital — built to convey trust and credibility in financial services.",
    url:"https://velescapital.net", repo:"https://github.com/triggsoliver-ship-it/Veles-Capital-" },
];

/* ---- contact ---- */
const WHATSAPP = "447926186207";
const WA_MSG = "Hi Ship It Studio — I'd like a website.";
const WA_HREF = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_MSG)}`;

/* ---- render project cards into any #work-grid ---- */
function renderProjects(limit){
  const grid = document.getElementById('work-grid');
  if(!grid) return;
  const list = limit ? PROJECTS.slice(0,limit) : PROJECTS;
  grid.innerHTML = list.map(p=>{
    let link;
    if(p.private) link = '<span class="soon">🔒 Private — demo on request</span>';
    else if(p.url) link = `<a class="visit" href="${p.url}" target="_blank" rel="noopener">Visit live site →</a>`;
    else link = '<span class="soon">Live link coming soon</span>';
    return `<article class="pcard reveal">
      <div class="thumb" style="background:${p.g}">
        <span class="tag">${p.tag}</span><h3>${p.name}</h3>
      </div>
      <div class="body"><p>${p.desc}</p><div class="links">${link}</div></div>
    </article>`;
  }).join('');
}

/* ---- July promo bar (site-wide) ---- */
function injectPromoBar(){
  if(document.querySelector('.promo-bar')) return;
  const css = `:root{--promo-h:40px}
  .promo-bar{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:center;text-align:center;min-height:var(--promo-h);
    background:linear-gradient(100deg,#ff7a1a,#ff3d3d 55%,#ff2d6f);color:#fff;font-family:Inter,system-ui,sans-serif;font-weight:600;font-size:13px;line-height:1.3;
    padding:8px 16px;text-decoration:none;letter-spacing:.2px}
  .promo-bar strong{font-weight:800}
  .promo-bar:hover{filter:brightness(1.05)}
  .nav{top:var(--promo-h)}
  body{padding-top:var(--promo-h)}
  @media(max-width:680px){:root{--promo-h:54px}.promo-bar{font-size:11.5px;padding:7px 12px}}`;
  const style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);
  const bar=document.createElement('a');
  bar.className='promo-bar'; bar.href='/contact.html';
  bar.innerHTML='<span><strong>July offer</strong> — as temperatures rise, our prices fall: <strong>30% off any new website or redesign</strong>. First 20 customers only →</span>';
  document.body.insertBefore(bar, document.body.firstChild);
}

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded',()=>{
  injectPromoBar();

  // wire whatsapp links
  document.querySelectorAll('[data-wa]').forEach(a=>a.href=WA_HREF);

  // year
  const yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  // sticky nav
  const nav=document.querySelector('.nav');
  const onScroll=()=>nav&&nav.classList.toggle('scrolled',window.scrollY>20);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  // mobile menu
  const burger=document.querySelector('.burger');
  const menu=document.querySelector('.mobile-menu');
  if(burger&&menu){
    const toggle=()=>{burger.classList.toggle('open');menu.classList.toggle('open');
      document.body.style.overflow=menu.classList.contains('open')?'hidden':'';};
    burger.addEventListener('click',toggle);
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      burger.classList.remove('open');menu.classList.remove('open');document.body.style.overflow='';}));
  }

  // render projects (data-limit attr controls count)
  const grid=document.getElementById('work-grid');
  if(grid){const lim=grid.dataset.limit?parseInt(grid.dataset.limit):0;renderProjects(lim||0);}

  // reveal on scroll
  const io=new IntersectionObserver((es)=>{es.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),(e.target.dataset.delay||0)*1);io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // count-up stats
  const counters=document.querySelectorAll('[data-count]');
  const cio=new IntersectionObserver((es)=>{es.forEach(e=>{
    if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target);}});},{threshold:.5});
  counters.forEach(c=>cio.observe(c));

  // service card glow follows cursor
  document.querySelectorAll('.svc').forEach(card=>{
    card.addEventListener('mousemove',ev=>{const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(ev.clientX-r.left)+'px');
      card.style.setProperty('--my',(ev.clientY-r.top)+'px');});
  });

  // tilt on project cards
  document.querySelectorAll('.pcard').forEach(card=>{
    card.addEventListener('mousemove',ev=>{const r=card.getBoundingClientRect();
      const rx=((ev.clientY-r.top)/r.height-.5)*-6, ry=((ev.clientX-r.left)/r.width-.5)*6;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{
    q.parentElement.classList.toggle('open');}));

  // contact form (Web3Forms)
  const form=document.getElementById('contact-form');
  if(form){const note=document.getElementById('formnote');
    form.addEventListener('submit',async e=>{e.preventDefault();
      const key=form.querySelector('[name=access_key]').value;
      if(key.includes('REPLACE_WITH')){note.style.color='#e0a800';note.textContent='Form not yet activated — add your Web3Forms key.';return;}
      note.style.color='var(--muted)';note.textContent='Sending…';
      try{const res=await fetch('https://api.web3forms.com/submit',{method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify(Object.fromEntries(new FormData(form)))});
        const data=await res.json();
        if(data.success){note.style.color='var(--accent)';note.textContent="Thanks — we'll be in touch within a day.";form.reset();}
        else{note.style.color='#ff6b6b';note.textContent='Something went wrong. Email info@shipitstudio.co.uk';}
      }catch(err){note.style.color='#ff6b6b';note.textContent='Network error — email info@shipitstudio.co.uk';}
    });}

  // PWA install
  setupInstall();
  registerSW();
});

function animateCount(el){
  const target=parseFloat(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  const dur=1400,start=performance.now();
  const step=now=>{const p=Math.min((now-start)/dur,1);
    const val=target*(1-Math.pow(1-p,3));
    el.textContent=(target%1?val.toFixed(0):Math.round(val))+suffix;
    if(p<1)requestAnimationFrame(step);};
  requestAnimationFrame(step);
}

/* ---- PWA: install button + service worker ---- */
let deferredPrompt=null;
function setupInstall(){
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

  // Inject an install entry into the mobile menu (the nav button is hidden on phones)
  const menu=document.querySelector('.mobile-menu');
  if(menu && !menu.querySelector('[data-install]')){
    const a=document.createElement('a');
    a.setAttribute('data-install','');
    a.href='#'; a.className='accent'; a.textContent='Add to home screen';
    menu.appendChild(a);
  }

  const btns=[...document.querySelectorAll('[data-install]')];

  // Always reveal the install affordance (unless already installed)
  if(!isStandalone) btns.forEach(b=>{b.style.display='';});

  // Capture Chrome/Android automatic prompt when offered
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});

  btns.forEach(b=>b.addEventListener('click',async(ev)=>{
    ev.preventDefault();
    // close mobile menu if it's open
    const mm=document.querySelector('.mobile-menu.open'), bg=document.querySelector('.burger.open');
    if(mm){mm.classList.remove('open');document.body.style.overflow='';}
    if(bg)bg.classList.remove('open');
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      return;
    }
    showInstallHelp(isIOS); // iOS Safari + desktop fallback
  }));

  window.addEventListener('appinstalled',()=>{
    btns.forEach(b=>{b.style.display='none';});
    document.querySelectorAll('[data-install-note]').forEach(n=>n.textContent='Installed — check your home screen! 🎉');
  });

  // One-time bottom banner on iOS Safari (where there's no install prompt at all)
  if(isIOS && !isStandalone) showIosBanner();
}

function showIosBanner(){
  try{ if(localStorage.getItem('sis-ios-hide')) return; }catch(e){}
  if(document.getElementById('sis-ios-banner')) return;
  const bar=document.createElement('div');
  bar.id='sis-ios-banner';
  bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:150;background:#0f1416;border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:13px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 14px 40px rgba(0,0,0,.55);font-family:Inter,system-ui,sans-serif';
  bar.innerHTML=`<img src="/assets/icon-192.png" width="40" height="40" alt="" style="border-radius:10px;flex:none"/>
    <div style="flex:1;color:#f2f7f5;font-size:13.5px;line-height:1.4">Add <b>Ship It Studio</b> to your home screen — tap <b>Share</b> then <b>“Add to Home Screen”</b>.</div>
    <button id="sis-ios-x" aria-label="Dismiss" style="flex:none;background:none;border:0;color:#8b9894;font-size:24px;line-height:1;cursor:pointer;padding:2px 6px">×</button>`;
  document.body.appendChild(bar);
  bar.querySelector('#sis-ios-x').addEventListener('click',()=>{bar.remove();try{localStorage.setItem('sis-ios-hide','1');}catch(e){}});
}

function showInstallHelp(isIOS){
  if(document.getElementById('sis-install-modal')) return;
  const steps = isIOS
    ? "Tap the <b>Share</b> icon (the square with an up-arrow) in your browser bar, scroll down and choose <b>“Add to Home Screen”</b>."
    : "Open your browser menu (the <b>⋮</b> or <b>⋯</b> button) and choose <b>“Install app”</b> or <b>“Add to Home screen”</b>. On desktop Chrome you can also click the install icon in the address bar.";
  const m=document.createElement('div');
  m.id='sis-install-modal';
  m.style.cssText='position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.62);backdrop-filter:blur(6px);padding:20px';
  m.innerHTML=`<div style="max-width:390px;background:#0f1416;border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:30px;text-align:center;font-family:Inter,system-ui,sans-serif">
    <img src="/assets/icon-192.png" width="74" height="74" alt="" style="border-radius:18px;margin:0 auto 16px;box-shadow:0 10px 30px rgba(0,0,0,.5)"/>
    <h3 style="font-family:'Space Grotesk',sans-serif;color:#f2f7f5;font-size:21px;margin:0 0 12px">Add to your home screen</h3>
    <p style="color:#8b9894;font-size:15px;line-height:1.55;margin:0 0 22px">${steps}</p>
    <button id="sis-install-close" style="background:#2BE38A;color:#03130b;border:0;font-weight:600;padding:13px 26px;border-radius:999px;cursor:pointer;font-size:15px">Got it</button>
  </div>`;
  document.body.appendChild(m);
  const close=()=>m.remove();
  m.addEventListener('click',e=>{if(e.target===m)close();});
  m.querySelector('#sis-install-close').addEventListener('click',close);
}
function registerSW(){
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }
}
