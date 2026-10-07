import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for offline capability
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('FitGen AI ServiceWorker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('FitGen AI ServiceWorker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
