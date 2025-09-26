/**
 * Transaction Query Hooks
 * 
 * React Query hooks for transaction-related operations including financial transactions,
 * credit management, payment processing, and transaction history.
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { transactionRepository } from '../repositories/TransactionRepository';
import { queryKeys, invalidateQueries, optimisticUpdates, backgroundRefresh } from './queryClient';
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  CreditPurchaseRequest,
  RefundRequest,
  PaymentMethod,
} from '../types/domain';
import type { ApiResponse, PaginatedResponse } from '../api/types';

// ==================== Transaction Management Hooks ====================

/**
 * Query hook for user transactions with filters
 */
export function useTransactions(
  userId: string,
  filters?: {
    type?: TransactionType[];
    status?: TransactionStatus[];
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
  },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.transactions.list(userId, filters),
    queryFn: () => transactionRepository.getTransactions(userId, filters),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data: PaginatedResponse<Transaction>) => data.data,
  });
}

/**
 * Infinite query hook for paginated transaction history
 */
export function useInfiniteTransactions(
  userId: string,
  filters?: {
    type?: TransactionType[];
    status?: TransactionStatus[];
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
  },
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.transactions.list(userId, filters).concat(['infinite']),
    queryFn: ({ pageParam = 1 }) => transactionRepository.getTransactions(userId, filters),
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
 * Query hook for transaction details
 */
export function useTransactionDetails(transactionId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.transactions.details(transactionId),
    queryFn: () => transactionRepository.getTransactionDetails(transactionId),
    enabled: enabled && !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<Transaction & { receipt?: any }>) => data.data,
  });
}

/**
 * Query hook for pending transactions with frequent updates
 */
export function usePendingTransactions(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['transactions', 'pending', userId],
    queryFn: () => transactionRepository.getPendingTransactions(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: backgroundRefresh.pendingTransactions, // 10 seconds
    select: (data: PaginatedResponse<Transaction>) => data.data,
  });
}

/**
 * Mutation hook for creating transactions
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (data: any) => transactionRepository.createTransaction(data),
    onSuccess: (response) => {
      if (response.success && user?.id) {
        // Invalidate transaction lists
        invalidateQueries.transactions(queryClient, user.id);
      }
    },
    onError: (error) => {
      console.error('Transaction creation failed:', error);
    },
  });
}

/**
 * Mutation hook for updating transaction status
 */
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      transactionId, 
      status, 
      metadata 
    }: { 
      transactionId: string; 
      status: TransactionStatus; 
      metadata?: Record<string, any>; 
    }) => transactionRepository.updateTransactionStatus(transactionId, status, metadata),
    onMutate: async ({ transactionId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions.details(transactionId) });

      // Snapshot previous value
      const previousTransaction = queryClient.getQueryData(queryKeys.transactions.details(transactionId));

      // Optimistically update transaction status
      queryClient.setQueryData(queryKeys.transactions.details(transactionId), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, status },
        };
      });

      return { previousTransaction };
    },
    onError: (error, { transactionId }, context) => {
      // Revert optimistic update on error
      if (context?.previousTransaction) {
        queryClient.setQueryData(queryKeys.transactions.details(transactionId), context.previousTransaction);
      }
      console.error('Transaction status update failed:', error);
    },
    onSuccess: (response, { transactionId }) => {
      if (response.success && response.data) {
        const transaction = response.data;
        // Invalidate transaction lists for the user
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions.list(transaction.userId) 
        });
      }
    },
    onSettled: ({ transactionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.details(transactionId) });
    },
  });
}

// ==================== Credit Purchase Hooks ====================

/**
 * Mutation hook for purchasing credits
 */
