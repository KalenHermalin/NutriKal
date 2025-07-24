import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorProvider, useNotification } from './components/ErrorSystem';


const ServiceWorkerInitializer = () => {
  const { addNotifications } = useNotification();

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                addNotifications({
                  message: "New Service Worker Installed, refreshing to use",
                  type: "info"
                })
                newWorker.postMessage('skipWaiting');

              }
            })
          } else {
            addNotifications({
              message: "Failed to find service worker",
              type: "system-critical",
              userAction: {
                label: "Refresh",
                onClick() {
                  window.location.reload()
                },
              }
            });

          }


        })
      }).catch(res => {
        addNotifications({
          message: `Service Worker registration failed: ${res}`,
          type: 'system-critical',

        })
      });

    } else {
      addNotifications({
        message: "Service workers are not avaliable on this browser",
        type: 'info'
      })
    }
    navigator.serviceWorker.onmessage = (event) => {
      if (event.data === 'Skiped_waiting') {
        addNotifications({
          message: "skipped waiting",
          type: "info",
        });
    }
    };
  }, []);

  return null;
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorProvider>
    <ServiceWorkerInitializer />
    <App />
   
  </ErrorProvider>
);


