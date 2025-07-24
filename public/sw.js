import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST)


self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.source.postMessage('activated');
});

self.addEventListener('message', event => { 
  }
)
