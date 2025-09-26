/**
 * User Repository
 * 
 * Handles user authentication, profile management, and credit operations.
 * Provides mock data fallback when API is unavailable or disabled.
 */

import { BaseRepository, RepositoryUtils } from './BaseRepository';
import { apiEndpoints } from '../api/config';
import type {
  User,
  AuthCredentials,
  RegisterData,
  RegisterResponse,
  AuthTokens,
  VerificationData,
  CreateUserData,
  UpdateUserData,
  ShippingAddress,
  UserPreferences,
  UserSettings,
} from '../types/domain';
import type {
  ApiResponse,
  PaginatedResponse,
  ListRequestParams,
} from '../api/types';

/**
 * User repository for authentication and profile management
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super({
      baseEndpoint: apiEndpoints.users.profile,
      featureFlag: 'useApiForAuthentication',
      mockFallback: true,
    });
  }

  /**
   * Transform request data for API
   */
  protected transformRequest(data: any): any {
    // Convert UI data format to API format
    if (data.fullName) {
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      return {
        ...data,
        firstName,
        lastName: lastNameParts.join(' '),
      };
    }
    return data;
  }

  /**
   * Transform API response to UI format
   */
  protected transformResponse(data: any): User {
    // Convert API format to UI format
    if (data.firstName && data.lastName) {
      return {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
      };
    }
    return data;
  }

  // ==================== Authentication Methods ====================

  /**
   * Authenticate user with email and password
   */
  async authenticate(credentials: AuthCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.auth.login,
      credentials,
      undefined,
      () => this.getMockAuthData(credentials)
    );
  }

  /**
   * Register a new user account
   */
  async register(userData: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.auth.register,
      userData,
      undefined,
      () => this.getMockRegisterData(userData)
    );
  }

  /**
   * Verify email with verification code
   */
  async verifyEmail(verificationData: VerificationData): Promise<ApiResponse<{ verified: boolean }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.auth.verify,
      verificationData,
      undefined,
      () => this.getMockVerifyData(verificationData)
    );
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.auth.refresh,
      { refreshToken },
      undefined,
      () => this.getMockRefreshData(refreshToken)
    );
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.auth.logout,
      {},
      undefined,
      () => this.getMockLogoutData()
    );
  }

  // ==================== Profile Management Methods ====================

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    return this.findById(userId);
  }

  /**
   * Update user profile information
   */
  async updateProfile(userId: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return this.update(userId, data);
  }

  /**
   * Update user shipping address
   */
  async updateShippingAddress(userId: string, address: ShippingAddress): Promise<ApiResponse<User>> {
    return this.makeApiCall(
      'PUT',
      apiEndpoints.users.shipping,
      address,
      undefined,
      () => this.getMockUpdateShippingData(userId, address)
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: UserPreferences): Promise<ApiResponse<User>> {
    return this.makeApiCall(
      'PUT',
      `${apiEndpoints.users.settings}/preferences`,
      preferences,
      undefined,
      () => this.getMockUpdatePreferencesData(userId, preferences)
    );
  }

  /**
   * Update user settings
   */
  async updateSettings(userId: string, settings: UserSettings): Promise<ApiResponse<User>> {
    return this.makeApiCall(
      'PUT',
      `${apiEndpoints.users.settings}/general`,
      settings,
      undefined,
      () => this.getMockUpdateSettingsData(userId, settings)
    );
  }

  // ==================== Credit Management Methods ====================

  /**
   * Get user credit balance
   */
  async getCredits(userId: string): Promise<ApiResponse<{ credits: number; history: any[] }>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.users.credits,
      undefined,
      { userId },
      () => this.getMockCreditsData(userId)
    );
  }

  /**
   * Update user credits (admin operation)
   */
  async updateCredits(userId: string, amount: number, reason?: string): Promise<ApiResponse<User>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.users.credits,
      { amount, reason },
      { userId },
      () => this.getMockUpdateCreditsData(userId, amount, reason)
    );
  }

  /**
   * Get user transaction history
   */
  async getTransactionHistory(
    userId: string,
    filters?: { dateFrom?: string; dateTo?: string; type?: string }
  ): Promise<PaginatedResponse<any>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.users.transactions,
      undefined,
      { userId, ...filters },
      () => this.getMockTransactionHistoryData(userId, filters)
    );
  }

  // ==================== Account Settings Methods ====================

  /**
   * Get user account settings
   */
  async getAccountSettings(userId: string): Promise<ApiResponse<{ preferences: UserPreferences; settings: UserSettings }>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.users.settings,
      undefined,
      { userId },
      () => this.getMockAccountSettingsData(userId)
    );
  }

  // ==================== Mock Data Methods ====================

  protected async getMockListData(params?: ListRequestParams): Promise<PaginatedResponse<User>> {
    await RepositoryUtils.simulateDelay();
    
    // Mock users list (typically for admin use)
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john@example.com',
        credits: 100,
        cards: [],
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockUsers, {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: mockUsers.length,
    });
  }

  protected async getMockByIdData(id: string): Promise<ApiResponse<User>> {
    await RepositoryUtils.simulateDelay();
    
    const mockUser: User = {
      id,
      email: 'john@example.com',
      credits: 100,
      cards: [],
      fullName: 'John Doe',
      phoneNumber: '+1234567890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'US',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockUser);
  }

  protected async getMockCreateData(data: CreateUserData): Promise<ApiResponse<User>> {
    await RepositoryUtils.simulateDelay();
    
    const mockUser: User = {
      id: RepositoryUtils.generateMockId(),
      ...data,
      cards: [],
      credits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockUser);
  }

  protected async getMockUpdateData(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    await RepositoryUtils.simulateDelay();
    
    const existingUser = await this.getMockByIdData(id);
    const updatedUser: User = {
      ...existingUser.data!,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(updatedUser);
  }

  protected async getMockDeleteData(id: string): Promise<ApiResponse<void>> {
    await RepositoryUtils.simulateDelay();
    return RepositoryUtils.createSuccessResponse(undefined, 'User deleted successfully');
  }

  // ==================== Authentication Mock Data ====================

  private async getMockAuthData(credentials: AuthCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    await RepositoryUtils.simulateDelay();
    
    // Mock authentication validation
    if (credentials.password === 'wrong') {
      throw new Error('Invalid credentials');
    }

    const mockUser: User = {
      id: '1',
      email: credentials.email,
      credits: 100,
      cards: [
        {
          id: '1',
          name: 'Sephiroth',
          rarity: 'legendary',
          price: 100,
          image: 'card-sephiroth.jpg',
          finish: 'foil',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      fullName: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockTokens: AuthTokens = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    };

    return { user: mockUser, tokens: mockTokens };
  }

  private async getMockRegisterData(userData: RegisterData): Promise<RegisterResponse> {
    await RepositoryUtils.simulateDelay();
    
    const userId = RepositoryUtils.generateMockId();
    const createdAt = new Date().toISOString();
    
    const registerResponse: RegisterResponse = {
      user: {
        id: userId,
        email: userData.email,
        created_at: createdAt,
      },
      profile: {
        id: userId,
        username: userData.username,
      },
      message: "User and profile registered successfully. Please login to get access token."
    };

    return registerResponse;
  }

  private async getMockVerifyData(verificationData: VerificationData): Promise<{ verified: boolean }> {
    await RepositoryUtils.simulateDelay();
    
    // Mock verification - accept '123456'
    const verified = verificationData.code === '123456';
    if (!verified) {
      throw new Error('Invalid verification code');
    }

    return { verified };
  }

  private async getMockRefreshData(refreshToken: string): Promise<AuthTokens> {
    await RepositoryUtils.simulateDelay();
    
    return {
      accessToken: 'new_mock_access_token',
      refreshToken: 'new_mock_refresh_token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }

  private async getMockLogoutData(): Promise<void> {
    await RepositoryUtils.simulateDelay();
    // Mock logout - no return value needed
  }

  // ==================== Profile Management Mock Data ====================

  private async getMockUpdateShippingData(userId: string, address: ShippingAddress): Promise<User> {
    await RepositoryUtils.simulateDelay();
    
    const existingUser = await this.getMockByIdData(userId);
    return {
      ...existingUser.data!,
      address: address.addressLine1,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phoneNumber: address.phoneNumber || existingUser.data!.phoneNumber,
      updatedAt: new Date().toISOString(),
    };
  }

  private async getMockUpdatePreferencesData(userId: string, preferences: UserPreferences): Promise<User> {
    await RepositoryUtils.simulateDelay();
    
    const existingUser = await this.getMockByIdData(userId);
    return {
      ...existingUser.data!,
      preferences,
      updatedAt: new Date().toISOString(),
    };
  }

  private async getMockUpdateSettingsData(userId: string, settings: UserSettings): Promise<User> {
    await RepositoryUtils.simulateDelay();
    
    const existingUser = await this.getMockByIdData(userId);
    return {
      ...existingUser.data!,
      settings,
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== Credit Management Mock Data ====================

  private async getMockCreditsData(userId: string): Promise<{ credits: number; history: any[] }> {
    await RepositoryUtils.simulateDelay();
    
    return {
      credits: 100,
      history: [
        {
          id: '1',
          amount: 100,
          type: 'welcome_bonus',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  private async getMockUpdateCreditsData(userId: string, amount: number, reason?: string): Promise<User> {
    await RepositoryUtils.simulateDelay();
    
    const existingUser = await this.getMockByIdData(userId);
    return {
      ...existingUser.data!,
      credits: existingUser.data!.credits + amount,
      updatedAt: new Date().toISOString(),
    };
  }

  private async getMockTransactionHistoryData(
    userId: string,
    filters?: any
  ): Promise<PaginatedResponse<any>> {
    await RepositoryUtils.simulateDelay();
    
    const mockTransactions = [
      {
        id: '1',
        type: 'credit_purchase',
        amount: 100,
        status: 'completed',
        timestamp: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockTransactions, {
      page: 1,
      limit: 10,
      total: mockTransactions.length,
    });
  }

  private async getMockAccountSettingsData(userId: string): Promise<{ preferences: UserPreferences; settings: UserSettings }> {
    await RepositoryUtils.simulateDelay();
    
    return {
      preferences: {
        packRecommendations: true,
        emailNotifications: true,
        smsNotifications: false,
        autoConvertExpiredCards: false,
        preferredCategories: ['Magic: The Gathering', 'Pokemon'],
        currency: 'USD',
        language: 'en',
      },
      settings: {
        twoFactorEnabled: false,
        autoShipThreshold: 10,
        defaultShippingMethod: 'standard',
        privacyLevel: 'private',
      },
    };
  }
}

// Export singleton instance
export const userRepository = new UserRepository();