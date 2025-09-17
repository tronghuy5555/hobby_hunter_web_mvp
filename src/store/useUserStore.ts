import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserPreferences, ShippingAddress, CardSortOption } from '../types';

interface UserStore {
  // User preferences
  preferences: UserPreferences;
  
  // Shipping addresses
  shippingAddresses: ShippingAddress[];
  defaultShippingAddress: string | null;
  
  // UI preferences
  cardViewMode: 'grid' | 'list';
  cardsPerPage: number;
  defaultCardSort: CardSortOption;
  
  // Recent search/filter history
  recentSearches: string[];
  savedFilters: Array<{
    name: string;
    filter: any;
  }>;
  
  // Actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addShippingAddress: (address: ShippingAddress) => void;
  updateShippingAddress: (id: string, address: Partial<ShippingAddress>) => void;
  removeShippingAddress: (id: string) => void;
  setDefaultShippingAddress: (id: string) => void;
  setCardViewMode: (mode: 'grid' | 'list') => void;
  setCardsPerPage: (count: number) => void;
  setDefaultCardSort: (sort: CardSortOption) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  saveFilter: (name: string, filter: any) => void;
  removeSavedFilter: (name: string) => void;
  resetToDefaults: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  autoSkipCommons: false,
  enableNotifications: true,
  defaultSortBy: 'newest'
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Initial state
      preferences: defaultPreferences,
      shippingAddresses: [],
      defaultShippingAddress: null,
      cardViewMode: 'grid',
      cardsPerPage: 12,
      defaultCardSort: 'newest',
      recentSearches: [],
      savedFilters: [],

      // Preference actions
      updatePreferences: (newPreferences: Partial<UserPreferences>) => {
        set(state => ({
          preferences: {
            ...state.preferences,
            ...newPreferences
          }
        }));
      },

      // Shipping address management
      addShippingAddress: (address: ShippingAddress) => {
        const newAddress = {
          ...address,
          id: address.id || Date.now().toString()
        };
        
        set(state => {
          const addresses = [...state.shippingAddresses, newAddress];
          return {
            shippingAddresses: addresses,
            // Set as default if it's the first address or marked as default
            defaultShippingAddress: addresses.length === 1 || address.isDefault 
              ? newAddress.id! 
              : state.defaultShippingAddress
          };
        });
      },

      updateShippingAddress: (id: string, addressUpdate: Partial<ShippingAddress>) => {
        set(state => ({
          shippingAddresses: state.shippingAddresses.map(addr =>
            addr.id === id ? { ...addr, ...addressUpdate } : addr
          )
        }));
      },

      removeShippingAddress: (id: string) => {
        set(state => {
          const newAddresses = state.shippingAddresses.filter(addr => addr.id !== id);
          return {
            shippingAddresses: newAddresses,
            // Clear default if it was the removed address
            defaultShippingAddress: state.defaultShippingAddress === id 
              ? (newAddresses.length > 0 ? newAddresses[0].id! : null)
              : state.defaultShippingAddress
          };
        });
      },

      setDefaultShippingAddress: (id: string) => {
        set({ defaultShippingAddress: id });
      },

      // UI preference actions
      setCardViewMode: (mode: 'grid' | 'list') => {
        set({ cardViewMode: mode });
      },

      setCardsPerPage: (count: number) => {
        // Validate count is reasonable
        const validCount = Math.max(6, Math.min(48, count));
        set({ cardsPerPage: validCount });
      },

      setDefaultCardSort: (sort: CardSortOption) => {
        set({ defaultCardSort: sort });
      },

      // Search and filter history
      addRecentSearch: (search: string) => {
        if (!search.trim()) return;
        
        set(state => {
          const filtered = state.recentSearches.filter(s => s !== search);
          return {
            recentSearches: [search, ...filtered].slice(0, 10) // Keep only 10 recent searches
          };
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      saveFilter: (name: string, filter: any) => {
        set(state => {
          const existing = state.savedFilters.filter(f => f.name !== name);
          return {
            savedFilters: [...existing, { name, filter }].slice(0, 5) // Keep only 5 saved filters
          };
        });
      },

      removeSavedFilter: (name: string) => {
        set(state => ({
          savedFilters: state.savedFilters.filter(f => f.name !== name)
        }));
      },

      // Reset all user preferences
      resetToDefaults: () => {
        set({
          preferences: defaultPreferences,
          cardViewMode: 'grid',
          cardsPerPage: 12,
          defaultCardSort: 'newest',
          recentSearches: [],
          savedFilters: []
          // Keep shipping addresses as they contain real user data
        });
      }
    }),
    {
      name: 'hobby-hunter-user-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        shippingAddresses: state.shippingAddresses,
        defaultShippingAddress: state.defaultShippingAddress,
        cardViewMode: state.cardViewMode,
        cardsPerPage: state.cardsPerPage,
        defaultCardSort: state.defaultCardSort,
        recentSearches: state.recentSearches,
        savedFilters: state.savedFilters
      })
    }
  )
);