/**
 * Card Query Hooks
 * 
 * React Query hooks for card-related operations including collection management,
 * card details, market data, shipping, and marketplace operations.
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { cardRepository } from '../repositories/CardRepository';
import { queryKeys, invalidateQueries, optimisticUpdates, backgroundRefresh } from './queryClient';
import type {
  Card,
  CardFilters,
  ShipCardsRequest,
  SellCardRequest,
  ConvertCardsRequest,
  MarketData,
} from '../types/domain';
import type { ApiResponse, PaginatedResponse } from '../api/types';

// ==================== Collection Management Hooks ====================

/**
 * Query hook for user's card collection
 */
export function useUserCards(
  userId: string,
  filters?: CardFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.cards.list(filters),
    queryFn: () => cardRepository.getUserCards(userId, filters),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data: PaginatedResponse<Card>) => data.data,
  });
}

/**
 * Infinite query hook for paginated card collection
 */
export function useInfiniteUserCards(
  userId: string,
  filters?: CardFilters,
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.cards.list(filters).concat(['infinite']),
    queryFn: ({ pageParam = 1 }) => 
      cardRepository.getUserCards(userId, { ...filters }),
    enabled: enabled && !!userId,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Query hook for detailed card information
 */
export function useCardDetails(cardId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.cards.details(cardId),
    queryFn: () => cardRepository.getCardDetails(cardId),
    enabled: enabled && !!cardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<Card & { marketData?: MarketData }>) => data.data,
  });
}

/**
 * Query hook for card market data with background refresh
 */
export function useCardMarketData(cardId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.cards.market(cardId),
    queryFn: () => cardRepository.getCardMarketValue(cardId),
    enabled: enabled && !!cardId,
    staleTime: 30 * 1000, // 30 seconds for market data
    refetchInterval: backgroundRefresh.marketData, // Background refresh every 5 minutes
    select: (data: ApiResponse<MarketData>) => data.data,
  });
}

/**
 * Query hook for cards nearing expiration
 */
export function useExpiringCards(
  userId: string,
  daysThreshold: number = 30,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.cards.expiring(userId).concat([daysThreshold.toString()]),
    queryFn: () => cardRepository.getExpiringCards(userId, daysThreshold),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: PaginatedResponse<Card>) => data.data,
  });
}

/**
 * Query hook for card search
 */
export function useSearchCards(
  criteria: CardFilters & { query?: string },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.cards.all.concat(['search', criteria]),
    queryFn: () => cardRepository.searchCards(criteria),
    enabled: enabled && (!!criteria.query || Object.keys(criteria).length > 1),
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    select: (data: PaginatedResponse<Card>) => data.data,
  });
}

/**
 * Query hook for card history
 */
export function useCardHistory(cardId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.cards.history(cardId),
    queryFn: () => cardRepository.getCardHistory(cardId),
    enabled: enabled && !!cardId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    select: (data: PaginatedResponse<any>) => data.data,
  });
}

// ==================== Collection Modification Hooks ====================

/**
 * Mutation hook for updating card status
 */
export function useUpdateCardStatus() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: ({ cardId, status }: { cardId: string; status: Card['status'] }) =>
      cardRepository.updateCardStatus(cardId, status),
    onMutate: async ({ cardId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cards.details(cardId) });

      // Snapshot previous value
      const previousCard = queryClient.getQueryData(queryKeys.cards.details(cardId));

      // Optimistically update card details
      queryClient.setQueryData(queryKeys.cards.details(cardId), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, status },
        };
      });

      return { previousCard };
    },
    onError: (error, { cardId }, context) => {
      // Revert optimistic update on error
      if (context?.previousCard) {
        queryClient.setQueryData(queryKeys.cards.details(cardId), context.previousCard);
      }
      console.error('Card status update failed:', error);
    },
    onSuccess: (response, { cardId }) => {
      if (response.success && user?.id) {
        // Invalidate user's card collection to reflect status change
        invalidateQueries.cards(queryClient, user.id);
      }
    },
    onSettled: ({ cardId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.details(cardId) });
    },
  });
}

/**
 * Mutation hook for converting expired cards to credits
 */
export function useConvertCardsToCredits() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAppStore();

  return useMutation({
    mutationFn: (request: ConvertCardsRequest) => cardRepository.convertCardsToCredits(request),
    onMutate: async ({ cardIds }) => {
      if (user?.id) {
        // Optimistically remove cards from collection
        optimisticUpdates.removeCards(queryClient, user.id, cardIds);
      }
      return { removedCardIds: cardIds };
    },
    onError: (error, { cardIds }, context) => {
      console.error('Card conversion failed:', error);
      // Note: We don't try to revert the optimistic update here as it's complex
      // Instead, we rely on the onSettled refetch
    },
    onSuccess: (response, { cardIds }) => {
      if (response.success && response.data && user?.id) {
        const { creditsEarned } = response.data;
        
        // Update user credits optimistically
        optimisticUpdates.updateCredits(queryClient, user.id, creditsEarned);
        setUser({ ...user, credits: user.credits + creditsEarned });
      }
    },
    onSettled: () => {
      if (user?.id) {
        // Refresh all user-related data
        invalidateQueries.user(queryClient, user.id);
        invalidateQueries.cards(queryClient, user.id);
      }
    },
  });
}

