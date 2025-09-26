/**
 * Common API Types
 * 
 * Shared TypeScript interfaces for API requests and responses.
 * These types ensure consistency across all repository implementations.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp?: string;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
  field?: string;
  statusCode?: number;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Pagination metadata in responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationMeta;
}

/**
 * Sorting parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters for search requests
 */
export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

/**
 * Common list request parameters
 */
export interface ListRequestParams extends PaginationParams, SortParams, FilterParams {}

/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration options
 */
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
  requiresAuth?: boolean;
}

/**
 * Authentication token information
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

/**
 * Request retry configuration
 */
export interface RetryConfig {
  attempts: number;
  delay: number;
  backoff: 'exponential' | 'linear';
  retryCondition?: (error: any) => boolean;
}

/**
 * API client error types
 */
export type ApiErrorType = 
  | 'network_error'
  | 'timeout_error'
  | 'auth_error'
  | 'validation_error'
  | 'server_error'
  | 'not_found_error'
  | 'permission_error'
  | 'rate_limit_error'
  | 'unknown_error';

/**
 * Enhanced API error with type classification
 */
export interface ApiClientError extends Error {
  type: ApiErrorType;
  statusCode?: number;
  response?: any;
  config?: RequestConfig;
  isRetryable?: boolean;
}

/**
 * Feature flag configuration
 */
export interface FeatureFlags {
  useApiForAuthentication: boolean;
  useApiForCards: boolean;
  useApiForPacks: boolean;
  useApiForTransactions: boolean;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableApiLogging: boolean;
  mockDataFallback: boolean;
  featureFlags: FeatureFlags;
}