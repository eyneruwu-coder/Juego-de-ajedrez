const NOMBRE_CACHE = 'ajedrez-v1.0';
const ARCHIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación: guardar todo en caché
self.addEventListener('install', evento => {
  console.log('📦 Instalando app y guardando archivos...');
  evento.waitUntil(
    caches.open(NOMBRE_CACHE)
      .then(cache => cache.addAll(ARCHIVOS_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar versiones antiguas
self.addEventListener('activate', evento => {
  console.log('✅ App activa — funcionará sin conexión');
  evento.waitUntil(
    caches.keys().then(claves =>
      Promise.all(
        claves.filter(c => c !== NOMBRE_CACHE).map(c => caches.delete(c))
      )
    ).then(() => self.clients.claim())
  );
});

// ESTRATEGIA: Primero caché, si no hay pedir a red
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(respuesta => {
        // Devolver de caché si existe, sino pedir
        return respuesta || fetch(evento.request)
          .then(respuestaRed => {
            // Guardar nueva respuesta
            caches.open(NOMBRE_CACHE).then(cache => {
              cache.put(evento.request, respuestaRed.clone());
            });
            return respuestaRed;
          });
      })
  );
});
