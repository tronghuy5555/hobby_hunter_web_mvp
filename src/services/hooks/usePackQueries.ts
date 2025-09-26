/**
 * Pack Query Hooks
 * 
 * React Query hooks for pack-related operations including catalog browsing,
 * pack purchasing, opening mechanics, and pack history management.
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { packRepository } from '../repositories/PackRepository';
import { queryKeys, invalidateQueries, optimisticUpdates, backgroundRefresh } from './queryClient';
import type {
  Pack,
  PackPurchaseRequest,
  PackOpenRequest,
  PackOpeningResult,
  PackRecommendation,
} from '../types/domain';
import type { ApiResponse, PaginatedResponse } from '../api/types';

// ==================== Pack Catalog Hooks ====================

/**
 * Query hook for available packs catalog
 */
export function useAvailablePacks(
  filters?: { category?: string; priceMin?: number; priceMax?: number },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.packs.list(filters),
    queryFn: () => packRepository.getAvailablePacks(filters),
    enabled,
    staleTime: backgroundRefresh.packCatalog, // 2 minutes
    refetchInterval: backgroundRefresh.packCatalog, // Background refresh
    select: (data: PaginatedResponse<Pack>) => data.data,
  });
}

/**
 * Infinite query hook for paginated pack catalog
 */
export function useInfiniteAvailablePacks(
  filters?: { category?: string; priceMin?: number; priceMax?: number },
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.packs.list(filters).concat(['infinite']),
    queryFn: ({ pageParam = 1 }) => packRepository.getAvailablePacks(filters),
    enabled,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: backgroundRefresh.packCatalog,
  });
}

/**
 * Query hook for detailed pack information
 */
export function usePackDetails(packId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.packs.details(packId),
    queryFn: () => packRepository.getPackDetails(packId),
    enabled: enabled && !!packId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<Pack & { statistics?: any }>) => data.data,
  });
}

/**
 * Query hook for pack statistics (odds, expected value)
 */
export function usePackStatistics(packId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.packs.statistics(packId),
    queryFn: () => packRepository.getPackStatistics(packId),
    enabled: enabled && !!packId,
    staleTime: 30 * 60 * 1000, // 30 minutes (statistics change rarely)
    select: (data: ApiResponse<any>) => data.data,
  });
}

/**
 * Query hook for trending packs
 */
export function useTrendingPacks(
  timeframe: '24h' | '7d' | '30d' = '24h',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['packs', 'trending', timeframe],
    queryFn: () => packRepository.getTrendingPacks(timeframe),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    select: (data: PaginatedResponse<Pack & { trendingScore: number }>) => data.data,
  });
}

// ==================== Pack Purchase Hooks ====================

/**
 * Mutation hook for purchasing packs
 */
export function usePurchasePack() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAppStore();

  return useMutation({
    mutationFn: (request: PackPurchaseRequest) => packRepository.purchasePack(request),
    onMutate: async (request) => {
      if (!user) return;

      // Calculate total cost
      const packDetails = queryClient.getQueryData(queryKeys.packs.details(request.packId)) as any;
      const packPrice = packDetails?.data?.price || 0;
      const totalCost = packPrice * request.quantity;

      // Optimistically update user credits
      optimisticUpdates.updateCredits(queryClient, user.id, -totalCost);
      setUser({ ...user, credits: user.credits - totalCost });

      return { previousCredits: user.credits, totalCost };
    },
    onError: (error, request, context) => {
      // Revert optimistic update on error
      if (context?.previousCredits !== undefined && user) {
        optimisticUpdates.updateCredits(queryClient, user.id, context.totalCost);
        setUser({ ...user, credits: context.previousCredits });
      }
      console.error('Pack purchase failed:', error);
    },
    onSuccess: (response, request) => {
      if (response.success && response.data && user) {
        const { creditsRemaining } = response.data;
        
        // Update user credits with server response
        setUser({ ...user, credits: creditsRemaining });
        
        // Invalidate pack catalog to reflect stock changes
        invalidateQueries.packs(queryClient, user.id);
        
        // Invalidate user's transaction history
        invalidateQueries.transactions(queryClient, user.id);
      }
    },
    onSettled: () => {
      if (user) {
        // Refresh user credits to ensure consistency
        queryClient.invalidateQueries({ queryKey: queryKeys.users.credits(user.id) });
      }
    },
  });
}

