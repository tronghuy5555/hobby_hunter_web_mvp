/**
 * User Query Hooks
 * 
 * React Query hooks for user-related operations including authentication,
 * profile management, and credit operations. Provides optimistic updates
 * and proper cache management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { userRepository } from '../repositories/UserRepository';
import { queryKeys, invalidateQueries, optimisticUpdates, backgroundRefresh } from './queryClient';
import type {
  User,
  AuthCredentials,
  RegisterData,
  RegisterResponse,
  VerificationData,
  UpdateUserData,
  ShippingAddress,
  UserPreferences,
  UserSettings,
} from '../types/domain';
import type { ApiResponse, PaginatedResponse } from '../api/types';

// ==================== Authentication Hooks ====================

/**
 * Mutation hook for user authentication
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => userRepository.authenticate(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store user in global state
        setUser(user);
        
        // Store auth tokens securely
        localStorage.setItem('auth_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        
        // Update user profile cache
        queryClient.setQueryData(queryKeys.users.profile(user.id), response);
        
        // Prefetch user-related data
        queryClient.prefetchQuery({
          queryKey: queryKeys.users.credits(user.id),
          queryFn: () => userRepository.getCredits(user.id),
          staleTime: backgroundRefresh.userCredits,
        });
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Clear any stored auth data on error
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    },
  });
}

/**
 * Mutation hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => userRepository.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Registration successful, but no tokens are provided
        // User will need to login separately to get tokens
        console.log('Registration successful:', response.data.message);
        
        // Optionally clear any cached data
        queryClient.clear();
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

/**
 * Mutation hook for email verification
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (verificationData: VerificationData) => userRepository.verifyEmail(verificationData),
    onError: (error) => {
      console.error('Email verification failed:', error);
    },
  });
}

/**
 * Mutation hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAppStore();

  return useMutation({
    mutationFn: () => userRepository.logout(),
    onSettled: () => {
      // Clear all cached data on logout
      queryClient.clear();
      
      // Clear auth tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Reset global state
      logout();
    },
  });
}

// ==================== Profile Management Hooks ====================

/**
 * Query hook for user profile
 */
export function useUserProfile(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => userRepository.getProfile(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<User>) => data.data,
  });
}

/**
 * Mutation hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAppStore();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      userRepository.updateProfile(userId, data),
    onMutate: async ({ userId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.profile(userId) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.profile(userId));

      // Optimistically update cache
      queryClient.setQueryData(queryKeys.users.profile(userId), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, ...data },
        };
      });

      // Update global state optimistically if it's the current user
      if (user?.id === userId) {
        setUser({ ...user, ...data });
      }

      return { previousUser };
    },
    onError: (error, { userId }, context) => {
      // Revert optimistic update on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.profile(userId), context.previousUser);
      }
      console.error('Profile update failed:', error);
    },
    onSuccess: (response, { userId }) => {
      // Update global state with server response
      if (response.success && response.data && user?.id === userId) {
        setUser(response.data);
      }
    },
    onSettled: ({ userId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(userId) });
    },
  });
}

/**
 * Mutation hook for updating shipping address
 */
export function useUpdateShippingAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, address }: { userId: string; address: ShippingAddress }) =>
      userRepository.updateShippingAddress(userId, address),
    onSuccess: (response, { userId }) => {
      if (response.success) {
        invalidateQueries.user(queryClient, userId);
      }
    },
    onError: (error) => {
      console.error('Shipping address update failed:', error);
    },
  });
}

/**
 * Mutation hook for updating user preferences
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: UserPreferences }) =>
      userRepository.updatePreferences(userId, preferences),
    onSuccess: (response, { userId }) => {
      if (response.success) {
        invalidateQueries.user(queryClient, userId);
      }
    },
    onError: (error) => {
      console.error('Preferences update failed:', error);
    },
  });
}

/**
 * Mutation hook for updating user settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, settings }: { userId: string; settings: UserSettings }) =>
      userRepository.updateSettings(userId, settings),
    onSuccess: (response, { userId }) => {
      if (response.success) {
        invalidateQueries.user(queryClient, userId);
      }
    },
    onError: (error) => {
      console.error('Settings update failed:', error);
    },
  });
}

// ==================== Credit Management Hooks ====================

/**
 * Query hook for user credits with background refresh
 */
