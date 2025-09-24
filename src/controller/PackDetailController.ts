import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, Pack, mockPacks } from '@/lib/store';

export interface PackDetailControllerProps {
  packId: string;
}

export const usePackDetailController = ({ packId }: PackDetailControllerProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppStore();
  const [pack, setPack] = useState<Pack | null>(null);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load pack data on mount or when packId changes
  useEffect(() => {
    const loadPack = () => {
      setIsLoading(true);
      setError(null);
      
      if (!packId) {
        setError('Pack ID is required');
        setIsLoading(false);
        return;
      }

      // Find pack in mock data
      const foundPack = mockPacks.find(p => p.id === packId);
      
      if (!foundPack) {
        setError('Pack not found');
        setPack(null);
      } else {
        setPack(foundPack);
        setError(null);
      }
      
      setIsLoading(false);
    };

    loadPack();
  }, [packId]);

  // Handle purchase action
  const handlePurchase = () => {
    if (!pack) {
      setError('Pack not available');
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
      return;
    }

    // Check user credits
    if (user && user.credits < pack.price) {
      setError(`Insufficient credits. You have $${user.credits} but need $${pack.price}.`);
      return;
    }

    // Clear any previous errors
    setError(null);
    
    // Navigate to checkout page with the selected pack
    navigate('/checkout', { state: { packId: pack.id } });
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate('/');
  };

  // Handle authentication navigation
  const handleSignIn = () => {
    navigate('/auth?mode=login');
  };

  // Get pack tags
  const getPackTags = () => {
    if (!pack) return [];
    
    const baseTags = [
      { label: 'CCG', variant: 'secondary' as const },
      { label: 'Trading Cards', variant: 'secondary' as const },
      { label: '2025', variant: 'secondary' as const }
    ];

    // Add dynamic tags based on pack name
    if (pack.name.includes('Pokémon') || pack.name.includes('Pokemon')) {
      baseTags.push(
        { label: 'Pokémon', variant: 'secondary' as const },
        { label: 'Japanese', variant: 'secondary' as const },
        { label: 'Pokémon Starter Pack', variant: 'secondary' as const }
      );
    } else if (pack.name.includes('Final Fantasy')) {
      baseTags.push(
        { label: 'Final Fantasy', variant: 'secondary' as const },
        { label: 'Magic: The Gathering', variant: 'secondary' as const }
      );
    } else if (pack.name.includes('Yu-Gi-Oh')) {
      baseTags.push(
        { label: 'Yu-Gi-Oh!', variant: 'secondary' as const },
        { label: 'Legendary Duelists', variant: 'secondary' as const }
      );
    } else if (pack.name.includes('Magic')) {
      baseTags.push(
        { label: 'Magic: The Gathering', variant: 'secondary' as const },
        { label: 'MTG', variant: 'secondary' as const }
      );
    } else if (pack.name.includes('Dragon Ball')) {
      baseTags.push(
        { label: 'Dragon Ball Super', variant: 'secondary' as const },
        { label: 'Anime', variant: 'secondary' as const }
      );
    } else if (pack.name.includes('One Piece')) {
      baseTags.push(
        { label: 'One Piece', variant: 'secondary' as const },
        { label: 'Anime', variant: 'secondary' as const }
      );
    }

    return baseTags;
  };

  // Get pack description
  const getPackDescription = () => {
    if (!pack) return '';
    
    if (pack.description) {
      return pack.description;
    }
    
    // Default description based on pack type
    return `Survive to become stronger. Trading cards of all types are putting everything on the line to 
    become legendary! Harness the power of rare cards, embrace the overflowing energy of epic pulls, 
    and team up with more of these powerful cards that boast devastating effects and high value. 
    But consider your strategy carefully—extra power brings extra risks! Choose your cards wisely and prepare for 
    the biggest collection you've ever seen in this trading card expansion!`;
  };

  // Check if user can afford the pack
  const canAffordPack = () => {
    if (!isAuthenticated || !user || !pack) return false;
    return user.credits >= pack.price;
  };

  // Get insufficient funds message
  const getInsufficientFundsMessage = () => {
    if (!user || !pack) return '';
    if (user.credits >= pack.price) return '';
    return `Insufficient credits. Add $${pack.price - user.credits} more to purchase.`;
  };

  // Get user balance info
  const getUserBalanceInfo = () => {
    if (!isAuthenticated || !user) return null;
    
    return {
      balance: user.credits,
      canAfford: canAffordPack(),
      shortfall: pack ? Math.max(0, pack.price - user.credits) : 0
    };
  };

  return {
    // State
    pack,
    isLoading,
    error,
    isOpeningPack,
    
    // User info
    user,
    isAuthenticated,
    
    // Actions
    handlePurchase,
    handleGoBack,
    handleSignIn,
    
    // Data getters
    getPackTags,
    getPackDescription,
    canAffordPack,
    getInsufficientFundsMessage,
    getUserBalanceInfo,
    
    // Utils
    clearError: () => setError(null)
  };
};