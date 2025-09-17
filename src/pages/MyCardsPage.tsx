import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { CardList } from '../components/cards';
import { Button, LoadingSpinner } from '../components/ui';

const MyCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userCards, 
    fetchUserCards, 
    isLoading, 
    selectedCards, 
    selectCard, 
    unselectCard, 
    clearSelection,
    isAuthenticated 
  } = useAppStore();
  
  const [showShippingModal, setShowShippingModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCards();
    }
  }, [isAuthenticated, fetchUserCards]);

  const handleCardSelect = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      unselectCard(cardId);
    } else {
      selectCard(cardId);
    }
  };

  const handleShip = (cardIds: string[]) => {
    navigate('/shipping', {
      state: { selectedCards: cardIds }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your cards.</p>
          <Button variant="primary">Log In</Button>
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

  return (
    <div className="min-h-screen bg-background-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">My Card Collection</h1>
          <p className="text-gray-400">
            Manage your collected cards and ship your favorites
          </p>
        </div>

        <CardList
          cards={userCards}
          onShip={handleShip}
          onCardSelect={handleCardSelect}
          selectedCards={selectedCards}
          showBulkActions={true}
        />
      </div>
    </div>
  );
};

export default MyCardsPage;