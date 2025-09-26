/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints, timeouts, and environment settings.
 * This configuration supports feature flags and fallback to mock data.
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  enableLogging: boolean;
  mockDataFallback: boolean;
  featureFlags: {
    useApiForAuthentication: boolean;
    useApiForCards: boolean;
    useApiForPacks: boolean;
    useApiForTransactions: boolean;
  };
}

/**
 * Default API configuration based on environment variables
 */
export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hunterna-api-production.up.railway.app',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  retryCount: parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3', 10),
  retryDelay: 1000, // Base delay for exponential backoff
  enableLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || import.meta.env.DEV,
  mockDataFallback: import.meta.env.VITE_MOCK_DATA_FALLBACK !== 'false',
  featureFlags: {
    useApiForAuthentication: true, // Enable real API authentication
    useApiForCards: import.meta.env.VITE_FEATURE_FLAG_API_CARDS === 'true',
    useApiForPacks: import.meta.env.VITE_FEATURE_FLAG_API_PACKS === 'true',
    useApiForTransactions: import.meta.env.VITE_FEATURE_FLAG_API_TRANSACTIONS === 'true',
  },
};

/**
 * API endpoint paths
 */
export const apiEndpoints = {
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
  },
  // User endpoints
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    credits: '/users/credits',
    transactions: '/users/transactions',
    shipping: '/users/shipping',
    settings: '/users/settings',
  },
  // Card endpoints
  cards: {
    collection: '/cards/collection',
    details: '/cards/:id',
    market: '/cards/market',
    ship: '/cards/ship',
    sell: '/cards/sell',
    history: '/cards/:id/history',
    search: '/cards/search',
    expiring: '/cards/expiring',
    convert: '/cards/convert',
  },
  // Pack endpoints
  packs: {
    catalog: '/packs',
    details: '/packs/:id',
    purchase: '/packs/purchase',
    open: '/packs/open',
    history: '/packs/history',
    recommendations: '/packs/recommendations',
    statistics: '/packs/:id/statistics',
  },
  // Transaction endpoints
  transactions: {
    list: '/transactions',
    details: '/transactions/:id',
    create: '/transactions',
    update: '/transactions/:id',
    credits: '/transactions/credits',
    refund: '/transactions/:id/refund',
    payments: '/transactions/payments',
    receipt: '/transactions/:id/receipt',
  },
} as const;

/**
 * Build full API URL with path parameters
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = `${apiConfig.baseUrl}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return url;
}

/**
 * Check if a specific feature flag is enabled
 */
export function isFeatureEnabled(feature: keyof typeof apiConfig.featureFlags): boolean {
  return apiConfig.featureFlags[feature];
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiUrl: apiConfig.baseUrl,
    enableMockFallback: apiConfig.mockDataFallback,
  };
}