export function usePurchaseCredits() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAppStore();

  return useMutation({
    mutationFn: (request: CreditPurchaseRequest) => transactionRepository.purchaseCredits(request),
    onMutate: async (request) => {
      if (!user) return;

      // Optimistically update user credits
      optimisticUpdates.updateCredits(queryClient, user.id, request.amount);
      setUser({ ...user, credits: user.credits + request.amount });

      return { previousCredits: user.credits };
    },
    onError: (error, request, context) => {
      // Revert optimistic update on error
      if (context?.previousCredits !== undefined && user) {
        optimisticUpdates.updateCredits(queryClient, user.id, -request.amount);
        setUser({ ...user, credits: context.previousCredits });
      }
      console.error('Credit purchase failed:', error);
    },
    onSuccess: (response) => {
      if (response.success && response.data && user) {
        const { transaction } = response.data;
        
        // Update transaction history
        invalidateQueries.transactions(queryClient, user.id);
        
        // If payment requires action (e.g., 3D Secure), handle it
        if (response.data.requiresAction) {
          // Handle payment action (implementation depends on payment provider)
          console.log('Payment requires additional action');
        }
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
 * Query hook for validating credit purchase
 */
export function useValidateCreditPurchase(
  request: CreditPurchaseRequest,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transactions', 'validate-credit-purchase', request],
    queryFn: () => transactionRepository.validateCreditPurchase(request),
    enabled: enabled && !!request.amount && !!request.currency,
    staleTime: 30 * 1000, // 30 seconds
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Payment Methods Hooks ====================

/**
 * Query hook for user's payment methods
 */
export function usePaymentMethods(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.transactions.paymentMethods(userId),
    queryFn: () => transactionRepository.getPaymentMethods(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: PaginatedResponse<PaymentMethod>) => data.data,
  });
}

/**
 * Mutation hook for adding payment method
 */
export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (paymentMethodData: {
      type: PaymentMethod['type'];
      token: string;
      nickname?: string;
      setAsDefault?: boolean;
    }) => {
      if (!user?.id) throw new Error('User ID required');
      return transactionRepository.addPaymentMethod(user.id, paymentMethodData);
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions.paymentMethods(user.id) 
        });
      }
    },
    onError: (error) => {
      console.error('Adding payment method failed:', error);
    },
  });
}

/**
 * Mutation hook for removing payment method
 */
export function useRemovePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (paymentMethodId: string) => transactionRepository.removePaymentMethod(paymentMethodId),
    onMutate: async (paymentMethodId) => {
      if (!user?.id) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.transactions.paymentMethods(user.id) 
      });

      // Snapshot previous value
      const previousMethods = queryClient.getQueryData(queryKeys.transactions.paymentMethods(user.id));

      // Optimistically remove payment method
      queryClient.setQueryData(queryKeys.transactions.paymentMethods(user.id), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((method: PaymentMethod) => method.id !== paymentMethodId),
        };
      });

      return { previousMethods };
    },
    onError: (error, paymentMethodId, context) => {
      // Revert optimistic update on error
      if (context?.previousMethods && user?.id) {
        queryClient.setQueryData(
          queryKeys.transactions.paymentMethods(user.id), 
          context.previousMethods
        );
      }
      console.error('Removing payment method failed:', error);
    },
    onSettled: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions.paymentMethods(user.id) 
        });
      }
    },
  });
}

/**
 * Mutation hook for updating payment method
 */
export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: ({ 
      paymentMethodId, 
      updates 
    }: { 
      paymentMethodId: string; 
      updates: { nickname?: string; isDefault?: boolean }; 
    }) => transactionRepository.updatePaymentMethod(paymentMethodId, updates),
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions.paymentMethods(user.id) 
        });
      }
    },
    onError: (error) => {
      console.error('Updating payment method failed:', error);
    },
  });
}

// ==================== Refund Processing Hooks ====================

/**
 * Mutation hook for processing refunds
 */
export function useProcessRefund() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: (request: RefundRequest) => transactionRepository.processRefund(request),
    onSuccess: (response) => {
      if (response.success && user?.id) {
        // Invalidate transaction history
        invalidateQueries.transactions(queryClient, user.id);
      }
    },
    onError: (error) => {
      console.error('Refund processing failed:', error);
    },
  });
}

/**
 * Query hook for refund status
 */
