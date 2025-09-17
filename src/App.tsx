import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { LoadingSpinner } from './components/ui';
import { startMocking } from './mocks';
import { useAppStore } from './store';
import { DebugUtils } from './utils';
import HomePage from './pages/HomePage';
import OpenPackPage from './pages/OpenPackPage';
import MyCardsPage from './pages/MyCardsPage';
import ShippingPage from './pages/ShippingPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';

function App() {
  const { fetchAvailablePacks, fetchTopCards, isLoading } = useAppStore();
  const [appInitialized, setAppInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    
    const initializeApp = async () => {
      try {
        DebugUtils.logRender('App', { isLoading, appInitialized });
        DebugUtils.startTimer('App Initialization');
        console.log('🚀 App: Starting initialization...');
        
        // Start MSW (non-blocking)
        DebugUtils.logDataFetch('MSW Start');
        const mswStarted = await startMocking();
        DebugUtils.logDataFetch('MSW Result', { started: mswStarted });
        
        if (isCancelled) return;
        
        // Add small delay to ensure service worker is ready
        if (mswStarted) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (isCancelled) return;
        
        // Initialize app data with timeout
        DebugUtils.logDataFetch('Fetching initial data');
        const dataPromises = [
          fetchAvailablePacks(),
          fetchTopCards()
        ];
        
        // Race against timeout to prevent hanging
        await Promise.race([
          Promise.allSettled(dataPromises),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Data fetch timeout')), 10000)
          )
        ]);
        
        if (!isCancelled) {
          setAppInitialized(true);
          DebugUtils.endTimer('App Initialization');
          DebugUtils.logDataFetch('Initialization completed');
          console.log('✅ App: Initialization completed');
        }
      } catch (error) {
        if (!isCancelled) {
          const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
          DebugUtils.logError(error as Error, 'App Initialization');
          console.error('❌ App: Initialization failed:', error);
          setInitError(errorMessage);
          setAppInitialized(true); // Still allow app to render
        }
      }
    };

    initializeApp();
    
    return () => {
      isCancelled = true;
    };
  }, [fetchAvailablePacks, fetchTopCards]);

  // Always render the basic layout structure
  const renderContent = () => {
    if (!appInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Loading HobbyHunter</h2>
              <p className="text-gray-400">Preparing your card collection experience...</p>
            </div>
          </div>
        </div>
      );
    }

    if (initError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center space-y-4 max-w-md p-6">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Initialization Error</h2>
            <p className="text-gray-400 mb-4">{initError}</p>
            <p className="text-sm text-gray-500 mb-4">
              The app will continue to work but some features may be limited.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="open-pack/:packId" element={<OpenPackPage />} />
          <Route path="my-cards" element={<MyCardsPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    );
  };

  return (
    <Router>
      {renderContent()}
    </Router>
  );
}

export default App;
