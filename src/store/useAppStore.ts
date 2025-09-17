import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PaymentMethod,
  TransactionType,
  TransactionStatus 
} from '../types';
import type { 
  Card, 
  Transaction, 
  ShippingAddress,
  LoadingState,
  Notification,
  PurchaseResponse,
  ShipResponse,
  PaymentResponse,
  LoginCredentials,
  AppStoreState,
  AppStoreActions
} from '../types';
import { apiService } from '../services/apiService';

interface AppStore extends AppStoreState, AppStoreActions {}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      userCards: [],
      availablePacks: [],
      topCards: [],
      isLoading: 'idle',
      error: null,
      notifications: [],
      selectedCards: [],
      recentTransactions: [],
      recentPurchases: [],

      // Authentication actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: 'loading', error: null });
        try {
          const user = await apiService.login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: 'success' 
          });
          // Fetch user data after login
          get().fetchUserCards();
          get().fetchRecentTransactions();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          userCards: [],
          selectedCards: [],
          recentTransactions: [],
          recentPurchases: [],
        });
      },

      // Data fetching actions
      fetchAvailablePacks: async () => {
        set({ isLoading: 'loading' });
        try {
          const packs = await apiService.getProducts();
          set({ 
            availablePacks: packs, 
            isLoading: 'success' 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch packs';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
        }
      },

      fetchUserCards: async () => {
        if (!get().isAuthenticated) return;
        
        try {
          const cards = await apiService.getUserCards();
          // Filter out expired cards and mark expiry status
          const now = new Date();
          const updatedCards = cards.map(card => ({
            ...card,
            expiryDate: new Date(card.expiryDate),
            isExpired: new Date(card.expiryDate) < now
          }));
          
          set({ userCards: updatedCards });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user cards';
          set({ error: errorMessage });
        }
      },

      fetchTopCards: async () => {
        try {
          const topCards = await apiService.getTopCards();
          set({ topCards });
        } catch (error) {
          console.error('Failed to fetch top cards:', error);
          // Don't set error for top cards as it's not critical
        }
      },

      fetchRecentTransactions: async () => {
        if (!get().isAuthenticated) return;
        
        try {
          const transactions = await apiService.getTransactionHistory();
          set({ recentTransactions: transactions.slice(0, 10) }); // Keep only 10 most recent
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        }
      },

      // Pack operations
      purchasePack: async (packId: string, paymentMethod: PaymentMethod): Promise<PurchaseResponse> => {
        const { user, availablePacks } = get();
        if (!user) throw new Error('User not authenticated');
        
        const pack = availablePacks.find(p => p.id === packId);
        if (!pack) throw new Error('Pack not found');
        
        if (paymentMethod === 'credits' && user.credits < pack.price) {
          throw new Error('Insufficient credits');
        }

        set({ isLoading: 'loading' });
        
        try {
          const response = await apiService.purchasePack(packId, paymentMethod);
          
          // Update user credits if paid with credits
          if (paymentMethod === 'credits') {
            set(state => ({
              user: state.user ? {
                ...state.user,
                credits: state.user.credits - pack.price
              } : null
            }));
          }
          
          // Add to recent purchases
          set(state => ({
            recentPurchases: [pack, ...state.recentPurchases.slice(0, 4)],
            recentTransactions: [response.transaction, ...state.recentTransactions.slice(0, 9)],
            isLoading: 'success'
          }));

          // Show success notification
          get().addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Pack Purchased!',
            message: `Successfully purchased ${pack.name}`,
            timestamp: new Date()
          });

          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
          throw error;
        }
      },

      openPack: async (packId: string): Promise<Card[]> => {
        try {
          const response = await apiService.openPack(packId);
          
          // Add revealed cards to user collection
          const newCards = response.cards.map(card => ({
            ...card,
            expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            isExpired: false
          }));
          
          set(state => ({
            userCards: [...newCards, ...state.userCards]
          }));

          return newCards;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to open pack';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Card selection and management
      selectCard: (cardId: string) => {
        set(state => ({
          selectedCards: state.selectedCards.includes(cardId) 
            ? state.selectedCards 
            : [...state.selectedCards, cardId]
        }));
      },

      unselectCard: (cardId: string) => {
        set(state => ({
          selectedCards: state.selectedCards.filter(id => id !== cardId)
        }));
      },

      clearSelection: () => {
        set({ selectedCards: [] });
      },

      shipCards: async (cardIds: string[], address: ShippingAddress): Promise<ShipResponse> => {
        if (!get().isAuthenticated) throw new Error('User not authenticated');
        
        set({ isLoading: 'loading' });
        
        try {
          const response = await apiService.shipCards(cardIds, address);
          
          // Remove shipped cards from user collection
          set(state => ({
            userCards: state.userCards.filter(card => !cardIds.includes(card.id)),
            selectedCards: [],
            isLoading: 'success'
          }));

          // Add shipping transaction
          const transaction: Transaction = {
            id: Date.now().toString(),
            type: TransactionType.SHIPPING,
            amount: response.shippingCost,
            date: new Date(),
            status: TransactionStatus.COMPLETED,
            description: `Shipped ${cardIds.length} cards`,
            details: {
              trackingNumber: response.trackingNumber,
              cardCount: cardIds.length,
              address
            }
          };

          set(state => ({
            recentTransactions: [transaction, ...state.recentTransactions.slice(0, 9)]
          }));

          get().addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Cards Shipped!',
            message: `Tracking: ${response.trackingNumber}`,
            timestamp: new Date()
          });

          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Shipping failed';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
          throw error;
        }
      },

      // Credit and payment operations
      addCredits: async (amount: number) => {
        if (!get().isAuthenticated) throw new Error('User not authenticated');
        
        set({ isLoading: 'loading' });
        
        try {
          const response = await apiService.addCredits(amount);
          
          set(state => ({
            user: state.user ? {
              ...state.user,
              credits: response.newBalance
            } : null,
            isLoading: 'success'
          }));

          // Add credit transaction
          set(state => ({
            recentTransactions: [response.transaction, ...state.recentTransactions.slice(0, 9)]
          }));

          get().addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Credits Added!',
            message: `Added ${amount} credits to your account`,
            timestamp: new Date()
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add credits';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
          throw error;
        }
      },

      processPayPalPayment: async (amount: number): Promise<PaymentResponse> => {
        set({ isLoading: 'loading' });
        
        try {
          const response = await apiService.processPayPalPayment(amount);
          set({ isLoading: 'success' });
          
          if (response.success) {
            // Convert PayPal payment to credits (1:1 ratio)
            await get().addCredits(amount);
          }
          
          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'PayPal payment failed';
          set({ 
            error: errorMessage, 
            isLoading: 'error' 
          });
          throw error;
        }
      },

      // UI state management
      setLoading: (state: LoadingState) => {
        set({ isLoading: state });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      addNotification: (notification: Notification) => {
        set(state => ({
          notifications: [...state.notifications, notification]
        }));

        // Auto-remove notification after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, duration);
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
    }),
    {
      name: 'hobby-hunter-store',
    }
  )
);