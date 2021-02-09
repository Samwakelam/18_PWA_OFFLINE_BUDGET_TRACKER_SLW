const CACHE_NAME = 'budget-tracker-offline-cache-v1';
const CACHE_URL = [
  '/assets/index.js',
  '/assets/styles.css',
  '/assets/sw.js',

  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  '/index.html',
];

const IDB_DB_NAME = '';
const IDB_DB_VERSION = '';
const IDB_STORE_NAME = '';
const IDB_ST_OPTIONS = {};

// FUNCTIONS -----------------------------------------------------------------

function cacheStaticAssets(CACHE_NAME, CACHE_URL) {
  return caches
    .open(CACHE_NAME)
    .then((cache) => {
      console.log('cacheStaticAssets, cache =', cache);
      return cache.addAll(CACHE_URL);
    })
    .catch((err) => {
      console.log('service worker, cacheStaticAssets, err =', err);
    });
}

function deleteOldCaches(cacheKeepList) {
  return caches
    .keys()
    .then((keylist) => {
      console.log('service worker, deleteOldCaches, keyList =', keylist);
      return Promise.all(
        keylist.map((key) => {
          console.log('cacheKeepList.indexOf(key) === -1', cacheKeepList.indexOf(key) === -1);
          if (cacheKeepList.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
    .catch((err) => {
      console.log('service worker, deleteOldCaches, err =', err);
    });
}

// EVENT LISTENERS ------------------------------------------------------------
// TASK 1 - cache static assets
self.addEventListener('install', function (event) {
  // on install wait until the cacheDB is open and add all static files to cache
  event.waitUntil(cacheStaticAssets(CACHE_NAME, CACHE_URL));

  // tell the browser to activate this service worker immediately once it has finished installing
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // delete old caches
  const cacheKeepList = [CACHE_NAME];

  event.waitUntil(deleteOldCaches(cacheKeepList));

  // service worker starts serving content as soon as it is activated
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  console.log('fetch, event.request =', event.request);
  console.log('caches', caches);
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
    // caches.match(event.request).then(function (response) {
    //   // Check cache but fall back to network
    //   return response || fetch(event.request);
    // })
  );
});


// });

// serve those assets from the cache if the request fails
// self.addEventListener('fetch', function(event){
//   event.respondWith(
//     fetch(event.request)
//     .then(()=>{
//       caches.match(event.request)
//       .then((result) => {
//         console.log({result})
//         return result;
//       }).catch((err) => {
//         console.log("service worker err 2", err);
//       });
//     })
//   );
// });

// cache dynamic assets
// self.addEventListener('fetch', function(event){
//   event.respondWith(
//     fetch(event.request)
//     .then((result) => {
//       // open cacheDB
//       caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log({cache});
//         cache.put(event.request, res);
//       }).catch((err) => {
//         console.log("service worker err 3", err);
//       });
//     })
//     .catch(() => {
//       caches.match(even.request)
//       .then((res) => {
//         console.log({res})
//         return res;
//       })
//       .catch((err) => {
//         console.log("service worker err 4", err);
//       });
//     })
//   );
// });

// implementing indexedDB ------------------------------------------------------------------------------

// INITIATE IndexedDB
//  const request = self.indexedDB.open( IDB_DB_NAME, IDB_DB_VERSION );
//  let db;

//  request.onsuccess = function(event){
//    console.log('indexedDB request on success', request.result);
//    db = event.target.result;
//    // use fetch to get data from web api and save it in IndexedDb.

//    //  start acting on the index db with transactions etc

//  }

//  request.onerror = function(event){
//    console.log('indexedDB request on error', request.error);
//    console.log('indexedDB request on error event', event);
//  }

// request.onupgradeneeded = function(event) {

//   // create objects store from our db
//   const db = event.target.result;
//   const store = db.createObjectStore( IDB_STORE_NAME, IDB_ST_OPTIONS );
// }
