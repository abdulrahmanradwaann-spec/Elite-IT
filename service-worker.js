const CACHE_NAME = 'elite-portal-v2026-full-v3.1';
const CACHE_PATTERN = /^\//;

const APP_ASSETS = [
  './',
  './index.html', './login.html', './dashboard.html', './exams.html',
  './grades.html', './projects.html', './trips.html', './courses.html',
  './support.html', './student.html', './admin.html', './admin-notifications.html',
  './security-verification.html', './setup.html', './tests.html', './offline.html',
  './style.css', './polish-overlay.css', './theme-2026.css',
  './overlay/themes/glassmorphism-3.css', './overlay/themes/ultra-aesthetics.css',
  './app.js', './verification.js', './offline-db.js', './notifications.js',
  './firebase-config.js', './i18n.js',
  './bridge/overlay-engine.js',
  './overlay/motion-ui/transitions.js', './overlay/widgets/widgets-core.js',
  './overlay/ui-v2/splash-enhancement.js', './overlay/ui-v2/feature-announcement.js',
  './overlay/ui-v2/eid-greeting.js', './overlay/ui-v2/account-enhancements.js',
  './manifest.json', './logo.png', './icon.svg', './splash_ad.jpg', './abdulrahman.jpg',
  './assets/eid-logo.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        APP_ASSETS.map(url => {
          return cache.add(url).catch(() => {});
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  // App assets (local) — cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            var copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy).catch(() => {}));
          }
          return networkResponse;
        }).catch(() => caches.match('./offline.html'));
      })
    );
    return;
  }

  // CDN assets — cache-first with fallback
  if (url.hostname.includes('cdnjs') || url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            var copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy).catch(() => {}));
          }
          return networkResponse;
        }).catch(function() {
          // Return a minimal inline fallback for CSS/JS
          if (url.pathname.includes('.css')) {
            return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
          }
          if (url.pathname.includes('.js')) {
            return new Response('', { status: 200, headers: { 'Content-Type': 'application/javascript' } });
          }
          return caches.match('./offline.html');
        });
      })
    );
    return;
  }

  // Everything else — network-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      var fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          var copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy).catch(() => {}));
        }
        return networkResponse;
      }).catch(() => cached || caches.match('./offline.html'));
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', event => {
  var data = { title: 'نظام نخبة تقنية المعلومات', body: '', icon: './logo.png', tag: 'push' };
  if (event.data) {
    try { data = { ...data, ...JSON.parse(event.data.text()) }; }
    catch (e) { data.body = event.data.text(); }
  }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: data.icon || './logo.png', badge: './logo.png',
    vibrate: [200, 100, 200], tag: data.tag, requireInteraction: data.tag === 'system-maintenance',
    data: { url: data.url || './index.html', timestamp: Date.now() }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  var url = event.notification.data.url || './index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.includes(url) && 'focus' in clientList[i]) return clientList[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
    var p = event.data.payload;
    event.waitUntil(self.registration.showNotification(p.title || '', {
      body: p.body || '', icon: p.icon || './logo.png', badge: './logo.png',
      vibrate: [100, 50, 100], data: { url: p.url || './index.html' }
    }));
  }
});
