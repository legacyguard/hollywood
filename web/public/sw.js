/**
 * Service Worker for LegacyGuard PWA
 * Phase 7: Mobile & PWA Capabilities
 *
 * Handles caching, offline functionality, push notifications,
 * and background sync for the Progressive Web App.
 */

const CACHE_NAME = 'legacyguard-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/vault',
  '/analytics',
  '/family-protection',
  '/offline.html',
  '/manifest.json',
  '/shield-icon.svg',
  '/favicon-16x16.svg',
];

// Resources to cache on first use
const RUNTIME_CACHE_URLS = [
  '/intelligent-organizer',
  '/settings',
  '/family',
  '/legacy',
  '/time-capsule',
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/documents/,
  /\/api\/analytics/,
  /\/api\/insights/,
  /\/api\/health/,
];

// Resources that should always be fetched fresh
const BYPASS_CACHE_PATTERNS = [
  /\/api\/auth/,
  /\/api\/upload/,
  /\/api\/notifications/,
  /\/api\/realtime/,
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip requests that should bypass cache
  if (BYPASS_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

/**
 * Handle navigation requests with cache-first strategy and offline fallback
 */
async function handleNavigationRequest(request) {
  try {
    // Try cache first for performance
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Fetch fresh version in background and update cache
      fetchAndUpdateCache(request);
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    // If network fails, return offline page
    return await caches.match(OFFLINE_URL);
  } catch (error) {
    console.error('Service Worker: Navigation request failed', error);
    return await caches.match(OFFLINE_URL);
  }
}

/**
 * Handle API requests with network-first strategy and intelligent caching
 */
async function handleApiRequest(request) {
  const shouldCache = API_CACHE_PATTERNS.some(pattern =>
    pattern.test(request.url)
  );

  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);

    if (networkResponse.ok && shouldCache) {
      // Cache successful API responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: API request failed', error);

    if (shouldCache) {
      // Return cached version if available
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Add header to indicate this is cached data
        const response = cachedResponse.clone();
        response.headers.set('X-Served-From-Cache', 'true');
        return response;
      }
    }

    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        message: 'Please check your internet connection and try again.',
        cached: false,
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle static resource requests with cache-first strategy
 */
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static request failed', error);

    // Return cached version if available
    const cachedResponse = await caches.match(request);
    return (
      cachedResponse ||
      new Response('Resource not available offline', { status: 404 })
    );
  }
}

/**
 * Fetch and update cache in background
 */
async function fetchAndUpdateCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.error('Service Worker: Background fetch failed', error);
  }
}

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');

  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/shield-icon.svg',
    badge: '/shield-icon.svg',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/shield-icon.svg',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    tag: data.tag || 'legacyguard-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'LegacyGuard', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            client.focus();
            if (urlToOpen !== '/dashboard') {
              client.navigate(urlToOpen);
            }
            return;
          }
        }

        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'document-upload') {
    event.waitUntil(handleDocumentUploadSync());
  }

  if (event.tag === 'analytics-sync') {
    event.waitUntil(handleAnalyticsSync());
  }
});

/**
 * Handle document upload sync when back online
 */
async function handleDocumentUploadSync() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads();

    for (const upload of pendingUploads) {
      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: upload.formData,
        });

        if (response.ok) {
          // Remove from pending uploads
          await removePendingUpload(upload.id);

          // Notify user of successful upload
          await self.registration.showNotification('Upload Complete', {
            body: `Document "${upload.filename}" has been uploaded successfully`,
            icon: '/shield-icon.svg',
            tag: 'upload-success',
          });
        }
      } catch (error) {
        console.error(
          'Service Worker: Upload sync failed for',
          upload.filename,
          error
        );
      }
    }
  } catch (error) {
    console.error('Service Worker: Document upload sync failed', error);
  }
}

/**
 * Handle analytics data sync when back online
 */
async function handleAnalyticsSync() {
  try {
    // Sync cached analytics events
    const pendingEvents = await getPendingAnalyticsEvents();

    if (pendingEvents.length > 0) {
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: pendingEvents }),
      });

      if (response.ok) {
        await clearPendingAnalyticsEvents();
        console.log('Service Worker: Analytics sync completed');
      }
    }
  } catch (error) {
    console.error('Service Worker: Analytics sync failed', error);
  }
}

// Handle message events from the main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'CACHE_URLS':
      cacheUrls(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('Service Worker: All caches cleared');
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urls);
  console.log('Service Worker: URLs cached', urls);
}

// Utility functions for IndexedDB operations (simplified)
async function getPendingUploads() {
  // In a real implementation, this would use IndexedDB to store pending uploads
  return [];
}

async function removePendingUpload(id) {
  // Remove upload from IndexedDB
}

async function getPendingAnalyticsEvents() {
  // Get pending analytics events from IndexedDB
  return [];
}

async function clearPendingAnalyticsEvents() {
  // Clear analytics events from IndexedDB
}

console.log('Service Worker: Script loaded successfully');
