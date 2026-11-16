/* Ship It Studio: motion for the inner pages */
window.__motion=1;
(function(){
  var root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
  var h1=document.querySelector('h1');
  if(h1&&!document.querySelector('.c-hero')){var t=h1.textContent.trim();h1.setAttribute('aria-label',t);h1.innerHTML=t.split(/\s+/).map(function(w,i){return '<span class="w" aria-hidden="true" style="--i:'+i+'"><span>'+w+'</span></span>'}).join(' ')}
  var sel=window.MOTION_REVEAL||'.sec-head,.sec h2,.work-group>h2,.grp-note,.pcard,.svc,.step,.price,.buy,.cta-band,.founder,.faq-item,.contact-grid>*,.contact-hero .f-photo,.count-strip,.stats';
  document.querySelectorAll(sel).forEach(function(el){el.setAttribute('data-r','')});
  document.querySelectorAll('[data-stagger]').forEach(function(g){[].forEach.call(g.children,function(c,i){c.setAttribute('data-r','');c.style.setProperty('--d',i)})});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('[data-r]').forEach(function(el){io.observe(el)});
  requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('loaded')})});
  var g=document.createElement('div');g.className='grainy';g.setAttribute('aria-hidden','true');document.body.appendChild(g);
  var nav=document.querySelector('.nav');
  addEventListener('scroll',function(){if(nav)nav.classList.toggle('scrolled',scrollY>20)},{passive:true});
  if(reduce)return;
  var bands=[].slice.call(document.querySelectorAll('[data-scrub]')),tick=false;
  function frame(){tick=false;bands.forEach(function(b){var r=b.getBoundingClientRect();b.style.setProperty('--p',Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height))).toFixed(4))})}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
  if(!fine)return;
  if(window.Lenis){try{var l=new Lenis({lerp:.09,anchors:true});(function raf(t){l.raf(t);requestAnimationFrame(raf)})(0)}catch(e){}}
  var cur=document.createElement('div');cur.className='cur';cur.setAttribute('aria-hidden','true');document.body.appendChild(cur);root.classList.add('has-cur');
  var cx=0,cy=0,tx=0,ty=0;addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY},{passive:true});
  (function loop(){cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,summary,input').forEach(function(el){el.addEventListener('pointerenter',function(){cur.classList.add('link')});el.addEventListener('pointerleave',function(){cur.classList.remove('link')})});
  document.querySelectorAll('.btn').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});
  document.querySelectorAll('[data-spot]').forEach(function(g){[].forEach.call(g.children,function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')})})});
})();

(function(){document.querySelectorAll('.work-grid,.svc-grid,.steps,.price-grid').forEach(function(g){[].forEach.call(g.children,function(c,i){c.style.setProperty('--d',i%3)})})})();
