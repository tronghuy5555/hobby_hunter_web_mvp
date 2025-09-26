/**
 * Base Repository Class
 * 
 * Abstract base class that provides common CRUD operations and utilities
 * for all domain-specific repositories. Ensures consistent patterns and
 * error handling across the entire API service layer.
 */

import { httpClient } from '../api/client';
import { buildApiUrl, isFeatureEnabled } from '../api/config';
import type {
  ApiResponse,
  PaginatedResponse,
  ListRequestParams,
  ApiClientError,
} from '../api/types';

/**
 * Base entity interface that all domain entities should extend
 */
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Common repository interface
 */
export interface IRepository<T extends BaseEntity> {
  findAll(params?: ListRequestParams): Promise<PaginatedResponse<T>>;
  findById(id: string): Promise<ApiResponse<T>>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T>>;
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

/**
 * Repository options for configuration
 */
export interface RepositoryOptions {
  featureFlag?: keyof typeof import('../api/config').apiConfig.featureFlags;
  mockFallback?: boolean;
  baseEndpoint: string;
}

/**
 * Abstract base repository class
 */
export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected readonly baseEndpoint: string;
  protected readonly featureFlag?: keyof typeof import('../api/config').apiConfig.featureFlags;
  protected readonly mockFallback: boolean;

  constructor(options: RepositoryOptions) {
    this.baseEndpoint = options.baseEndpoint;
    this.featureFlag = options.featureFlag;
    this.mockFallback = options.mockFallback ?? true;
  }

  /**
   * Check if API should be used for this repository
   */
  protected shouldUseApi(): boolean {
    if (!this.featureFlag) return true;
    return isFeatureEnabled(this.featureFlag);
  }

  /**
   * Build full API URL for this repository's endpoints
   */
  protected buildUrl(path: string = '', params?: Record<string, string | number>): string {
    const fullPath = `${this.baseEndpoint}${path}`;
    return buildApiUrl(fullPath, params);
  }

  /**
   * Handle API errors with optional mock fallback
   */
  protected async handleApiError<TResult>(
    error: ApiClientError,
    mockFallback?: () => Promise<TResult> | TResult
  ): Promise<TResult> {
    // Log error for debugging
    console.error(`API Error in ${this.constructor.name}:`, error);

    // If mock fallback is enabled and available, use it
    if (this.mockFallback && mockFallback && this.isRetryableError(error)) {
      console.warn(`Falling back to mock data due to API error: ${error.message}`);
      return mockFallback();
    }

    // Re-throw the error if no fallback or error is not retryable
    throw error;
  }

  /**
   * Determine if error should trigger mock fallback
   */
  private isRetryableError(error: ApiClientError): boolean {
    return error.type === 'network_error' || 
           error.type === 'server_error' || 
           error.type === 'timeout_error';
  }

  /**
   * Transform request data before sending to API
   */
  protected transformRequest(data: any): any {
    // Override in subclasses for specific transformations
    return data;
  }

  /**
   * Transform response data after receiving from API
   */
  protected transformResponse(data: any): T {
    // Override in subclasses for specific transformations
    return data;
  }

  /**
   * Transform list response data
   */
  protected transformListResponse(data: any): T[] {
    if (Array.isArray(data)) {
      return data.map(item => this.transformResponse(item));
    }
    return [];
  }

  /**
   * Default implementation of findAll
   */
  async findAll(params?: ListRequestParams): Promise<PaginatedResponse<T>> {
    if (!this.shouldUseApi()) {
      return this.getMockListData(params);
    }

    try {
      const response = await httpClient.get<T[]>(this.buildUrl(), params);
      
      return {
        ...response,
        data: this.transformListResponse(response.data),
      } as PaginatedResponse<T>;
    } catch (error) {
      return this.handleApiError(error as ApiClientError, () => this.getMockListData(params));
    }
  }

