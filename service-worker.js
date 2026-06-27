const CACHE_NAME = 'elite-portal-v2026-master-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './dashboard.html',
  './exams.html',
  './grades.html',
  './projects.html',
  './trips.html',
  './courses.html',
  './support.html',
  './student.html',
  './admin.html',
  './security-verification.html',
  './offline.html',
  './style.css',
  './polish-overlay.css',
  './app.js',
  './verification.js',
  './offline-db.js',
  './notifications.js',
  './bridge/overlay-engine.js',
  './overlay/ui-v2/feature-announcement.js',
  './overlay/ui-v2/eid-greeting.js',
  './overlay/ui-v2/account-enhancements.js',
  './manifest.json',
  './logo.png',
  './icon.svg',
  './splash_ad.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            // Silently skip assets that fail to cache (e.g. CDN offline)
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchedResponse = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cacheCopy).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('./offline.html');
        });

      return cachedResponse || fetchedResponse;
    })
  );
});

self.addEventListener('push', event => {
  let data = {
    title: 'نظام نخبة تقنية المعلومات',
    body: 'مرحباً عزيزي الطالب، نعمل حالياً على تحسين التطبيق وتطويره.',
    icon: './logo.png',
    tag: 'system-maintenance'
  };

  if (event.data) {
    const text = event.data.text();
    try {
      const pushData = JSON.parse(text);
      data = { ...data, ...pushData };
    } catch (e) {
      data.body = text;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || './logo.png',
    badge: data.icon || './logo.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'generic-notification',
    requireInteraction: data.tag === 'system-maintenance',
    data: {
      url: data.url || './index.html',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
    const { title, body, url, icon } = event.data.payload;

    const options = {
      body: body,
      icon: icon || './logo.png',
      badge: icon || './logo.png',
      vibrate: [100, 50, 100],
      data: {
        url: url || './index.html'
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});
