import { useState } from 'react';
import { useAppStore, mockTopCards, Card } from '@/lib/store';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CardsControllerProps {
  // Optional props for future extensions
}

export const useCardsController = (_props?: CardsControllerProps) => {
  const { user, isAuthenticated } = useAppStore();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  // Get user cards - in real app this would come from API
  const getUserCards = (): Card[] => {
    return isAuthenticated && user ? user.cards : [];
  };

  // Check if user has any cards
  const hasCards = (): boolean => {
    const userCards = getUserCards();
    return userCards.length > 0;
  };

  // Handle card selection/deselection
  const handleCardToggle = (cardId: string): void => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  // Handle shipping request
  const handleShipCards = (): void => {
    if (selectedCards.length === 0) return;
    
    // In a real app, this would make an API call to create shipping request
    console.log('Shipping cards:', selectedCards);
    
    // Show success notification (would integrate with notification system)
    // For now, just log and reset
    console.log(`Successfully requested shipping for ${selectedCards.length} cards`);
    
    // Reset selection
    setSelectedCards([]);
    
    // In real app: 
    // - Create shipping request in backend
    // - Update card status to "shipping_requested"
    // - Show success notification
    // - Possibly redirect to shipping tracking page
  };

  // Navigate to home/buy packs
  const navigateToBuyPacks = (): void => {
    window.location.href = '/';
  };

  // Navigate to sign in
  const navigateToAuth = (): void => {
    window.location.href = '/auth';
  };

  // Get cards data for display
  const getCardsData = () => {
    const userCards = getUserCards();
    return {
      userCards,
      hasCards: hasCards(),
      selectedCardsCount: selectedCards.length,
      isCardSelected: (cardId: string) => selectedCards.includes(cardId)
    };
  };

  // Get card expiry info (mock data for now)
  const getCardExpiryInfo = (cardId: string) => {
    // In real app, this would calculate based on card's created date
    return {
      daysLeft: 29,
      expiryDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
      isExpiringSoon: 29 <= 7 // Less than 7 days
    };
  };

  // Get card credit value (50% of market value when expired)
  const getCardCreditValue = (card: Card): number => {
    return Math.round(card.price * 0.5 * 100) / 100;
  };

  // Get top cards for demo section
  const getTopCards = () => {
    return mockTopCards;
  };

  // Get authentication state
  const getAuthState = () => {
    return {
      isAuthenticated,
      user
    };
  };

  // Handle bulk actions
  const handleSelectAllCards = (): void => {
    const userCards = getUserCards();
    if (selectedCards.length === userCards.length) {
      // Deselect all
      setSelectedCards([]);
    } else {
      // Select all
      setSelectedCards(userCards.map(card => card.id));
    }
  };

  const handleClearSelection = (): void => {
    setSelectedCards([]);
  };

  // Validation helpers
  const canShipCards = (): boolean => {
    return selectedCards.length > 0 && isAuthenticated;
  };

  const getShippingValidationMessage = (): string | null => {
    if (!isAuthenticated) {
      return "Please sign in to ship cards";
    }
    if (selectedCards.length === 0) {
      return "Please select cards to ship";
    }
    return null;
  };

  return {
    // State
    selectedCards,
    
    // Data getters
    getCardsData,
    getCardExpiryInfo,
    getCardCreditValue,
    getTopCards,
    getAuthState,
    
    // Actions
    handleCardToggle,
    handleShipCards,
    handleSelectAllCards,
    handleClearSelection,
    navigateToBuyPacks,
    navigateToAuth,
    
    // Validations
    canShipCards,
    getShippingValidationMessage,
    
    // Computed values
    hasSelectedCards: selectedCards.length > 0,
    selectedCardsCount: selectedCards.length
  };
};

// Static data and configurations
export const getCardsPageConfig = () => {
  return {
    cardExpiryDays: 30,
    creditConversionRate: 0.5, // 50% of market value
    maxShippableCards: 50,
    shippingCostThreshold: 10 // Free shipping above this many cards
  };
};

// Helper functions for card operations
export const cardHelpers = {
  isCardExpired: (expiryDate: Date): boolean => {
    return new Date() > expiryDate;
  },
  
  isCardExpiringSoon: (expiryDate: Date, daysThreshold: number = 7): boolean => {
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
  },
  
  formatCardPrice: (price: number): string => {
    return `$${price.toFixed(2)}`;
  },
  
  getCardRarityColor: (rarity: string): string => {
    const colors: Record<string, string> = {
      'common': 'text-gray-500',
      'uncommon': 'text-green-500',
      'rare': 'text-blue-500',
      'mythic': 'text-purple-500',
      'legendary': 'text-orange-500'
    };
    return colors[rarity] || 'text-gray-500';
  }
};