/**
 * Query hook for validating pack purchase
 */
export function useValidatePackPurchase(
  packId: string,
  userId: string,
  quantity: number = 1,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['packs', 'validate', packId, userId, quantity],
    queryFn: () => packRepository.validatePackPurchase(packId, userId, quantity),
    enabled: enabled && !!packId && !!userId && quantity > 0,
    staleTime: 30 * 1000, // 30 seconds (validation should be fresh)
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Pack Opening Hooks ====================

/**
 * Mutation hook for opening packs
 */
export function useOpenPack() {
  const queryClient = useQueryClient();
  const { user, addCardsToCollection } = useAppStore();

  return useMutation({
    mutationFn: (request: PackOpenRequest) => packRepository.openPack(request),
    onSuccess: (response) => {
      if (response.success && response.data && user) {
        const { cards } = response.data;
        
        // Add new cards to user's collection optimistically
        optimisticUpdates.addCards(queryClient, user.id, cards);
        addCardsToCollection(cards);
        
        // Invalidate user's card collection
        invalidateQueries.cards(queryClient, user.id);
        
        // Invalidate pack history
        invalidateQueries.packs(queryClient, user.id);
      }
    },
    onError: (error) => {
      console.error('Pack opening failed:', error);
    },
  });
}

/**
 * Query hook for pack opening session details
 */
export function usePackOpening(openingId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['packs', 'openings', openingId],
    queryFn: () => packRepository.getPackOpening(openingId),
    enabled: enabled && !!openingId,
    staleTime: 60 * 60 * 1000, // 1 hour (opening results don't change)
    select: (data: ApiResponse<PackOpeningResult>) => data.data,
  });
}

// ==================== Pack History Hooks ====================

/**
 * Query hook for user's pack purchase history
 */
export function usePackHistory(
  userId: string,
  filters?: { dateFrom?: string; dateTo?: string; packType?: string },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.packs.history(userId).concat([filters]),
    queryFn: () => packRepository.getPackHistory(userId, filters),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: PaginatedResponse<any>) => data.data,
  });
}

/**
 * Infinite query hook for paginated pack history
 */
export function useInfinitePackHistory(
  userId: string,
  filters?: { dateFrom?: string; dateTo?: string; packType?: string },
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.packs.history(userId).concat([filters, 'infinite']),
    queryFn: ({ pageParam = 1 }) => packRepository.getPackHistory(userId, filters),
    enabled: enabled && !!userId,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Pack Recommendations Hooks ====================

/**
 * Query hook for personalized pack recommendations
 */
export function usePackRecommendations(
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.packs.recommendations(userId),
    queryFn: () => packRepository.getPackRecommendations(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data: PaginatedResponse<PackRecommendation>) => data.data,
  });
}

// ==================== Pack Administration Hooks ====================

/**
 * Mutation hook for updating pack availability (admin)
 */
export function useUpdatePackAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packId, isAvailable, stock }: { 
      packId: string; 
      isAvailable: boolean; 
      stock?: number; 
    }) => packRepository.updatePackAvailability(packId, isAvailable, stock),
    onMutate: async ({ packId, isAvailable, stock }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.packs.details(packId) });

      // Snapshot previous value
      const previousPack = queryClient.getQueryData(queryKeys.packs.details(packId));

      // Optimistically update pack details
      queryClient.setQueryData(queryKeys.packs.details(packId), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { 
            ...old.data, 
            isAvailable, 
            stock: stock !== undefined ? stock : old.data.stock 
          },
        };
      });

      return { previousPack };
    },
    onError: (error, { packId }, context) => {
      // Revert optimistic update on error
      if (context?.previousPack) {
        queryClient.setQueryData(queryKeys.packs.details(packId), context.previousPack);
      }
      console.error('Pack availability update failed:', error);
    },
    onSuccess: () => {
      // Refresh pack catalog
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.lists() });
    },
    onSettled: ({ packId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.details(packId) });
    },
  });
}

