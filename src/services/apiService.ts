import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import {
  PaymentMethod
} from '../types';
import type {
  User,
  Card,
  Pack,
  Transaction,
  LoginCredentials,
  ShippingAddress,
  PurchaseResponse,
  PackOpenResponse,
  ShipResponse,
  PaymentResponse,
  CreditPurchaseResponse
} from '../types';

// API Error class for better error handling
export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(
    message: string,
    status?: number,
    code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class CardPackApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;
          const message = (data as any)?.error || (data as any)?.message || 'An error occurred';
          
          // Handle specific error status codes
          switch (status) {
            case 401:
              this.authToken = null;
              localStorage.removeItem('authToken');
              throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
            case 403:
              throw new ApiError('Access forbidden', 403, 'FORBIDDEN');
            case 404:
              throw new ApiError('Resource not found', 404, 'NOT_FOUND');
            case 429:
              throw new ApiError('Too many requests', 429, 'RATE_LIMITED');
            case 500:
              throw new ApiError('Server error', 500, 'INTERNAL_ERROR');
            default:
              throw new ApiError(message, status);
          }
        } else if (error.request) {
          throw new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
        } else {
          throw new ApiError('Request failed', 0, 'REQUEST_ERROR');
        }
      }
    );
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  // Initialize auth token from storage
  initializeAuth() {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.authToken = storedToken;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await this.client.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      if (token) {
        this.setAuthToken(token);
      }
      
      return user;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
      this.clearAuthToken();
    } catch (error) {
      // Clear token even if logout request fails
      this.clearAuthToken();
      throw error instanceof ApiError ? error : new ApiError('Logout failed');
    }
  }

  // Products & Packs endpoints
  async getProducts(): Promise<Pack[]> {
    try {
      const response = await this.client.get('/products');
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch packs');
    }
  }

  async getProductById(id: string): Promise<Pack> {
    try {
      const response = await this.client.get(`/products/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch pack details');
    }
  }

  // Pack purchase and opening
  async purchasePack(packId: string, paymentMethod: PaymentMethod): Promise<PurchaseResponse> {
    try {
      const response = await this.client.post('/purchase', {
        packId,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Purchase failed');
    }
  }

  async openPack(packId: string): Promise<PackOpenResponse> {
    try {
      const response = await this.client.post(`/packs/${packId}/open`);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to open pack');
    }
  }

  // Cards endpoints
  async getTopCards(): Promise<Card[]> {
    try {
      const response = await this.client.get('/cards/top5');
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch top cards');
    }
  }

  async getUserCards(): Promise<Card[]> {
    try {
      const response = await this.client.get('/user/cards');
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch user cards');
    }
  }

  async getCardById(id: string): Promise<Card> {
    try {
      const response = await this.client.get(`/cards/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch card details');
    }
  }

  async searchCards(query: string, filters?: {
    rarity?: string;
    category?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<Card[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters?.rarity) params.append('rarity', filters.rarity);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minValue) params.append('minValue', filters.minValue.toString());
      if (filters?.maxValue) params.append('maxValue', filters.maxValue.toString());

      const response = await this.client.get(`/cards/search?${params.toString()}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Search failed');
    }
  }

  // User management
  async getUserProfile(): Promise<User> {
    try {
      const response = await this.client.get('/user');
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch user profile');
    }
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await this.client.put('/user/profile', updates);
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to update profile');
    }
  }

  async getUserStats(): Promise<{
    totalCards: number;
    totalValue: number;
    cardsByRarity: Record<string, number>;
    packsOpened: number;
    creditsSpent: number;
    accountAge: number;
  }> {
    try {
      const response = await this.client.get('/user/stats');
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch user stats');
    }
  }

  // Shipping endpoints
  async shipCards(cardIds: string[], address: ShippingAddress, shippingOption?: string): Promise<ShipResponse> {
    try {
      const response = await this.client.post('/user/ship', {
        cardIds,
        address,
        shippingOption
      });
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Shipping request failed');
    }
  }

  async getShippingTracking(trackingNumber: string): Promise<{
    trackingNumber: string;
    status: string;
    estimatedDelivery: Date;
    updates: Array<{
      date: Date;
      status: string;
      location: string;
    }>;
  }> {
    try {
      const response = await this.client.get(`/shipping/tracking/${trackingNumber}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch tracking info');
    }
  }

  // Credits and payments
  async addCredits(amount: number): Promise<CreditPurchaseResponse> {
    try {
      const response = await this.client.post('/credits/add', { amount });
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to add credits');
    }
  }

  async processPayPalPayment(amount: number): Promise<PaymentResponse> {
    try {
      const response = await this.client.post('/payment/paypal', { amount });
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('PayPal payment failed');
    }
  }

  // Transaction history
  async getTransactionHistory(limit: number = 10, offset: number = 0): Promise<Transaction[]> {
    try {
      const response = await this.client.get('/user/transactions', {
        params: { limit, offset }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch transaction history');
    }
  }

  // Contact/Support
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; ticketId: string }> {
    try {
      const response = await this.client.post('/contact', data);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to submit contact form');
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Health check failed');
    }
  }

  // Utility methods
  async uploadFile(file: File, type: 'avatar' | 'card-image'): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await this.client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('File upload failed');
    }
  }

  // Retry mechanism for failed requests
  async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on authentication errors or client errors (4xx)
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError!;
  }
}

// Create and export a singleton instance
export const apiService = new CardPackApiService();

// Initialize authentication on service creation
apiService.initializeAuth();