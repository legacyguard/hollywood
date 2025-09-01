import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './lib/i18n/config'; // Initialize i18n
import { pwaService } from './lib/pwa/pwaService';
import { offlineStorageService } from './lib/pwa/offlineStorage';
import { pushNotificationService } from './lib/pwa/pushNotifications';

// Initialize PWA services
async function initializePWA() {
  try {
    // Initialize services in parallel
    await Promise.all([
      pwaService.initialize(),
      offlineStorageService.initialize(),
      pushNotificationService.initialize()
    ]);

    console.log('✅ PWA services initialized successfully');
  } catch (error) {
    console.error('❌ PWA initialization failed:', error);
  }
}

// Initialize PWA services
initializePWA();

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