// ==================== Utility Hooks ====================

/**
 * Hook for refreshing pack-related data
 */
export function useRefreshPacks() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return {
    refreshCatalog: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.lists() });
    },
    refreshPackDetails: (packId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packs.details(packId) });
    },
    refreshPackHistory: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.packs.history(user.id) });
      }
    },
    refreshRecommendations: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.packs.recommendations(user.id) });
      }
    },
    refreshAll: () => {
      if (user?.id) {
        invalidateQueries.packs(queryClient, user.id);
      }
    },
  };
}

/**
 * Hook for prefetching pack data
 */
export function usePrefetchPacks() {
  const queryClient = useQueryClient();

  return {
    prefetchPackDetails: (packId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.packs.details(packId),
        queryFn: () => packRepository.getPackDetails(packId),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchPackStatistics: (packId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.packs.statistics(packId),
        queryFn: () => packRepository.getPackStatistics(packId),
        staleTime: 30 * 60 * 1000,
      });
    },
    prefetchCatalog: (filters?: any) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.packs.list(filters),
        queryFn: () => packRepository.getAvailablePacks(filters),
        staleTime: backgroundRefresh.packCatalog,
      });
    },
  };
}

/**
 * Hook for pack opening state management
 */
export function usePackOpeningState() {
  const [isOpening, setIsOpening] = React.useState(false);
  const [openingResult, setOpeningResult] = React.useState<PackOpeningResult | null>(null);
  const [openingError, setOpeningError] = React.useState<Error | null>(null);

  const openPackMutation = useOpenPack();

  const openPack = React.useCallback(async (request: PackOpenRequest) => {
    setIsOpening(true);
    setOpeningError(null);
    setOpeningResult(null);

    try {
      const result = await openPackMutation.mutateAsync(request);
      if (result.success && result.data) {
        setOpeningResult(result.data);
      }
    } catch (error) {
      setOpeningError(error as Error);
    } finally {
      setIsOpening(false);
    }
  }, [openPackMutation]);

  const resetOpening = React.useCallback(() => {
    setIsOpening(false);
    setOpeningResult(null);
    setOpeningError(null);
  }, []);

  return {
    isOpening,
    openingResult,
    openingError,
    openPack,
    resetOpening,
  };
}

/**
 * Hook for pack purchase validation and flow
 */
export function usePackPurchaseFlow(packId: string) {
  const { user } = useAppStore();
  const [quantity, setQuantity] = React.useState(1);

  const {
    data: validationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidatePackPurchase(packId, user?.id || '', quantity, !!user?.id && !!packId);

  const purchaseMutation = usePurchasePack();

  const canPurchase = React.useMemo(() => {
    return validationData?.valid && 
           !purchaseMutation.isPending && 
           !isValidating;
  }, [validationData?.valid, purchaseMutation.isPending, isValidating]);

  const purchasePack = React.useCallback(async (paymentMethod?: string) => {
    if (!canPurchase || !packId || !user?.id) return;

    const request: PackPurchaseRequest = {
      packId,
      quantity,
      paymentMethod,
    };

    return purchaseMutation.mutateAsync(request);
  }, [canPurchase, packId, user?.id, quantity, purchaseMutation]);

  return {
    quantity,
    setQuantity,
    validationData,
    isValidating,
    validationError,
    canPurchase,
    purchasePack,
    isPurchasing: purchaseMutation.isPending,
    purchaseError: purchaseMutation.error,
  };
}