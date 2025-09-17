import React, { useState, useEffect } from 'react';
import { useAppStore, useUserStore } from '../store';
import { Button, Modal, LoadingSpinner } from '../components/ui';
import { ShippingForm } from '../components/forms';
import type { ShippingAddress } from '../types';

const AccountPage: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    addCredits, 
    recentTransactions, 
    fetchRecentTransactions,
    isLoading 
  } = useAppStore();
  
  const {
    preferences,
    updatePreferences,
    shippingAddresses,
    defaultShippingAddress,
    addShippingAddress,
    updateShippingAddress,
    removeShippingAddress,
    setDefaultShippingAddress,
    cardViewMode,
    setCardViewMode,
    cardsPerPage,
    setCardsPerPage
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'credits' | 'shipping' | 'preferences' | 'transactions'>('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState(500);

  const handleAddCredits = async (amount: number) => {
    try {
      await addCredits(amount);
    } catch (error) {
      console.error('Failed to add credits:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to access your account.</p>
          <Button variant="primary">Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Account</h1>
          <p className="text-gray-400">Manage your profile and credits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-background-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <p className="text-white font-semibold">{user.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-white">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          <div className="bg-background-secondary rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Credits</h2>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-yellow-400 text-2xl">💰</span>
                <span className="text-3xl font-bold text-white">
                  {user.credits.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400">Available Credits</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Add Credits</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleAddCredits(500)}
                  className="w-full"
                >
                  💰 500 Credits
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddCredits(1000)}
                  className="w-full"
                >
                  💰 1,000 Credits
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAddCredits(2500)}
                  className="w-full"
                >
                  💰 2,500 Credits
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => handleAddCredits(5000)}
                  className="w-full"
                >
                  💰 5,000 Credits
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Payments processed securely through PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;