// ==================== Shipping Hooks ====================

/**
 * Mutation hook for shipping cards
 */
export function useShipCards() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (request: ShipCardsRequest) => cardRepository.shipCards(request),
    onMutate: async ({ cardIds }) => {
      // Optimistically update card statuses to 'shipped'
      cardIds.forEach(cardId => {
        queryClient.setQueryData(queryKeys.cards.details(cardId), (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, status: 'shipped' as const },
          };
        });
      });

      return { shippedCardIds: cardIds };
    },
    onError: (error, { cardIds }, context) => {
      // Revert optimistic updates on error
      cardIds.forEach(cardId => {
        queryClient.setQueryData(queryKeys.cards.details(cardId), (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, status: 'active' as const },
          };
        });
      });
      console.error('Card shipping failed:', error);
    },
    onSuccess: (response) => {
      if (response.success && user?.id) {
        invalidateQueries.cards(queryClient, user.id);
      }
    },
    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cards.list() });
      }
    },
  });
}

/**
 * Query hook for shipping status
 */
export function useShippingStatus(shipmentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['shipping', 'status', shipmentId],
    queryFn: () => cardRepository.getShippingStatus(shipmentId),
    enabled: enabled && !!shipmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: (data) => {
      // Refresh more frequently for pending shipments
      const status = data?.data?.status;
      if (status === 'pending' || status === 'processing' || status === 'in_transit') {
        return 2 * 60 * 1000; // 2 minutes
      }
      return false; // Don't refetch for completed shipments
    },
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Marketplace Hooks ====================

/**
 * Mutation hook for selling a card
 */
export function useSellCard() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (request: SellCardRequest) => cardRepository.sellCard(request),
    onSuccess: (response, { cardId }) => {
      if (response.success && user?.id) {
        // Invalidate card details and user collection
        queryClient.invalidateQueries({ queryKey: queryKeys.cards.details(cardId) });
        invalidateQueries.cards(queryClient, user.id);
      }
    },
    onError: (error) => {
      console.error('Card sale failed:', error);
    },
  });
}

// ==================== Analytics and Discovery Hooks ====================

/**
 * Query hook for top/trending cards
 */
export function useTopCards(
  category?: string,
  timeframe: string = '24h',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['cards', 'trending', category, timeframe],
    queryFn: () => cardRepository.getTopCards(category, timeframe),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: PaginatedResponse<Card>) => data.data,
  });
}

/**
 * Query hook for card recommendations
 */
export function useCardRecommendations(
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['cards', 'recommendations', userId],
    queryFn: () => cardRepository.getCardRecommendations(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data: PaginatedResponse<Card>) => data.data,
  });
}

// ==================== Utility Hooks ====================

/**
 * Hook for refreshing card-related data
 */
export function useRefreshCards() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return {
    refreshUserCards: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cards.list() });
      }
    },
    refreshCardDetails: (cardId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.details(cardId) });
    },
    refreshMarketData: (cardId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.market(cardId) });
    },
    refreshExpiringCards: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cards.expiring(user.id) });
      }
    },
    refreshAll: () => {
      if (user?.id) {
        invalidateQueries.cards(queryClient, user.id);
      }
    },
  };
}

/**
 * Hook for prefetching card data
 */
export function usePrefetchCards() {
  const queryClient = useQueryClient();

  return {
    prefetchCardDetails: (cardId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.cards.details(cardId),
        queryFn: () => cardRepository.getCardDetails(cardId),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchMarketData: (cardId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.cards.market(cardId),
        queryFn: () => cardRepository.getCardMarketValue(cardId),
        staleTime: backgroundRefresh.marketData,
      });
    },
    prefetchUserCards: (userId: string, filters?: CardFilters) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.cards.list(filters),
        queryFn: () => cardRepository.getUserCards(userId, filters),
      });
    },
  };
}

/**
 * Hook for card collection statistics
 */
export function useCardCollectionStats(userId: string, enabled: boolean = true) {
  const { data: cards, isLoading } = useUserCards(userId, undefined, enabled);

  const stats = React.useMemo(() => {
    if (!cards) return null;

    const totalCards = cards.length;
    const totalValue = cards.reduce((sum, card) => sum + (card.marketValue || card.price), 0);
    const rarityBreakdown = cards.reduce((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      return acc;
    }, {} as Record<Card['rarity'], number>);

    return {
      totalCards,
      totalValue,
      rarityBreakdown,
      averageValue: totalCards > 0 ? totalValue / totalCards : 0,
      topCards: cards
        .sort((a, b) => (b.marketValue || b.price) - (a.marketValue || a.price))
        .slice(0, 5),
    };
  }, [cards]);

  return {
    stats,
    isLoading,
  };
}