import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore, useUserStore } from '../store';
import { CardList } from '../components/cards';
import { ShippingForm } from '../components/forms';
import { Button, Modal, LoadingSpinner } from '../components/ui';
import type { ShippingAddress } from '../types';

interface LocationState {
  selectedCards?: string[];
}

const ShippingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const {
    user,
    isAuthenticated,
    userCards,
    fetchUserCards,
    selectedCards,
    selectCard,
    unselectCard,
    clearSelection,
    shipCards,
    isLoading
  } = useAppStore();
  
  const {
    shippingAddresses,
    defaultShippingAddress,
    addShippingAddress,
    updateShippingAddress,
    removeShippingAddress,
    setDefaultShippingAddress
  } = useUserStore();

  const [currentStep, setCurrentStep] = useState<'cards' | 'address' | 'confirm'>('cards');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(defaultShippingAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Initialize selected cards from navigation state
  useEffect(() => {
    if (state?.selectedCards) {
      clearSelection();
      state.selectedCards.forEach(cardId => selectCard(cardId));
    }
  }, [state, clearSelection, selectCard]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCards();
    }
  }, [isAuthenticated, fetchUserCards]);

  // Calculate estimated shipping cost
  useEffect(() => {
    const cardCount = selectedCards.length;
    if (cardCount === 0) {
      setEstimatedCost(0);
    } else if (cardCount <= 5) {
      setEstimatedCost(299); // $2.99
    } else if (cardCount <= 15) {
      setEstimatedCost(499); // $4.99
    } else {
      setEstimatedCost(799); // $7.99
    }
  }, [selectedCards]);

  const handleCardSelect = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      unselectCard(cardId);
    } else {
      selectCard(cardId);
    }
  };

  const handleAddAddress = async (addressData: ShippingAddress) => {
    await addShippingAddress(addressData);
    setShowAddressForm(false);
    setSelectedAddress(addressData.id!);
  };

  const handleUpdateAddress = async (addressData: ShippingAddress) => {
    if (editingAddress?.id) {
      await updateShippingAddress(editingAddress.id, addressData);
      setEditingAddress(null);
      setShowAddressForm(false);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    removeShippingAddress(addressId);
    if (selectedAddress === addressId) {
      setSelectedAddress(shippingAddresses.length > 1 ? shippingAddresses[0].id! : null);
    }
  };

  const handleShipCards = async () => {
    if (!selectedAddress || selectedCards.length === 0) return;
    
    const address = shippingAddresses.find(a => a.id === selectedAddress);
    if (!address) return;
    
    try {
      await shipCards(selectedCards, address);
      navigate('/my-cards', { 
        state: { message: 'Cards shipped successfully! You will receive tracking information via email.' }
      });
    } catch (error) {
      console.error('Shipping failed:', error);
    }
  };

  const canProceedToAddress = selectedCards.length > 0;
  const canProceedToConfirm = selectedAddress && selectedCards.length > 0;
  const canShip = canProceedToConfirm && estimatedCost > 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to ship cards.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const shippableCards = userCards.filter(card => !card.isExpired);

  return (
    <div className="min-h-screen bg-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Ship Your Cards</h1>
          <p className="text-gray-400">
            Convert your digital cards into high-quality physical collectibles
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'cards' ? 'text-primary-400' : 
              ['address', 'confirm'].includes(currentStep) ? 'text-green-400' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'cards' ? 'border-primary-400 bg-primary-400/20' :
                ['address', 'confirm'].includes(currentStep) ? 'border-green-400 bg-green-400/20' :
                'border-gray-400'
              }`}>
                {['address', 'confirm'].includes(currentStep) ? '✓' : '1'}
              </div>
              <span className="font-medium">Select Cards</span>
            </div>
            
            <div className={`h-0.5 w-16 ${
              ['address', 'confirm'].includes(currentStep) ? 'bg-green-400' : 'bg-gray-600'
            }`} />
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'address' ? 'text-primary-400' :
              currentStep === 'confirm' ? 'text-green-400' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'address' ? 'border-primary-400 bg-primary-400/20' :
                currentStep === 'confirm' ? 'border-green-400 bg-green-400/20' :
                'border-gray-400'
              }`}>
                {currentStep === 'confirm' ? '✓' : '2'}
              </div>
              <span className="font-medium">Shipping Address</span>
            </div>
            
            <div className={`h-0.5 w-16 ${
              currentStep === 'confirm' ? 'bg-green-400' : 'bg-gray-600'
            }`} />
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'confirm' ? 'text-primary-400' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'confirm' ? 'border-primary-400 bg-primary-400/20' : 'border-gray-400'
              }`}>
                3
              </div>
              <span className="font-medium">Confirm & Ship</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-background-secondary rounded-xl border border-gray-700">
          {/* Step 1: Select Cards */}
          {currentStep === 'cards' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Select Cards to Ship</h2>
                  <p className="text-gray-400">
                    Choose which cards you'd like to receive as physical collectibles
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Selected: {selectedCards.length}</p>
                  <p className="text-lg font-semibold text-white">
                    Est. Cost: ${(estimatedCost / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {shippableCards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    📦
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Cards Available</h3>
                  <p className="text-gray-400 mb-4">
                    You don't have any cards available for shipping.
                  </p>
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Get Some Packs
                  </Button>
                </div>
              ) : (
                <>
                  <CardList
                    cards={shippableCards}
                    onCardSelect={handleCardSelect}
                    selectedCards={selectedCards}
                    showBulkActions={false}
                  />
                  
                  <div className="flex justify-end mt-6 pt-6 border-t border-gray-700">
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStep('address')}
                      disabled={!canProceedToAddress}
                    >
                      Continue to Address ({selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''})
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 'address' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Shipping Address</h2>
                  <p className="text-gray-400">
                    Choose or add a shipping address for your cards
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('cards')}
                >
                  ← Back to Cards
                </Button>
              </div>

              {/* Existing Addresses */}
              {shippingAddresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Saved Addresses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shippingAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedAddress(address.id!)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="radio"
                                checked={selectedAddress === address.id}
                                onChange={() => setSelectedAddress(address.id!)}
                                className="text-primary-600"
                              />
                              <span className="font-medium text-white">
                                {address.firstName} {address.lastName}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-green-600 text-xs rounded text-white">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zipCode}<br />
                              {address.country}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAddress(address);
                                setShowAddressForm(true);
                              }}
                              className="text-gray-400 hover:text-white text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id!);
                              }}
                              className="text-gray-400 hover:text-red-400 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Button */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                >
                  + Add New Address
                </Button>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-700">
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep('confirm')}
                  disabled={!canProceedToConfirm}
                >
                  Continue to Confirmation
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Ship */}
          {currentStep === 'confirm' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Confirm Your Order</h2>
                  <p className="text-gray-400">
                    Review your selection and complete the shipping request
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('address')}
                >
                  ← Back to Address
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Selected Cards Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Selected Cards ({selectedCards.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCards.map(cardId => {
                      const card = userCards.find(c => c.id === cardId);
                      if (!card) return null;
                      return (
                        <div key={cardId} className="flex items-center space-x-3 p-2 bg-background-card rounded">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-white">{card.name}</p>
                            <p className="text-sm text-gray-400 capitalize">{card.rarity}</p>
                          </div>
                          <span className="text-yellow-400">${(card.value / 100).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Shipping Summary</h3>
                  
                  {/* Address */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Shipping Address</h4>
                    {selectedAddress && (
                      <div className="p-3 bg-background-card rounded">
                        {(() => {
                          const address = shippingAddresses.find(a => a.id === selectedAddress);
                          return address ? (
                            <div className="text-sm text-gray-300">
                              <p className="font-medium text-white">
                                {address.firstName} {address.lastName}
                              </p>
                              <p>{address.street}</p>
                              <p>{address.city}, {address.state} {address.zipCode}</p>
                              <p>{address.country}</p>
                            </div>
                          ) : null;
                        })()} 
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Cost Breakdown</h4>
                    <div className="p-3 bg-background-card rounded space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Cards ({selectedCards.length})</span>
                        <span className="text-white">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Shipping & Handling</span>
                        <span className="text-white">${(estimatedCost / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-yellow-400">${(estimatedCost / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-700">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleShipCards}
                  disabled={!canShip}
                >
                  Ship Cards (${(estimatedCost / 100).toFixed(2)})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      <Modal
        isOpen={showAddressForm}
        onClose={() => {
          setShowAddressForm(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="lg"
      >
        <div className="p-6">
          <ShippingForm
            initialData={editingAddress || undefined}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            submitText={editingAddress ? 'Update Address' : 'Add Address'}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ShippingPage;