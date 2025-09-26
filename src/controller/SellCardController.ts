import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { CardData } from './MyCardsController';

export interface SellCardDetails {
  card: CardData;
  instantBuybackOffer: number;
  multiplier: string;
  packCost: number;
  rarity: string;
  condition: string;
  finish: string;
  priceSource: string;
}

export interface BalancePreview {
  currentBalance: number;
  creditFromSale: number;
  newBalance: number;
}

export interface SellCardControllerProps {
  cardId?: number;
  onSellComplete?: () => void;
  onCancel?: () => void;
}

export const useSellCardController = ({ cardId, onSellComplete, onCancel }: SellCardControllerProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppStore();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellCardDetails, setSellCardDetails] = useState<SellCardDetails | null>(null);

  // Mock card data - in a real app, this would come from an API
  const mockCards: CardData[] = [
    {
      id: 1,
      cardName: 'Sephiroth',
      rarity: 'Common',
      sellFor: '$100',
      expireDate: '12/4/2025',
      status: 'Available'
    },
    {
      id: 2,
      cardName: 'Cloud Strife',
      rarity: 'Common',
      sellFor: '$80',
      expireDate: '12/4/2025',
      status: 'Available'
    },
    {
      id: 3,
      cardName: 'Rare Summon',
      rarity: 'Uncommon',
      sellFor: '$60',
      expireDate: '12/3/2025',
      status: 'Available'
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
      status: 'Available'
    }
  ];

  // Initialize sell details when modal opens
  useEffect(() => {
    if (isOpen && cardId) {
      const card = mockCards.find(c => c.id === cardId);
      if (card) {
        const sellPrice = parseFloat(card.sellFor.replace('$', ''));
        const packCost = 10; // Mock pack cost
        const multiplier = `${sellPrice / packCost}x`;
        
        setSellCardDetails({
          card,
          instantBuybackOffer: sellPrice,
          multiplier: `${multiplier} (Pack $${packCost})`,
          packCost,
          rarity: getRarityDisplay(card.cardName),
          condition: getCardCondition(card.cardName),
          finish: getCardFinish(card.cardName),
          priceSource: 'MTGGoldfish / TCGPlayer'
        });
      }
    }
  }, [isOpen, cardId]);

  // Get rarity display based on card
  const getRarityDisplay = (cardName: string): string => {
    const rarityMap: { [key: string]: string } = {
      'Sephiroth': 'Legendary',
      'Cloud Strife': 'Epic',
      'Rare Summon': 'Rare',
      'Chocobo': 'Rare',
      'Materia': 'Legendary'
    };
    return rarityMap[cardName] || 'Common';
  };

  // Get card condition
  const getCardCondition = (cardName: string): string => {
    // Mock conditions - in a real app, this would come from the card data
    const conditionMap: { [key: string]: string } = {
      'Sephiroth': 'Mint*',
      'Cloud Strife': 'Near Mint',
      'Rare Summon': 'Lightly Played',
      'Chocobo': 'Mint*',
      'Materia': 'Near Mint'
    };
    return conditionMap[cardName] || 'Near Mint';
  };

  // Get card finish
  const getCardFinish = (cardName: string): string => {
    const finishMap: { [key: string]: string } = {
      'Sephiroth': 'Surge Foil',
      'Cloud Strife': 'Regular',
      'Rare Summon': 'Foil',
      'Chocobo': 'Regular',
      'Materia': 'Surge Foil'
    };
    return finishMap[cardName] || 'Regular';
  };

  // Calculate balance preview
  const getBalancePreview = (): BalancePreview => {
    const currentBalance = user?.credits || 0;
    const creditFromSale = sellCardDetails?.instantBuybackOffer || 0;
    const newBalance = currentBalance + creditFromSale;

    return {
      currentBalance,
      creditFromSale,
      newBalance
    };
  };

  // Open sell confirmation modal
  const openSellConfirmation = (selectedCardId: number) => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
      return;
    }

    const card = mockCards.find(c => c.id === selectedCardId);
    if (!card) {
      setError('Card not found');
      return;
    }

    if (card.status !== 'Available') {
      setError('This card is not available for sale');
      return;
    }

    setError(null);
    setIsOpen(true);
  };

  // Close modal
  const closeSellConfirmation = () => {
    setIsOpen(false);
    setSellCardDetails(null);
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    closeSellConfirmation();
  };

  // Handle ship instead
  const handleShipInstead = () => {
    if (cardId) {
      closeSellConfirmation();
      navigate(`/shipping/${cardId}`);
    }
  };

  // Confirm sell
  const handleConfirmSell = async () => {
    if (!sellCardDetails || !user) {
      setError('Missing required information for sale');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call to process the sale
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would:
      // 1. Transfer card ownership to the platform
      // 2. Add credits to user's account
      // 3. Update card status to "Sold"
      // 4. Send confirmation email
      // 5. Update transaction history

      const saleDetails = {
        cardId: sellCardDetails.card.id,
        cardName: sellCardDetails.card.cardName,
        salePrice: sellCardDetails.instantBuybackOffer,
        previousBalance: user.credits,
        newBalance: user.credits + sellCardDetails.instantBuybackOffer,
        timestamp: new Date().toISOString()
      };

      console.log('Card sold successfully:', saleDetails);

      // Show success message
      alert(`${sellCardDetails.card.cardName} sold successfully for $${sellCardDetails.instantBuybackOffer}!`);

      // Close modal and refresh data
      closeSellConfirmation();
      
      if (onSellComplete) {
        onSellComplete();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sell card';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get card attributes for display
  const getCardAttributes = () => {
    if (!sellCardDetails) return [];

    return [
      { label: 'Rarity', value: sellCardDetails.rarity, color: 'bg-gray-500' },
      { label: 'Finish', value: sellCardDetails.finish, color: 'bg-blue-500' },
      { label: 'Condition', value: sellCardDetails.condition, color: 'bg-green-500' }
    ];
  };

  // Validate if sale can proceed
  const canProceedWithSale = (): boolean => {
    return !!sellCardDetails && !isProcessing && isAuthenticated;
  };

  return {
    // State
    isOpen,
    isProcessing,
    error,
    sellCardDetails,
    
    // Data
    balancePreview: getBalancePreview(),
    cardAttributes: getCardAttributes(),
    
    // Validation
    canProceedWithSale: canProceedWithSale(),
    
    // Actions
    openSellConfirmation,
    closeSellConfirmation,
    handleCancel,
    handleShipInstead,
    handleConfirmSell,
    
    // Utils
    clearError: () => setError(null)
  };
};