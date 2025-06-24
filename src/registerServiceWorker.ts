// Create a standalone notification handler that doesn't depend on hooks
let notificationHandler: ((notification: any) => void) | null = null;

export function setNotificationHandler(handler: (notification: any) => void) {
  notificationHandler = handler;
}

export function register() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(reg => {
      const newWorker = reg.installing
      if (newWorker)
    })
  }
}
