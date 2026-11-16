// Network-first navigation keeps shared calendars current; storage progress is untouched.
const CACHE='st-anargyroi-calendar-v4';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.mode!=='navigate'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||Response.error())));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=new URL('./',self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{for(const client of clients){if(client.url.startsWith(self.registration.scope))return client.focus();}return self.clients.openWindow(url);}));
});
