/**
 * Services Index
 * 
 * Central export point for all API services, repositories, hooks, and types.
 * This file provides a clean API for consuming the service layer throughout the application.
 */

// ==================== Configuration ====================
export { apiConfig, apiEndpoints, buildApiUrl, isFeatureEnabled, getEnvironmentConfig } from './api/config';

// ==================== Types ====================
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  ApiErrorType,
  RequestConfig,
  HttpMethod,
  AuthToken,
  FeatureFlags,
  EnvironmentConfig,
} from './api/types';

export type {
  User,
  Card,
  Pack,
  Transaction,
  AuthCredentials,
  RegisterData,
  VerificationData,
  CardFilters,
  ShipCardsRequest,
  SellCardRequest,
  ConvertCardsRequest,
  PackPurchaseRequest,
  PackOpenRequest,
  PackOpeningResult,
  CreditPurchaseRequest,
  RefundRequest,
  PaymentMethod,
  ShippingAddress,
  MarketData,
  UserPreferences,
  UserSettings,
  TransactionType,
  TransactionStatus,
} from './types/domain';

// ==================== HTTP Client ====================
export { httpClient } from './api/client';

// ==================== Base Repository ====================
export { BaseRepository, RepositoryUtils } from './repositories/BaseRepository';
export type { BaseEntity, IRepository } from './repositories/BaseRepository';

// ==================== Repository Instances ====================
export { userRepository } from './repositories/UserRepository';
export { cardRepository } from './repositories/CardRepository';
export { packRepository } from './repositories/PackRepository';
export { transactionRepository } from './repositories/TransactionRepository';

// ==================== React Query Configuration ====================
export {
  createQueryClient,
  queryKeys,
  invalidateQueries,
  optimisticUpdates,
  backgroundRefresh,
} from './hooks/queryClient';

// ==================== Query Hooks ====================
// User hooks
export {
  useLogin,
  useRegister,
  useVerifyEmail,
  useLogout,
  useUserProfile,
  useUpdateProfile,
  useUpdateShippingAddress,
  useUpdatePreferences,
  useUpdateSettings,
  useUserCredits,
  useUpdateCredits,
  useUserTransactions,
  useAccountSettings,
  useCurrentUser,
  useRefreshUser,
  usePrefetchUserData,
} from './hooks/useUserQueries';

// Card hooks
export {
  useUserCards,
  useInfiniteUserCards,
  useCardDetails,
  useCardMarketData,
  useExpiringCards,
  useSearchCards,
  useCardHistory,
  useUpdateCardStatus,
  useConvertCardsToCredits,
  useShipCards,
  useShippingStatus,
  useSellCard,
  useTopCards,
  useCardRecommendations,
  useRefreshCards,
  usePrefetchCards,
  useCardCollectionStats,
} from './hooks/useCardQueries';

// Pack hooks
export {
  useAvailablePacks,
  useInfiniteAvailablePacks,
  usePackDetails,
  usePackStatistics,
  useTrendingPacks,
  usePurchasePack,
  useValidatePackPurchase,
  useOpenPack,
  usePackOpening,
  usePackHistory,
  useInfinitePackHistory,
  usePackRecommendations,
  useUpdatePackAvailability,
  useRefreshPacks,
  usePrefetchPacks,
  usePackOpeningState,
  usePackPurchaseFlow,
} from './hooks/usePackQueries';

// Transaction hooks
export {
  useTransactions,
  useInfiniteTransactions,
  useTransactionDetails,
  usePendingTransactions,
  useCreateTransaction,
  useUpdateTransactionStatus,
  usePurchaseCredits,
  useValidateCreditPurchase,
  usePaymentMethods,
  useAddPaymentMethod,
  useRemovePaymentMethod,
  useUpdatePaymentMethod,
  useProcessRefund,
  useRefundStatus,
  useTransactionReceipt,
  useSpendingAnalytics,
  useRefreshTransactions,
  usePrefetchTransactions,
  useCreditPurchaseFlow,
  useTransactionStats,
} from './hooks/useTransactionQueries';

// ==================== Utility Functions ====================
/**
 * Initialize the API service layer
 * Call this once in your app's main entry point
 */
export function initializeApiServices() {
  // Any global initialization logic can go here
  console.log('API Services initialized with configuration:', {
    baseUrl: apiConfig.baseUrl,
    environment: getEnvironmentConfig(),
    featureFlags: apiConfig.featureFlags,
  });
}

/**
 * Check if API services are enabled for a specific feature
 */
export function isApiEnabled(feature: keyof typeof apiConfig.featureFlags): boolean {
  return isFeatureEnabled(feature);
}

/**
 * Get the current environment configuration
 */
export function getApiEnvironment() {
  return getEnvironmentConfig();
}