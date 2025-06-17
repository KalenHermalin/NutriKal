export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);

          // Check for updates to the service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service worker update found!');

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker installed, refresh to use it');
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });

      // Handle service worker updates when the user refreshes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
      });
    });
  }
}
