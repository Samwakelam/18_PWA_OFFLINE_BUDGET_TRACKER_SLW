const CACHE_NAME = 'budget-tracker-offline-cache-v1';
const DATA_CACHE = 'budget-tracker-offline-data-cache-v1'
const URL_TO_CACHE = [
  '/assets/index.js',
  '/assets/styles.css',
  '/assets/sw.js',

  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  '/manifest.json',

  // This needs to be included not '/index.htm', or it works explicitly for /index.html search.
  '/',
  '/index.html',
  // to cache the last data fetch you made
  '/api/transaction',

 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0',
 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0 ',

];


// EVENT LISTENERS ------------------------------------------------------------
// TASK 1 - cache static assets
self.addEventListener('install', function (event) {
  // on install wait until the cacheDB is open and add all static files to cache
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then((cache) => {
      // console.log('cacheStaticAssets, cache =', cache);
      return cache.addAll(URL_TO_CACHE);
    })
    .catch((err) => {
      console.log('service worker, cacheStaticAssets, err =', err);
    })
  );

  // tell the browser to activate this service worker immediately once it has finished installing
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // delete old caches
  const cacheKeepList = [CACHE_NAME];
  event.waitUntil(
    caches
    .keys()
    .then((cacheNames) => {
      // console.log('service worker, deleteOldCaches, keyList =', keylist);
      return Promise.all(
        cacheNames.map((cacheName) => {
         
          if (cacheKeepList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .catch((err) => {
      console.log('service worker, deleteOldCaches, err =', err);
    })
  );

  // service worker starts serving content as soon as it is activated
  self.clients.claim();
});

// serve those assets from the cache if the request fails
self.addEventListener('fetch', function (event) {
    
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches
        .open(DATA_CACHE)
        .then((cache) => {
          return fetch(event.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
        })
        .catch((err) => console.log(err))
    );
    return;
  }

  event.respondWith( 
    caches
    .match(event.request)
    .then((response) => {
      // console.log('serve Static Assets cache function, response =', response);
      // console.log('serve Static Assets cache function, event.request =', event.request);
      if(response){
        // fall back to network
        return response || fetch(event.request);
      }
    })
    .catch((err) => {
      console.log('serve Static Assets cache function, err', err);
      // if both fail, show generic fallback
      return caches.match('/index.html');
    })
  );

    
});