  /**
   * Default implementation of findById
   */
  async findById(id: string): Promise<ApiResponse<T>> {
    if (!this.shouldUseApi()) {
      return this.getMockByIdData(id);
    }

    try {
      const response = await httpClient.get<T>(this.buildUrl(`/${id}`));
      
      return {
        ...response,
        data: response.data ? this.transformResponse(response.data) : undefined,
      };
    } catch (error) {
      return this.handleApiError(error as ApiClientError, () => this.getMockByIdData(id));
    }
  }

  /**
   * Default implementation of create
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T>> {
    if (!this.shouldUseApi()) {
      return this.getMockCreateData(data);
    }

    try {
      const transformedData = this.transformRequest(data);
      const response = await httpClient.post<T>(this.buildUrl(), transformedData);
      
      return {
        ...response,
        data: response.data ? this.transformResponse(response.data) : undefined,
      };
    } catch (error) {
      return this.handleApiError(error as ApiClientError, () => this.getMockCreateData(data));
    }
  }

  /**
   * Default implementation of update
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<T>> {
    if (!this.shouldUseApi()) {
      return this.getMockUpdateData(id, data);
    }

    try {
      const transformedData = this.transformRequest(data);
      const response = await httpClient.patch<T>(this.buildUrl(`/${id}`), transformedData);
      
      return {
        ...response,
        data: response.data ? this.transformResponse(response.data) : undefined,
      };
    } catch (error) {
      return this.handleApiError(error as ApiClientError, () => this.getMockUpdateData(id, data));
    }
  }

  /**
   * Default implementation of delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (!this.shouldUseApi()) {
      return this.getMockDeleteData(id);
    }

    try {
      const response = await httpClient.delete<void>(this.buildUrl(`/${id}`));
      return response;
    } catch (error) {
      return this.handleApiError(error as ApiClientError, () => this.getMockDeleteData(id));
    }
  }

  /**
   * Utility method for making custom API calls
   */
  protected async makeApiCall<TResult>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    data?: any,
    params?: Record<string, any>,
    mockFallback?: () => Promise<TResult> | TResult
  ): Promise<ApiResponse<TResult>> {
    if (!this.shouldUseApi() && mockFallback) {
      const mockResult = await mockFallback();
      return {
        success: true,
        data: mockResult,
        message: 'Mock data response',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const url = this.buildUrl(path);
      let response: ApiResponse<TResult>;

      switch (method) {
        case 'GET':
          response = await httpClient.get<TResult>(url, params);
          break;
        case 'POST':
          response = await httpClient.post<TResult>(url, this.transformRequest(data));
          break;
        case 'PUT':
          response = await httpClient.put<TResult>(url, this.transformRequest(data));
          break;
        case 'PATCH':
          response = await httpClient.patch<TResult>(url, this.transformRequest(data));
          break;
        case 'DELETE':
          response = await httpClient.delete<TResult>(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response;
    } catch (error) {
      if (mockFallback) {
        return this.handleApiError(error as ApiClientError, mockFallback);
      }
      throw error;
    }
  }

  /**
   * Abstract methods that must be implemented by subclasses for mock fallback
   */
  protected abstract getMockListData(params?: ListRequestParams): Promise<PaginatedResponse<T>>;
  protected abstract getMockByIdData(id: string): Promise<ApiResponse<T>>;
  protected abstract getMockCreateData(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T>>;
  protected abstract getMockUpdateData(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<T>>;
  protected abstract getMockDeleteData(id: string): Promise<ApiResponse<void>>;
}

/**
 * Utility functions for common repository operations
 */
export class RepositoryUtils {
  /**
   * Create a standardized success response
   */
  static createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a standardized error response
   */
  static createErrorResponse(message: string, code?: string): ApiResponse<never> {
    return {
      success: false,
      error: {
        code: code || 'UNKNOWN_ERROR',
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a paginated response
   */
  static createPaginatedResponse<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    }
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page * pagination.limit < pagination.total,
        hasPrev: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate a mock ID
   */
  static generateMockId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add simulated delay for mock responses
   */
  static async simulateDelay(min: number = 100, max: number = 500): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}