export function useRefundStatus(refundTransactionId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['transactions', 'refunds', refundTransactionId],
    queryFn: () => transactionRepository.getRefundStatus(refundTransactionId),
    enabled: enabled && !!refundTransactionId,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: (data) => {
      // Refresh more frequently for processing refunds
      const status = data?.data?.status;
      if (status === 'processing') {
        return 30 * 1000; // 30 seconds
      }
      return false; // Don't refetch for completed refunds
    },
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Transaction Receipts Hooks ====================

/**
 * Query hook for transaction receipt
 */
export function useTransactionReceipt(
  transactionId: string,
  format: 'json' | 'pdf' = 'json',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transactions', 'receipts', transactionId, format],
    queryFn: () => transactionRepository.getTransactionReceipt(transactionId, format),
    enabled: enabled && !!transactionId,
    staleTime: 60 * 60 * 1000, // 1 hour (receipts don't change)
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Analytics Hooks ====================

/**
 * Query hook for user spending analytics
 */
export function useSpendingAnalytics(
  userId: string,
  period: 'month' | 'quarter' | 'year' = 'month',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transactions', 'analytics', 'spending', userId, period],
    queryFn: () => transactionRepository.getUserSpendingAnalytics(userId, period),
    enabled: enabled && !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data: ApiResponse<any>) => data.data,
  });
}

// ==================== Utility Hooks ====================

/**
 * Hook for refreshing transaction-related data
 */
export function useRefreshTransactions() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return {
    refreshTransactions: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(user.id) });
      }
    },
    refreshTransactionDetails: (transactionId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.details(transactionId) });
    },
    refreshPaymentMethods: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions.paymentMethods(user.id) 
        });
      }
    },
    refreshPendingTransactions: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['transactions', 'pending', user.id] });
      }
    },
    refreshAll: () => {
      if (user?.id) {
        invalidateQueries.transactions(queryClient, user.id);
      }
    },
  };
}

/**
 * Hook for prefetching transaction data
 */
export function usePrefetchTransactions() {
  const queryClient = useQueryClient();

  return {
    prefetchTransactions: (userId: string, filters?: any) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.transactions.list(userId, filters),
        queryFn: () => transactionRepository.getTransactions(userId, filters),
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchTransactionDetails: (transactionId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.transactions.details(transactionId),
        queryFn: () => transactionRepository.getTransactionDetails(transactionId),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchPaymentMethods: (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.transactions.paymentMethods(userId),
        queryFn: () => transactionRepository.getPaymentMethods(userId),
        staleTime: 10 * 60 * 1000,
      });
    },
  };
}

/**
 * Hook for credit purchase flow management
 */
export function useCreditPurchaseFlow() {
  const [amount, setAmount] = React.useState(10);
  const [currency, setCurrency] = React.useState('USD');
  const [paymentMethod, setPaymentMethod] = React.useState('');

  const request: CreditPurchaseRequest = {
    amount,
    currency,
    paymentMethod,
  };

  const {
    data: validationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateCreditPurchase(request, amount > 0);

  const purchaseMutation = usePurchaseCredits();

  const canPurchase = React.useMemo(() => {
    return validationData?.valid && 
           !purchaseMutation.isPending && 
           !isValidating &&
           !!paymentMethod;
  }, [validationData?.valid, purchaseMutation.isPending, isValidating, paymentMethod]);

  const purchaseCredits = React.useCallback(async () => {
    if (!canPurchase) return;
    return purchaseMutation.mutateAsync(request);
  }, [canPurchase, request, purchaseMutation]);

  return {
    amount,
    setAmount,
    currency,
    setCurrency,
    paymentMethod,
    setPaymentMethod,
    validationData,
    isValidating,
    validationError,
    canPurchase,
    purchaseCredits,
    isPurchasing: purchaseMutation.isPending,
    purchaseError: purchaseMutation.error,
  };
}

/**
 * Hook for transaction statistics
 */
export function useTransactionStats(userId: string, enabled: boolean = true) {
  const { data: transactions, isLoading } = useTransactions(userId, undefined, enabled);

  const stats = React.useMemo(() => {
    if (!transactions) return null;

    const totalTransactions = transactions.length;
    const totalSpent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalEarned = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const typeBreakdown = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<TransactionType, number>);

    const statusBreakdown = transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<TransactionStatus, number>);

    return {
      totalTransactions,
      totalSpent,
      totalEarned,
      netAmount: totalEarned - totalSpent,
      averageTransaction: totalTransactions > 0 ? (totalSpent + totalEarned) / totalTransactions : 0,
      typeBreakdown,
      statusBreakdown,
    };
  }, [transactions]);

  return {
    stats,
    isLoading,
  };
}