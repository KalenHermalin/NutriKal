import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { register } from './registerServiceWorker';
import { ErrorProvider } from './components/ErrorSystem';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorProvider>
      <App />
    </ErrorProvider>
  </React.StrictMode>,
);

register();
