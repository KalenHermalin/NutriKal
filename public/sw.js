import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST)


self.addEventListener('install', event => {
  self.skipWaiting();
  console.log("INSTALLED")
});

self.addEventListener('activate', event => {
  console.log("ACTIVATED")
})

self.addEventListener('message', event => { 
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    self.postMessage('Skiped_waiting')
  }
})
