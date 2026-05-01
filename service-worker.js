const CACHE_NAME = 'elite-portal-v2026-master';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './exams.html',
  './projects.html',
  './trips.html',
  './student.html',
  './style.css',
  './app.js',
  './manifest.json',
  './logo.png',
  './icon.svg',
  './splash_ad.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 1. Install - Pre-cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
});

// 2. Activate - Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all open clients immediately
});

// 3. Fetch - Stale-While-Revalidate Strategy (Speed + Updates)
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchedResponse = fetch(event.request)
        .then(networkResponse => {
          // Update cache with new version if network request is successful
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache, we could return an offline page here
          return null;
        });

      // Return cached response immediately, or wait for network if not in cache
      return cachedResponse || fetchedResponse;
    })
  );
});

// 4. Push - Handle incoming push messages
self.addEventListener('push', event => {
  let data = {
    title: '🔧 تحديثات وتحسينات النظام',
    body: 'مرحباً عزيزي الطالب، نعمل حالياً على تحسين التطبيق وتطويره ليكون أفضل وأسرع وأكثر استقراراً. شكراً لثقتك بنا.',
    icon: './logo.png',
    tag: 'system-maintenance'
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch (e) {
      data.body = event.data.text();
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
      url: data.url || './dashboard.html',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Notification Click - Handle click actions
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 6. Message Handling - Communication between UI and SW
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

    self.registration.showNotification(title, options);
  }
});
