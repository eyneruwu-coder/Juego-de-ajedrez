const NOMBRE_CACHE = 'ajedrez-v1.2';
const ARCHIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './Torre.png',
  './Caballo.png',
  './Peon.png',
  './Reina.png',
  './Rey.png',
  './Alfil.png'
];

self.addEventListener('install', e => {
  console.log('📦 Guardando archivos...');
  e.waitUntil(
    caches.open(NOMBRE_CACHE)
      .then(cache => cache.addAll(ARCHIVOS_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(c => c !== NOMBRE_CACHE).map(c => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(respuesta => respuesta || fetch(e.request))
  );
});
