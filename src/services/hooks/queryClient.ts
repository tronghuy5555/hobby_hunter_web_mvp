/**
 * React Query Configuration
 * 
 * Centralized React Query setup with custom defaults optimized for the card collecting domain.
 * Includes error handling, caching strategies, and mutation patterns.
 */

import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import type { ApiClientError } from '../api/types';

/**
 * Default React Query configuration optimized for card collecting application
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: How long data stays in cache when unused (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry configuration
      retry: (failureCount: number, error: unknown) => {
        const apiError = error as ApiClientError;
        
        // Don't retry auth errors or validation errors
        if (apiError?.type === 'auth_error' || apiError?.type === 'validation_error') {
          return false;
        }
        
        // Retry up to 3 times for retryable errors
        return failureCount < 3 && (apiError?.isRetryable ?? true);
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus for data freshness
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Background refetch for active queries
      refetchInterval: false, // Disabled by default, can be enabled per query
    },
    mutations: {
      // Retry failed mutations once
      retry: (failureCount: number, error: unknown) => {
        const apiError = error as ApiClientError;
        
        // Only retry network errors and server errors
        if (apiError?.type === 'network_error' || apiError?.type === 'server_error') {
          return failureCount < 1;
        }
        
        return false;
      },
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
};

/**
 * Create and configure the React Query client
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    ...queryClientConfig,
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error('Query error:', error, 'Query:', query.queryKey);
        handleQueryError(error as ApiClientError, query.queryKey);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.error('Mutation error:', error, 'Variables:', variables);
        handleMutationError(error as ApiClientError, mutation.options);
      },
    }),
  });
}

/**
 * Handle query errors globally
 */
function handleQueryError(error: ApiClientError, queryKey: unknown[]): void {
  // Handle authentication errors
  if (error.type === 'auth_error') {
    // Redirect to login or refresh token
    handleAuthError();
    return;
  }

  // Handle rate limiting
  if (error.type === 'rate_limit_error') {
    // Show rate limit notification
    console.warn('Rate limit exceeded for query:', queryKey);
    return;
  }

  // Handle network errors
  if (error.type === 'network_error') {
    // Show network error notification
    console.warn('Network error for query:', queryKey);
    return;
  }

  // Log other errors for debugging
  console.error('Unhandled query error:', error, queryKey);
}

/**
 * Handle mutation errors globally
 */
function handleMutationError(error: ApiClientError, mutationOptions: any): void {
  // Handle authentication errors
  if (error.type === 'auth_error') {
    handleAuthError();
    return;
  }

  // Handle validation errors (usually handled at component level)
  if (error.type === 'validation_error') {
    console.warn('Validation error in mutation:', error.message);
    return;
  }

  // Handle business logic errors
  if (error.type === 'permission_error') {
    console.warn('Permission denied for mutation');
    return;
  }

  // Log other errors
  console.error('Unhandled mutation error:', error, mutationOptions);
}

/**
 * Handle authentication errors
 */
function handleAuthError(): void {
  // This would integrate with your auth system
  // For now, just log and potentially redirect
  console.warn('Authentication error - user may need to log in again');
  
  // Example: Clear auth state and redirect
  // store.getState().logout();
  // window.location.href = '/auth';
}

/**
 * Query key factories for consistent cache management
 */
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    profile: (userId: string) => ['users', 'profile', userId] as const,
    cards: (userId: string, filters?: any) => ['users', userId, 'cards', filters] as const,
    transactions: (userId: string, filters?: any) => ['users', userId, 'transactions', filters] as const,
    credits: (userId: string) => ['users', userId, 'credits'] as const,
  },
  
  // Card queries
  cards: {
    all: ['cards'] as const,
    lists: () => ['cards', 'list'] as const,
    list: (filters?: any) => ['cards', 'list', filters] as const,
    details: (cardId: string) => ['cards', 'details', cardId] as const,
    market: (cardId: string) => ['cards', 'market', cardId] as const,
    history: (cardId: string) => ['cards', 'history', cardId] as const,
    expiring: (userId: string) => ['cards', 'expiring', userId] as const,
  },
  
  // Pack queries
  packs: {
    all: ['packs'] as const,
    lists: () => ['packs', 'list'] as const,
    list: (filters?: any) => ['packs', 'list', filters] as const,
    details: (packId: string) => ['packs', 'details', packId] as const,
    history: (userId: string) => ['packs', 'history', userId] as const,
    recommendations: (userId: string) => ['packs', 'recommendations', userId] as const,
    statistics: (packId: string) => ['packs', 'statistics', packId] as const,
  },
  
  // Transaction queries
  transactions: {
    all: ['transactions'] as const,
    lists: () => ['transactions', 'list'] as const,
    list: (userId: string, filters?: any) => ['transactions', 'list', userId, filters] as const,
    details: (transactionId: string) => ['transactions', 'details', transactionId] as const,
    paymentMethods: (userId: string) => ['transactions', 'paymentMethods', userId] as const,
  },
} as const;

/**
 * Cache invalidation helpers
 */
export const invalidateQueries = {
  /**
   * Invalidate all user-related queries
   */
  user: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.cards(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.transactions(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.credits(userId) });
  },
  
  /**
   * Invalidate card-related queries
   */
  cards: (queryClient: QueryClient, userId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cards(userId) });
    }
  },
  
  /**
   * Invalidate pack-related queries
   */
  packs: (queryClient: QueryClient, userId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.packs.all });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.history(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.recommendations(userId) });
    }
  },
  
  /**
   * Invalidate transaction-related queries
   */
  transactions: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.transactions(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.credits(userId) });
  },
};

/**
 * Optimistic update helpers
 */
export const optimisticUpdates = {
  /**
   * Optimistically update user credits
   */
  updateCredits: (queryClient: QueryClient, userId: string, creditChange: number) => {
    const queryKey = queryKeys.users.credits(userId);
    
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.data) return oldData;
      
      return {
        ...oldData,
        data: {
          ...oldData.data,
          credits: oldData.data.credits + creditChange,
        },
      };
    });
  },
  
  /**
   * Optimistically add cards to user collection
   */
  addCards: (queryClient: QueryClient, userId: string, newCards: any[]) => {
    const queryKey = queryKeys.users.cards(userId);
    
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.data) return oldData;
      
      return {
        ...oldData,
        data: [...oldData.data, ...newCards],
      };
    });
  },
  
  /**
   * Optimistically remove cards from user collection
   */
  removeCards: (queryClient: QueryClient, userId: string, cardIds: string[]) => {
    const queryKey = queryKeys.users.cards(userId);
    
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.data) return oldData;
      
      return {
        ...oldData,
        data: oldData.data.filter((card: any) => !cardIds.includes(card.id)),
      };
    });
  },
};

/**
 * Background refresh configuration for specific data types
 */
export const backgroundRefresh = {
  // Refresh user credits every 30 seconds if tab is active
  userCredits: 30 * 1000,
  
  // Refresh pack availability every 2 minutes
  packCatalog: 2 * 60 * 1000,
  
  // Refresh market data every 5 minutes
  marketData: 5 * 60 * 1000,
  
  // Refresh transaction status every 10 seconds for pending transactions
  pendingTransactions: 10 * 1000,
};