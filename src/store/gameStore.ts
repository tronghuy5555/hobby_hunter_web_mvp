import { create } from 'zustand';

export interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic' | 'legendary';
  price: number;
  finish: 'normal' | 'foil' | 'reverse_foil' | 'holographic';
  image: string;
  set: string;
  openedAt?: Date;
  expiresAt?: Date;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  averageValue: number;
  topCards: Card[];
}

interface GameState {
  // User data
  credits: number;
  ownedCards: Card[];
  
  // Available products
  featuredPacks: Pack[];
  currentPack: Pack | null;
  
  // Pack opening state
  isOpeningPack: boolean;
  revealedCards: Card[];
  currentCardIndex: number;
  
  // Actions
  setCredits: (credits: number) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  setFeaturedPacks: (packs: Pack[]) => void;
  setCurrentPack: (pack: Pack | null) => void;
  startPackOpening: (cards: Card[]) => void;
  revealNextCard: () => void;
  finishPackOpening: () => void;
  resetPackOpening: () => void;
  convertExpiredCards: () => void;
}

// Sample data
const sampleCards: Card[] = [
  {
    id: '1',
    name: 'Lightning Drake',
    rarity: 'mythic',
    price: 45.99,
    finish: 'holographic',
    image: '/src/assets/sample-card.jpg',
    set: 'Mystic Realms',
  },
  {
    id: '2',
    name: 'Forest Guardian',
    rarity: 'rare',
    price: 12.50,
    finish: 'foil',
    image: '/src/assets/sample-card.jpg',
    set: 'Mystic Realms',
  },
  {
    id: '3',
    name: 'Arcane Scholar',
    rarity: 'uncommon',
    price: 3.25,
    finish: 'normal',
    image: '/src/assets/sample-card.jpg',
    set: 'Mystic Realms',
  },
];

const samplePacks: Pack[] = [
  {
    id: 'mystic-realms-booster',
    name: 'Mystic Realms Booster Pack',
    price: 4.99,
    image: '/src/assets/hero-pack.jpg',
    description: 'Contains 15 cards with guaranteed rare or better',
    averageValue: 6.75,
    topCards: sampleCards,
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  credits: 25.50,
  ownedCards: [],
  featuredPacks: samplePacks,
  currentPack: null,
  isOpeningPack: false,
  revealedCards: [],
  currentCardIndex: 0,

  // Actions
  setCredits: (credits) => set({ credits }),
  
  addCard: (card) => set((state) => ({
    ownedCards: [...state.ownedCards, {
      ...card,
      openedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }],
  })),
  
  removeCard: (cardId) => set((state) => ({
    ownedCards: state.ownedCards.filter(card => card.id !== cardId),
  })),
  
  setFeaturedPacks: (packs) => set({ featuredPacks: packs }),
  
  setCurrentPack: (pack) => set({ currentPack: pack }),
  
  startPackOpening: (cards) => set({
    isOpeningPack: true,
    revealedCards: cards.sort((a, b) => {
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4, legendary: 5 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }),
    currentCardIndex: 0,
  }),
  
  revealNextCard: () => set((state) => ({
    currentCardIndex: Math.min(state.currentCardIndex + 1, state.revealedCards.length - 1),
  })),
  
  finishPackOpening: () => {
    const state = get();
    state.revealedCards.forEach(card => state.addCard(card));
    set({
      isOpeningPack: false,
      revealedCards: [],
      currentCardIndex: 0,
      currentPack: null,
    });
  },
  
  resetPackOpening: () => set({
    isOpeningPack: false,
    revealedCards: [],
    currentCardIndex: 0,
    currentPack: null,
  }),
  
  convertExpiredCards: () => set((state) => {
    const now = new Date();
    const expiredCards = state.ownedCards.filter(card => 
      card.expiresAt && card.expiresAt < now
    );
    const creditValue = expiredCards.reduce((sum, card) => sum + (card.price * 0.5), 0);
    
    return {
      ownedCards: state.ownedCards.filter(card => 
        !card.expiresAt || card.expiresAt >= now
      ),
      credits: state.credits + creditValue,
    };
  }),
}));