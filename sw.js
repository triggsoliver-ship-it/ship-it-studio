/* Ship It Studio — minimal service worker (enables installability + offline shell) */
/* cache rev: v3 */
const CACHE = 'sis-v3';
const ASSETS = [
  '/', '/index.html', '/work.html', '/services.html', '/pricing.html', '/contact.html',
  '/assets/css/style.css', '/assets/js/main.js',
  '/assets/icon-192.png', '/assets/icon-512.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  // Same-origin only. A checkout hand-off to buy.stripe.com must never be
  // cached, answered from cache, or replaced with /index.html when the network
  // is flaky - that would show our homepage at a Stripe URL mid-payment.
  if(new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html')))
  );
});
