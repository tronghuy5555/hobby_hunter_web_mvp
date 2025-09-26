import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';

export interface CardData {
  id: number;
  cardName: string;
  rarity: string;
  sellFor: string;
  expireDate: string;
  status: 'In Shipping' | 'Delivered' | 'Locked' | 'Available' | 'Sold';
}

export interface MyCardsControllerProps {
  // Optional props for future extensions
  initialTab?: TabType;
}

export type TabType = 'all' | 'locked';

export const useMyCardsController = (_props?: MyCardsControllerProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Mock card data - in a real app, this would come from an API
  const allCards: CardData[] = [
    {
      id: 1,
      cardName: 'Sephiroth',
      rarity: 'Common',
      sellFor: '$100',
      expireDate: '12/4/2025',
      status: 'In Shipping'
    },
    {
      id: 2,
      cardName: 'Cloud Strife',
      rarity: 'Common',
      sellFor: '$80',
      expireDate: '12/4/2025',
      status: 'Delivered'
    },
    {
      id: 3,
      cardName: 'Rare Summon',
      rarity: 'Uncommon',
      sellFor: '$60',
      expireDate: '12/3/2025',
      status: 'Locked'
    },
    {
      id: 4,
      cardName: 'Chocobo',
      rarity: 'Rare',
      sellFor: '$40',
      expireDate: '12/4/2025',
      status: 'Available'
    },
    {
      id: 5,
      cardName: 'Materia',
      rarity: 'Legendary',
      sellFor: '$25',
      expireDate: '12/4/2025',
      status: 'Sold'
    }
  ];

  // Initialize and handle authentication
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      if (!isAuthenticated) {
        navigate('/auth?mode=login');
        return;
      }

      // In a real app, fetch user's cards from API
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setError(null);
      } catch (err) {
        setError('Failed to load cards. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isAuthenticated, navigate]);

  // Filter cards based on active tab
  const getDisplayCards = (): CardData[] => {
    switch (activeTab) {
      case 'locked':
        return allCards.filter(card => card.status === 'Locked');
      case 'all':
      default:
        return allCards;
    }
  };

  // Handle tab switching
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Handle selling a card
  const handleSell = async (cardId: number) => {
    setError(null);
    
    try {
      const card = allCards.find(c => c.id === cardId);
      if (!card) {
        throw new Error('Card not found');
      }

      if (card.status !== 'Available') {
        throw new Error('This card is not available for sale');
      }

      // Open sell confirmation modal
      setSelectedCardId(cardId);
      setSellModalOpen(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate card sale';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Handle sell modal close
  const handleSellModalClose = () => {
    setSellModalOpen(false);
    setSelectedCardId(null);
  };

  // Handle sell completion
  const handleSellComplete = () => {
    // In a real app, you would refresh the card data from the API
    // For now, we'll just close the modal
    handleSellModalClose();
    
    // Optionally reload the page data
    // window.location.reload();
  };

  // Handle shipping a card
  const handleShip = (cardId: number) => {
    const card = allCards.find(c => c.id === cardId);
    if (!card) {
      setError('Card not found');
      return;
    }

    if (card.status !== 'Available') {
      setError('This card is not available for shipping');
      return;
    }

    // Navigate to shipping page with cardId
    navigate(`/shipping/${cardId}`);
  };

  // Get status badge configuration
  const getStatusBadgeConfig = (status: CardData['status']) => {
    const statusConfig = {
      'In Shipping': { className: 'bg-blue-500 text-white', label: 'In Shipping' },
      'Delivered': { className: 'bg-green-500 text-white', label: 'Delivered' },
      'Locked': { className: 'bg-red-500 text-white', label: 'Locked' },
      'Available': { className: 'bg-yellow-500 text-black', label: 'Available' },
      'Sold': { className: 'bg-gray-500 text-white', label: 'Sold' }
    };

    return statusConfig[status];
  };

  // Get statistics
  const getStatistics = () => {
    return {
      totalCards: allCards.length,
      availableCards: allCards.filter(card => card.status === 'Available').length,
      lockedCards: allCards.filter(card => card.status === 'Locked').length,
      soldCards: allCards.filter(card => card.status === 'Sold').length,
      totalValue: allCards.reduce((sum, card) => {
        const value = parseFloat(card.sellFor.replace('$', ''));
        return sum + value;
      }, 0)
    };
  };

  // Check if card has available actions
  const hasAvailableActions = (card: CardData): boolean => {
    return card.status === 'Available';
  };

  return {
    // State
    activeTab,
    isLoading,
    error,
    sellModalOpen,
    selectedCardId,
    
    // Data
    allCards,
    displayCards: getDisplayCards(),
    statistics: getStatistics(),
    
    // Actions
    handleTabChange,
    handleSell,
    handleShip,
    handleSellModalClose,
    handleSellComplete,
    
    // Utils
    getStatusBadgeConfig,
    hasAvailableActions,
    clearError: () => setError(null)
  };
};