import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/services';

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

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPack: Pack | null;
  openedCards: Card[];
  isOpening: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
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
  {
    id: '2',
    name: 'Pokemon (Battle Styles)',
    description: 'Each pack contains 11 cards',
    price: 4,
    image: 'pack-pokemon-battle.jpg',
    cardCount: 11,
    guaranteed: '1 rare or better',
  },
  {
    id: '3',
    name: 'Yu-Gi-Oh! (Legendary Duelists)',
    description: 'Each pack contains 5 cards',
    price: 8,
    image: 'pack-yugioh-legendary.jpg',
    cardCount: 5,
    guaranteed: '1 super rare or better',
  },
  {
    id: '4',
    name: 'Magic: The Gathering (Dominaria)',
    description: 'Each pack contains 15 cards',
    price: 15,
    image: 'pack-mtg-dominaria.jpg',
    cardCount: 15,
    guaranteed: '1 rare or mythic rare',
  },
  {
    id: '5',
    name: 'Dragon Ball Super (Series 1)',
    description: 'Each pack contains 12 cards',
    price: 6,
    image: 'pack-dbs-series1.jpg',
    cardCount: 12,
    guaranteed: '1 rare or better',
  },
  {
    id: '6',
    name: 'One Piece (Romance Dawn)',
    description: 'Each pack contains 12 cards',
    price: 7,
    image: 'pack-onepiece-romance.jpg',
    cardCount: 12,
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
  }
];

export const useAppStore = create<AppState>()((
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      currentPack: null,
      openedCards: [],
      isOpening: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        currentPack: null,
        openedCards: [],
        isOpening: false 
      }),
      
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
    }),
    {
      name: 'hobby-hunter-storage', // name of the localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist temporary states like currentPack, openedCards, isOpening
      }),
    }
  )
));