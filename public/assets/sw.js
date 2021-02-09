if('serviceWorker' in navigator) {
  window.addEventListener('load', function(){
    // service worker container
    navigator.serviceWorker.register('service-worker.js')
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

