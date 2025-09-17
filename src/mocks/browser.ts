import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup the service worker with our request handlers
export const worker = setupWorker(...handlers);

// Global flag to track MSW status
let mswReady = false;
let mswError = false;

// Start the worker in development with enhanced error handling
export const startMocking = async (): Promise<boolean> => {
  // Only run in development
  if (!import.meta.env.DEV) {
    console.log('🔄 MSW: Skipping in production');
    return false;
  }

  // Don't start if already attempted
  if (mswReady || mswError) {
    return mswReady;
  }

  try {
    console.log('🚀 MSW: Starting service worker...');
    
    // Start with timeout
    await Promise.race([
      worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        },
        quiet: false
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MSW start timeout')), 5000)
      )
    ]);
    
    mswReady = true;
    console.log('✅ MSW: Mock API is running');
    
    // Add visual indicator in development
    if (typeof document !== 'undefined') {
      const indicator = document.createElement('div');
      indicator.innerHTML = '🟢 MSW Active';
      indicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #10B981;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
      `;
      document.body.appendChild(indicator);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(indicator)) {
          document.body.removeChild(indicator);
        }
      }, 3000);
    }
    
    return true;
  } catch (error) {
    mswError = true;
    console.warn('⚠️ MSW: Failed to start mock service worker:', error);
    console.log('📱 MSW: Application will continue without mocked APIs');
    
    // Add visual warning in development
    if (typeof document !== 'undefined') {
      const warning = document.createElement('div');
      warning.innerHTML = '🟡 MSW Failed - Real APIs';
      warning.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #F59E0B;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
      `;
      document.body.appendChild(warning);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(warning)) {
          document.body.removeChild(warning);
        }
      }, 5000);
    }
    
    return false;
  }
};

// Utility functions
export const isMSWReady = () => mswReady;
export const hasMSWError = () => mswError;

// Reset function for testing
export const resetMSWState = () => {
  mswReady = false;
  mswError = false;
};