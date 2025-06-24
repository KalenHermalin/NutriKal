import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { register, setNotificationHandler } from './registerServiceWorker';
import { ErrorProvider, useNotification } from './components/ErrorSystem';


const ServiceWorkerInitializer = () => {
  const { addNotifications } = useNotification();

  React.useEffect(() => {
    setNotificationHandler(addNotifications);
    register(); // Register service worker after setting up notifications
  }, [addNotifications]);

  return null;
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorProvider>
      <ServiceWorkerInitializer />
      <App />
    </ErrorProvider>
  </React.StrictMode>,
);


