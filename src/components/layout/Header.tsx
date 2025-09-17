import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Button, AuthModal } from '../ui';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <header className="bg-background-secondary border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎴</span>
            </div>
            <span className="font-gaming text-xl font-bold text-white">
              HobbyHunter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/my-cards" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              My Cards
            </Link>
            <Link 
              to="/shipping" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Shipping
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Credits Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-background-card px-3 py-1 rounded-lg">
                  <span className="text-yellow-400">💰</span>
                  <span className="text-white font-semibold">{user.credits.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">credits</span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <Link 
                    to="/account" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block font-medium">{user.username}</span>
                  </Link>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:block"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={openLoginModal}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={openRegisterModal}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-background-card transition-colors"
              aria-label="Open mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {/* Credits Display (Mobile) */}
              {isAuthenticated && user && (
                <div className="flex items-center justify-between p-3 bg-background-card rounded-lg">
                  <span className="text-white font-medium">{user.username}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">💰</span>
                    <span className="text-white font-semibold">{user.credits.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/my-cards" 
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Cards
              </Link>
              <Link 
                to="/shipping" 
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shipping
              </Link>
              <Link 
                to="/account" 
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Account
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Auth Buttons (Mobile) */}
              {isAuthenticated ? (
                <Button variant="danger" size="sm" onClick={handleLogout} className="mt-3">
                  Logout
                </Button>
              ) : (
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={openLoginModal}>
                    Login
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={openRegisterModal}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </header>
  );
};