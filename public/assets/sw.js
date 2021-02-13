if('serviceWorker' in navigator) {
  window.addEventListener('load', function(){
    // service worker container
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
    .then((registration) => {
      console.log('Service worker has loaded successfully.', registration); 
      // try {
      //   navigator.serviceWorker.controller.postMessage({ command: "sync-images" });
      // } catch (er) {
      //   console.log("sw", er);
      // }
    })
    .catch ((err) => {
      console.log('service worker has not loaded successfully.', err);
    });
  });
}

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Error:" + event.target.errorCode);
};


function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}

function checkDatabase() {
  console.log('database being checked.');
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();
  console.log("get all= ", getAll);
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {        
        console.log('sw, CheckDatabase response', response)
        response.json();
      })
      .then(() => {
        // delete records if successful
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.clear();
      }).catch((err) => {
        console.log("err", err);
      })
    }
  };

  getAll.onerror = function(event){
    console.log(event)
  }
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);