import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui';
import { useAppStore } from '../../store';

export const Layout: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </div>
  );
};