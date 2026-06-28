// public/sw.js
//
// Único trabajo: forzar que el navegador/iOS pida siempre la versión real
// por red para los archivos de ESTE sitio (HTML, JS, CSS, imágenes),
// en vez de quedarse con una copia vieja guardada.
//
// A propósito NO toca nada que no sea de este mismo dominio — eso deja
// afuera, sin tocar, las llamadas a productos.json, stock.json, JSONBin,
// y la API de códigos QR. Esos siguen siempre yendo directo a internet.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return // no tocar nada externo

  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(
      () => caches.match(event.request), // si no hay red, intenta lo último que haya (puede no haber nada)
    ),
  )
})