export function useUserCredits(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.users.credits(userId),
    queryFn: () => userRepository.getCredits(userId),
    enabled: enabled && !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent for credits)
    refetchInterval: backgroundRefresh.userCredits, // Background refresh every 30 seconds
    select: (data: ApiResponse<{ credits: number; history: any[] }>) => data.data,
  });
}

/**
 * Mutation hook for updating user credits (admin operation)
 */
export function useUpdateCredits() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAppStore();

  return useMutation({
    mutationFn: ({ userId, amount, reason }: { userId: string; amount: number; reason?: string }) =>
      userRepository.updateCredits(userId, amount, reason),
    onMutate: async ({ userId, amount }) => {
      // Optimistically update credits
      optimisticUpdates.updateCredits(queryClient, userId, amount);

      // Update global state if it's the current user
      if (user?.id === userId) {
        setUser({ ...user, credits: user.credits + amount });
      }

      return { previousCredits: user?.credits };
    },
    onError: (error, { userId, amount }, context) => {
      // Revert optimistic update on error
      if (context?.previousCredits !== undefined) {
        optimisticUpdates.updateCredits(queryClient, userId, -amount);
        if (user?.id === userId) {
          setUser({ ...user, credits: context.previousCredits });
        }
      }
      console.error('Credit update failed:', error);
    },
    onSuccess: (response, { userId }) => {
      if (response.success && response.data && user?.id === userId) {
        setUser(response.data);
      }
    },
    onSettled: ({ userId }) => {
      // Invalidate credit-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.credits(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.transactions(userId) });
    },
  });
}

/**
 * Query hook for user transaction history
 */
export function useUserTransactions(
  userId: string,
  filters?: { dateFrom?: string; dateTo?: string; type?: string },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.users.transactions(userId, filters),
    queryFn: () => userRepository.getTransactionHistory(userId, filters),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data: PaginatedResponse<any>) => data.data,
  });
}

// ==================== Account Settings Hooks ====================

/**
 * Query hook for account settings (preferences + settings)
 */
export function useAccountSettings(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.users.all.concat(['settings', userId]),
    queryFn: () => userRepository.getAccountSettings(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes (settings change less frequently)
    select: (data: ApiResponse<{ preferences: UserPreferences; settings: UserSettings }>) => data.data,
  });
}

// ==================== Utility Hooks ====================

/**
 * Hook to get current user data from React Query cache and Zustand store
 */
export function useCurrentUser() {
  const { user, isAuthenticated } = useAppStore();
  
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfile(user?.id || '', !!user?.id);

  const {
    data: creditsData,
    isLoading: isCreditsLoading,
  } = useUserCredits(user?.id || '', !!user?.id);

  return {
    user: profileData || user,
    credits: creditsData?.credits || user?.credits || 0,
    isAuthenticated,
    isLoading: isProfileLoading || isCreditsLoading,
    error: profileError,
  };
}

/**
 * Hook for refreshing user data
 */
export function useRefreshUser() {
  const queryClient = useQueryClient();
  const { user } = useAppStore();

  return {
    refreshProfile: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(user.id) });
      }
    },
    refreshCredits: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.credits(user.id) });
      }
    },
    refreshAll: () => {
      if (user?.id) {
        invalidateQueries.user(queryClient, user.id);
      }
    },
  };
}

/**
 * Hook for prefetching user data
 */
export function usePrefetchUserData() {
  const queryClient = useQueryClient();

  return {
    prefetchProfile: (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.profile(userId),
        queryFn: () => userRepository.getProfile(userId),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchCredits: (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.credits(userId),
        queryFn: () => userRepository.getCredits(userId),
        staleTime: backgroundRefresh.userCredits,
      });
    },
    prefetchAll: (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.profile(userId),
        queryFn: () => userRepository.getProfile(userId),
      });
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.credits(userId),
        queryFn: () => userRepository.getCredits(userId),
      });
    },
  };
}