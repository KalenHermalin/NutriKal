import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST)


self.addEventListener('install', event => {
  self.skipWaiting();
  console.log("INSTALLED")
});

self.addEventListener('activate', event => {
  console.log("ACTIVATED")
})
