/**
 * HTTP Client Implementation
 * 
 * A robust HTTP client built on fetch API with authentication, retry logic,
 * error handling, and request/response transformations.
 */

import { useAppStore } from '@/lib/store';
import { apiConfig, buildApiUrl } from './config';
import type {
  ApiResponse,
  ApiError,
  ApiClientError,
  ApiErrorType,
  RequestConfig,
  RetryConfig,
  HttpMethod,
} from './types';

/**
 * Request interceptor function type
 */
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor function type
 */
type ResponseInterceptor = (response: Response, data: any) => any | Promise<any>;

/**
 * Error interceptor function type
 */
type ErrorInterceptor = (error: ApiClientError) => Promise<never> | ApiClientError;

/**
 * HTTP Client class with comprehensive functionality
 */
class HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor() {
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default interceptors for authentication and logging
   */
  private setupDefaultInterceptors(): void {
    // Default request interceptor for authentication
    this.addRequestInterceptor(this.authInterceptor);

    // Default request interceptor for logging
    if (apiConfig.enableLogging) {
      this.addRequestInterceptor(this.loggingRequestInterceptor);
      this.addResponseInterceptor(this.loggingResponseInterceptor);
    }
  }

  /**
   * Authentication interceptor - adds auth token to requests
   */
  private authInterceptor = (config: RequestConfig): RequestConfig => {
    if (config.requiresAuth !== false) {
      const { user } = useAppStore.getState();
      
      // In a real implementation, you would get the actual auth token
      // For now, we'll assume we have some token mechanism
      const token = this.getAuthToken();
      
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    return config;
  };

  /**
   * Get authentication token (placeholder implementation)
   */
  private getAuthToken(): string | null {
    // In real implementation, this would retrieve the actual token
    // from secure storage or the auth store
    return localStorage.getItem('auth_token');
  }

  /**
   * Logging interceptors for development
   */
  private loggingRequestInterceptor = (config: RequestConfig): RequestConfig => {
    console.log(`🚀 API Request: ${config.method} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers,
    });
    return config;
  };

  private loggingResponseInterceptor = (response: Response, data: any): any => {
    console.log(`✅ API Response: ${response.status} ${response.url}`, {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
    return data;
  };

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Execute all request interceptors
   */
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  /**
   * Execute all response interceptors
   */
  private async executeResponseInterceptors(response: Response, data: any): Promise<any> {
    let processedData = data;
    
    for (const interceptor of this.responseInterceptors) {
      processedData = await interceptor(response, processedData);
    }
    
    return processedData;
  }

  /**
   * Execute all error interceptors
   */
  private async executeErrorInterceptors(error: ApiClientError): Promise<never> {
    let processedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      try {
        processedError = await interceptor(processedError);
      } catch (handledError) {
        throw handledError;
      }
    }
    
    throw processedError;
  }

  /**
   * Create API error from response or exception
   */
  private createApiError(
    error: any,
    config: RequestConfig,
    response?: Response
  ): ApiClientError {
    let type: ApiErrorType = 'unknown_error';
    let message = 'An unexpected error occurred';
    let statusCode: number | undefined;

    if (response) {
      statusCode = response.status;
      
      switch (response.status) {
        case 400:
          type = 'validation_error';
          message = 'Bad request - please check your input';
          break;
        case 401:
          type = 'auth_error';
          message = 'Authentication required';
          break;
        case 403:
          type = 'permission_error';
          message = 'Permission denied';
          break;
        case 404:
          type = 'not_found_error';
          message = 'Resource not found';
          break;
        case 429:
          type = 'rate_limit_error';
          message = 'Too many requests - please try again later';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          type = 'server_error';
          message = 'Server error - please try again later';
          break;
      }
    } else if (error.name === 'AbortError') {
      type = 'timeout_error';
      message = 'Request timed out';
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      type = 'network_error';
      message = 'Network error - please check your connection';
    }

    const apiError: ApiClientError = new Error(message) as ApiClientError;
    apiError.type = type;
    apiError.statusCode = statusCode;
    apiError.config = config;
    apiError.response = response;
    apiError.isRetryable = this.isRetryableError(type);

    return apiError;
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(type: ApiErrorType): boolean {
    return ['network_error', 'timeout_error', 'server_error', 'rate_limit_error'].includes(type);
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryConfig: RetryConfig
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= retryConfig.attempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on last attempt or if error is not retryable
        if (
          attempt === retryConfig.attempts ||
          (retryConfig.retryCondition && !retryConfig.retryCondition(error)) ||
          (error as ApiClientError).isRetryable === false
        ) {
          break;
        }

        // Calculate delay
        let delay = retryConfig.delay;
        if (retryConfig.backoff === 'exponential') {
          delay = retryConfig.delay * Math.pow(2, attempt);
        }

        // Add some jitter to prevent thundering herd
        delay += Math.random() * 1000;

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Main request method
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const retryConfig: RetryConfig = {
      attempts: config.retryCount ?? apiConfig.retryCount,
      delay: apiConfig.retryDelay,
      backoff: 'exponential',
      retryCondition: (error: ApiClientError) => error.isRetryable ?? false,
    };

    return this.retryRequest(async () => {
      // Execute request interceptors
      const processedConfig = await this.executeRequestInterceptors(config);

      // Setup request
      const controller = new AbortController();
      const timeout = processedConfig.timeout ?? apiConfig.timeout;
      
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        // Build request options
        const requestOptions: RequestInit = {
          method: processedConfig.method,
          headers: {
            'Content-Type': 'application/json',
            ...processedConfig.headers,
          },
          signal: controller.signal,
        };

        // Add body for non-GET requests
        if (processedConfig.data && processedConfig.method !== 'GET') {
          requestOptions.body = JSON.stringify(processedConfig.data);
        }

        // Build URL with query parameters
        let url = processedConfig.url;
        if (processedConfig.params) {
          const searchParams = new URLSearchParams(processedConfig.params);
          url += `?${searchParams.toString()}`;
        }

        // Make the request
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        // Parse response
        let data: any;
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }

        // Handle HTTP errors
        if (!response.ok) {
          const apiError = this.createApiError(null, processedConfig, response);
          await this.executeErrorInterceptors(apiError);
        }

        // Execute response interceptors
        const processedData = await this.executeResponseInterceptors(response, data);

        // Return standardized response
        return {
          success: true,
          data: processedData,
          message: response.statusText,
          timestamp: new Date().toISOString(),
        } as ApiResponse<T>;

      } catch (error) {
        clearTimeout(timeoutId);
        const apiError = this.createApiError(error, processedConfig);
        await this.executeErrorInterceptors(apiError);
      }
    }, retryConfig);
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  async patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

// Export individual methods for convenience
export const { get, post, put, patch, delete: del } = httpClient;