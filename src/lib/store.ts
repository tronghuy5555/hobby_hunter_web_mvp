import { create } from 'zustand';

export interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  image: string;
  finish?: 'normal' | 'foil' | 'reverse-foil';
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cardCount: number;
  guaranteed?: string;
}

export interface User {
  id: string;
  email: string;
  credits: number;
  cards: Card[];
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPack: Pack | null;
  openedCards: Card[];
  isOpening: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentPack: (pack: Pack) => void;
  openPack: (cards: Card[]) => void;
  setIsOpening: (opening: boolean) => void;
  addCardsToCollection: (cards: Card[]) => void;
  clearOpenedCards: () => void;
}

// Mock data
export const mockPacks: Pack[] = [
  {
    id: '1',
    name: 'Final Fantasy (Magic: The Gathering)',
    description: 'Each pack contains 15 cards',
    price: 25,
    image: 'pack-ff-gathering.jpg',
    cardCount: 15,
    guaranteed: '1 rare or better',
  },
];

export const mockTopCards: Card[] = [
  {
    id: '1',
    name: 'Sephiroth',
    rarity: 'legendary',
    price: 100,
    image: 'card-sephiroth.jpg',
    finish: 'foil',
  },
  {
    id: '2',
    name: 'Cloud Strife',
    rarity: 'epic',
    price: 80,
    image: 'card-cloud.jpg',
    finish: 'reverse-foil',
  },
  {
    id: '3',
    name: 'Bahamut',
    rarity: 'legendary',
    price: 120,
    image: 'card-bahamut.jpg',
    finish: 'foil',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  currentPack: null,
  openedCards: [],
  isOpening: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setCurrentPack: (pack) => set({ currentPack: pack }),
  
  openPack: (cards) => set({ openedCards: cards, isOpening: false }),
  
  setIsOpening: (opening) => set({ isOpening: opening }),
  
  addCardsToCollection: (cards) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          cards: [...user.cards, ...cards],
        },
      });
    }
  },
  
  clearOpenedCards: () => set({ openedCards: [] }),
}));