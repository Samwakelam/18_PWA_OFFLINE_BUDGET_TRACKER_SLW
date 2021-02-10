const CACHE_NAME = 'budget-tracker-offline-cache-v1';
const CACHE_URL = [
  '/assets/index.js',
  '/assets/styles.css',
  '/assets/sw.js',

  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  // This needs to be included not '/index.htm', or it works explicitly for /index.html search.
  '/',
  // to cache the last data fetch you made
  '/api/transaction',
];

const IDB_DB_NAME = 'budgets';
const IDB_DB_VERSION = 1;
const IDB_STORE_NAME = 'transaction';
const IDB_ST_OPTIONS = {
  keyPath: 'id',
  autoIncrement: true,
};


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
          console.log(
            'cacheKeepList.indexOf(key) === -1',
            cacheKeepList.indexOf(key) === -1
          );
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

function serveStaticAssetsCache(event) {
  return caches
    .match(event.request)
    .then(function (response) {
      console.log('serve Static Assets cache function, response =', response);
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }
    })
    .catch((err) => {
      console.log('serve Static Assets cache function, err', err);
      addToDB(fetch(event.request));
    });
}

function cacheDynamicAssets(event){
  return fetch(event.request)
      .then((response) => {
        console.log('cacheDynamicAssets function, response =', response);
        caches
          .open(CACHE_NAME)
          .then((cache) => {
            console.log('cacheDynamicAssets function, cache =', cache);
            cache.put(event.request, response);
          })
          .catch((err) => {
            console.log('service worker err 3', err);
          });
      })
      .catch(() => {
        serveStaticAssetsCache(event)
      })
}

async function initiateIndexedDB() {
  // INITIATE IndexedDB
  const request = await self.indexedDB.open(IDB_DB_NAME, IDB_DB_VERSION);

  request.onsuccess = async function (event) {
    console.log('indexedDB request on success', request.result);
    const db = event.target.result;
    console.log('initiateIndexedDB, db =', db);
    // use fetch to get data from web api and save it in IndexedDb.
    await fetch('/api/transaction')
    .then(response => {
      console.log('service-worker.js, /api/transaction, response =', response);
      return response.json();
    })
    .then(async(data) => {
      // save db data on global variable
      console.log('service-worker, initiateIndexedDB, fetch data =', data);
      const transaction = await db.transaction(IDB_STORE_NAME, 'readwrite');

      transaction.onsuccess = function(event){
        console.log('transaction all done.')
      }

      // get store from transaction
      const store = await transaction.objectStore(IDB_STORE_NAME);
  
      // put transactions in store
      data.forEach((item) => {
        // console.log('item =', item);
        store.add(item);
      });
  
      transaction.onabort = function(event){
        console.log('transaction was aborted', event.abort);
      }
  
      transaction.onerror = function(event){
        console.log('transaction errored', event.error);
      }
    })
    .catch((err) => {
      console.log('service-worker, initiateIndexedDB, fetch err =', err);
    });
    //  start acting on the index db with transactions etc
  };

  request.onerror = function (event) {
    console.log('indexedDB request on error', request.error);
    console.log('indexedDB request on error event', event.error);
  };

  request.onupgradeneeded = function (event) {
    console.log('createOrUpdate, onupgradeneeded, event =', event);
    // create objects store from our db
    const db = event.target.result;
    db.createObjectStore(IDB_STORE_NAME, IDB_ST_OPTIONS);
  };
}

function addToDB(action) {
  const db = indexedDB.open('actions', 1);
  db.onsuccess = function(event) {
    db = event.target.result;
    objStore = db.transaction('requests', 'readwrite').objectStore('requests');
    objStore.add(action); 
  }

  db.onerror = function(event){
    console.log('addToDB function, onerror event =', event.error);
  }
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
  initiateIndexedDB();
  // service worker starts serving content as soon as it is activated
  self.clients.claim();
});

// serve those assets from the cache if the request fails
self.addEventListener('fetch', function (event) {
  // console.log('fetch, event.request =', event.request);
  // event.respondWith(serveStaticAssetsCache(event));
  // cache dynamic assets
  event.respondWith(cacheDynamicAssets(event));
});

self.addEventListener('online', function(){
  const db = indexedDB.open('actions', 1);
  db.onsuccess = function(event){
    let db = event.target.result;
    let objStore = db.transaction('requests', 'readwrite').ObjectStore('requests');
    objStore.getAll().onsuccess = function(event){
      let requests = event.target.result;
      for(let request of requests){
        send(request)
      }
    }
  }

  db.onerror = function(event){
    console.log('online event listener, db.onerror event =', event.error);
  }
})

