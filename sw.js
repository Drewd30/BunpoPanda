const CACHE='bunpopanda-v33-offline-opt-in';
const PRECACHE=['./','./index.html','./data/grammar.json','./manifest.webmanifest','./assets/logo.png','./qr-encoder.js','./qr-transfer.js'];
self.addEventListener('install', event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/data/grammar.json')){
    event.respondWith((async()=>{
      const canonical=new Request(new URL('./data/grammar.json',self.registration.scope).href);
      try{
        const response=await fetch(new Request(req,{cache:'no-store'}));
        if(!response.ok)throw Error('JSON HTTP '+response.status);
        const cache=await caches.open(CACHE);await cache.put(canonical,response.clone());
        return response;
      }catch(error){return await caches.match(canonical)||Response.error()}
    })());
    return;
  }
  event.respondWith(fetch(req).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)))}
    return response;
  }).catch(()=>caches.match(req)));
});
