import { useAppStore, mockPacks, mockTopCards, Card } from '@/lib/store';
import chocoboCard from '@/assets/card-chocobo.jpg';
import moogleCard from '@/assets/card-moogle.jpg';

export interface HomeControllerProps {
  setIsOpeningPack: (opening: boolean) => void;
}

export const useHomeController = ({ setIsOpeningPack }: HomeControllerProps) => {
  const { setCurrentPack, openedCards, isOpening, openPack, setIsOpening, clearOpenedCards } = useAppStore();

  const handleBuyPack = (packId: string) => {
    // In a real app, this would handle payment
    const pack = mockPacks.find(p => p.id === packId);
    if (!pack) return;
    
    setCurrentPack(pack);
    setIsOpening(true);
    setIsOpeningPack(true);
    
    // Simulate pack opening with mock cards
    setTimeout(() => {
      const mockCards: Card[] = [
        { id: 'opened-1', name: 'Chocobo Rider', rarity: 'common', price: 2, image: chocoboCard },
        { id: 'opened-2', name: 'Fire Spell', rarity: 'common', price: 1.5, image: '/placeholder-card.jpg' },
        { id: 'opened-3', name: 'Materia Shard', rarity: 'common', price: 3, image: '/placeholder-card.jpg' },
        mockTopCards[1], // Cloud Strife
        { id: 'opened-4', name: 'Moogle Helper', rarity: 'rare', price: 15, image: moogleCard },
      ];
      openPack(mockCards);
    }, 2000);
  };

  const handlePackOpeningComplete = () => {
    setIsOpeningPack(false);
    clearOpenedCards();
    // In a real app, cards would be added to user collection
  };

  const handleSkipToRares = () => {
    // This would be handled in PackOpening component
  };

  // Layout logic
  const shouldShowLeftColumn = () => {
    return mockPacks.length > 1;
  };

  const getCenterColumnClass = () => {
    return shouldShowLeftColumn() ? "lg:col-span-2" : "lg:col-span-3";
  };

  const getFeaturedPack = () => {
    return mockPacks[0];
  };

  const getAvailablePacks = () => {
    return mockPacks.slice(1, 4);
  };

  const getPotentialHits = () => {
    return mockTopCards;
  };

  return {
    // Store state
    openedCards,
    isOpening,
    
    // Pack data
    featuredPack: getFeaturedPack(),
    availablePacks: getAvailablePacks(),
    potentialHits: getPotentialHits(),
    
    // Layout logic
    shouldShowLeftColumn: shouldShowLeftColumn(),
    centerColumnClass: getCenterColumnClass(),
    
    // Event handlers
    handleBuyPack,
    handlePackOpeningComplete,
    handleSkipToRares,
  };
};

// Static data helpers
export const getLeftColumnData = () => {
  return {
    hotBuybackCard: {
      title: "We're paying $100 for Sephiroth today!",
      badgeText: "HOT BUYBACK CARD"
    },
    recentBigPulls: [
      {
        id: 1,
        name: "1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)",
        packType: "Baseball Starter Pack",
        timeAgo: "3 seconds ago"
      },
      {
        id: 2,
        name: "1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)",
        packType: "Baseball Starter Pack",
        timeAgo: "3 seconds ago"
      },
      {
        id: 3,
        name: "1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)",
        packType: "Baseball Starter Pack",
        timeAgo: "3 seconds ago"
      }
    ],
    topBuybacks: [
      { name: "Sephiroth", price: 100, multiplier: "10x" },
      { name: "Cloud Strife", price: 80, multiplier: "8x" },
      { name: "Rare Summon", price: 60, multiplier: "6x" },
      { name: "Chocobo", price: 40, multiplier: "4x" },
      { name: "Materia", price: 25, multiplier: "2.5x" }
    ]
  };
};

export const getWhyChooseUsData = () => {
  return [
    {
      icon: "Shield",
      title: "Secure Payments",
      description: "All transactions are processed through PayPal, ensuring your payments are safe, encrypted, and protected by industry standard security."
    },
    {
      icon: "Zap",
      title: "Instant Buyback",
      description: "Sell your cards back to the platform instantly and receive credit added to your account balance right away — no delays, no waiting."
    },
    {
      icon: "Package",
      title: "Ship Your Cards",
      description: "Prefer to keep your rare pulls? Request physical shipping and get your cards securely delivered to your doorstep."
    }
  ];
};