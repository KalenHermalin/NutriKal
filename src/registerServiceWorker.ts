// Create a standalone notification handler that doesn't depend on hooks
let notificationHandler: ((notification: any) => void) | null = null;

export function setNotificationHandler(handler: (notification: any) => void) {
  notificationHandler = handler;
}

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

                  // Use notification handler if available
                  if (notificationHandler) {
                    notificationHandler({
                      message: "New Update Installed, reloading page to update..",
                      type: 'info',
                      userAction: {
                        label: "Refresh",
                        onClick() {
                          setTimeout(() => {
                            newWorker.postMessage({ type: 'skipWaiting' })
                          }, 3000)
                        },
                      }
                    });
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);

          // Use notification handler for errors if available
          if (notificationHandler) {
            notificationHandler({
              message: `ServiceWorker registration failed: ${error}`,
              type: 'system-critical'
            });
          }
        });

      // Handle service worker updates when the user refreshes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
      });
    });
  }
}
