import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { register } from './registerServiceWorker';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);

register();
