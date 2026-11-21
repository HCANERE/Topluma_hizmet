const CACHE = 'tod-training-v7';
const CORE = [
  './', 'index.html', 'style.css', 'practice.css', 'portal.css', 'favicon.svg', 'manifest.webmanifest',
  'data.js', 'app.js', 'lab-scenarios.js', 'practice.js', 'url-inspector.js',
  'decision-data.js', 'decision.js', 'assessment.js', 'message-analyzer.js', 'learning-path.js',
  'chatbot-data.js', 'chatbot.js', 'portal.js',
  'vendor/jsQR.js', 'vendor/public_suffix_list.dat',
  'media/poster-wide.svg', 'media/poster-portrait.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name.startsWith('tod-training-') && name !== CACHE).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || /\/media\/.*\.(?:mp4|vtt)$/.test(url.pathname) || request.headers.has('range')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./')));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
