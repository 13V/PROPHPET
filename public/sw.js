// Basic Service Worker for PWA installability
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through fetch
    event.respondWith(fetch(event.request));
});
