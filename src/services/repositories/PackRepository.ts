/**
 * Pack Repository
 * 
 * Handles pack catalog, purchasing, opening mechanics, and pack-related operations.
 * Provides comprehensive pack functionality with mock data fallback.
 */

import { BaseRepository, RepositoryUtils } from './BaseRepository';
import { apiEndpoints } from '../api/config';
import { mockPacks } from '@/lib/store';
import type {
  Pack,
  Card,
  PackPurchaseRequest,
  PackOpenRequest,
  PackOpeningResult,
  PackRecommendation,
  CreatePackData,
  UpdatePackData,
} from '../types/domain';
import type {
  ApiResponse,
  PaginatedResponse,
  ListRequestParams,
} from '../api/types';

/**
 * Pack repository for catalog and pack operations
 */
export class PackRepository extends BaseRepository<Pack> {
  constructor() {
    super({
      baseEndpoint: apiEndpoints.packs.catalog,
      featureFlag: 'useApiForPacks',
      mockFallback: true,
    });
  }

  /**
   * Transform request data for API
   */
  protected transformRequest(data: any): any {
    // Convert UI format to API format
    if (data.cardCount) {
      return {
        ...data,
        card_count: data.cardCount,
      };
    }
    return data;
  }

  /**
   * Transform API response to UI format
   */
  protected transformResponse(data: any): Pack {
    // Convert API format to UI format
    return {
      ...data,
      cardCount: data.card_count || data.cardCount,
      isAvailable: data.is_available !== false,
    };
  }

  // ==================== Pack Catalog Methods ====================

  /**
   * Get available packs catalog
   */
  async getAvailablePacks(filters?: { category?: string; priceMin?: number; priceMax?: number }): Promise<PaginatedResponse<Pack>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.packs.catalog,
      undefined,
      filters,
      () => this.getMockAvailablePacksData(filters)
    );
  }

  /**
   * Get detailed pack information including statistics
   */
  async getPackDetails(packId: string): Promise<ApiResponse<Pack & { statistics?: any }>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.packs.details, { id: packId }),
      undefined,
      undefined,
      () => this.getMockPackDetailsData(packId)
    );
  }

  /**
   * Get pack statistics (odds, expected value, etc.)
   */
  async getPackStatistics(packId: string): Promise<ApiResponse<{
    odds: Record<string, number>;
    expectedValue: number;
    averageCardsPerRarity: Record<string, number>;
    popularityScore: number;
  }>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.packs.statistics, { id: packId }),
      undefined,
      undefined,
      () => this.getMockPackStatisticsData(packId)
    );
  }

  // ==================== Pack Purchase Methods ====================

  /**
   * Purchase pack(s)
   */
  async purchasePack(request: PackPurchaseRequest): Promise<ApiResponse<{
    transaction: any;
    packs: string[];
    totalCost: number;
    creditsRemaining: number;
  }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.packs.purchase,
      request,
      undefined,
      () => this.getMockPurchasePackData(request)
    );
  }

  /**
   * Validate pack purchase before processing
   */
  async validatePackPurchase(packId: string, userId: string, quantity: number = 1): Promise<ApiResponse<{
    valid: boolean;
    totalCost: number;
    userCredits: number;
    packAvailable: boolean;
    errors?: string[];
  }>> {
    return this.makeApiCall(
      'POST',
      '/packs/validate-purchase',
      { packId, userId, quantity },
      undefined,
      () => this.getMockValidatePackPurchaseData(packId, userId, quantity)
    );
  }

  // ==================== Pack Opening Methods ====================

  /**
   * Open a pack and generate cards
   */
  async openPack(request: PackOpenRequest): Promise<ApiResponse<PackOpeningResult>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.packs.open,
      request,
      undefined,
      () => this.getMockOpenPackData(request)
    );
  }

  /**
   * Get pack opening session details
   */
  async getPackOpening(openingId: string): Promise<ApiResponse<PackOpeningResult>> {
    return this.makeApiCall(
      'GET',
      `/packs/openings/${openingId}`,
      undefined,
      undefined,
      () => this.getMockPackOpeningData(openingId)
    );
  }

  // ==================== User Pack History ====================

  /**
   * Get user's pack purchase history
   */
  async getPackHistory(
    userId: string,
    filters?: { dateFrom?: string; dateTo?: string; packType?: string }
  ): Promise<PaginatedResponse<{
    id: string;
    packId: string;
    packName: string;
    purchaseDate: string;
    price: number;
    status: 'purchased' | 'opened' | 'expired';
    cards?: Card[];
  }>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.packs.history,
      undefined,
      { userId, ...filters },
      () => this.getMockPackHistoryData(userId, filters)
    );
  }

  // ==================== Pack Recommendations ====================

  /**
   * Get personalized pack recommendations for user
   */
  async getPackRecommendations(userId: string): Promise<PaginatedResponse<PackRecommendation>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.packs.recommendations,
      undefined,
      { userId },
      () => this.getMockPackRecommendationsData(userId)
    );
  }

  /**
   * Get trending/popular packs
   */
  async getTrendingPacks(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<PaginatedResponse<Pack & { trendingScore: number }>> {
    return this.makeApiCall(
      'GET',
      '/packs/trending',
      undefined,
      { timeframe },
      () => this.getMockTrendingPacksData(timeframe)
    );
  }

  // ==================== Pack Administration (if needed) ====================

  /**
   * Create new pack (admin operation)
   */
  async createPack(packData: CreatePackData): Promise<ApiResponse<Pack>> {
    return this.create(packData);
  }

  /**
   * Update pack information (admin operation)
   */
  async updatePack(packId: string, packData: UpdatePackData): Promise<ApiResponse<Pack>> {
    return this.update(packId, packData);
  }

  /**
   * Update pack availability/stock
   */
  async updatePackAvailability(packId: string, isAvailable: boolean, stock?: number): Promise<ApiResponse<Pack>> {
    return this.makeApiCall(
      'PATCH',
      this.buildUrl(apiEndpoints.packs.details, { id: packId }),
      { isAvailable, stock },
      undefined,
      () => this.getMockUpdateAvailabilityData(packId, isAvailable, stock)
    );
  }

  // ==================== Mock Data Methods ====================

  protected async getMockListData(params?: ListRequestParams): Promise<PaginatedResponse<Pack>> {
    await RepositoryUtils.simulateDelay();
    
    const mockPacksWithDates: Pack[] = mockPacks.map(pack => ({
      ...pack,
      isAvailable: true,
      stock: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return RepositoryUtils.createPaginatedResponse(mockPacksWithDates, {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: mockPacksWithDates.length,
    });
  }

  protected async getMockByIdData(id: string): Promise<ApiResponse<Pack>> {
    await RepositoryUtils.simulateDelay();
    
    const foundPack = mockPacks.find(pack => pack.id === id);
    if (!foundPack) {
      throw new Error('Pack not found');
    }

    const mockPack: Pack = {
      ...foundPack,
      isAvailable: true,
      stock: 50,
      odds: {
        common: 0.6,
        rare: 0.25,
        epic: 0.12,
        legendary: 0.03,
      },
      releaseDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockPack);
  }

  protected async getMockCreateData(data: CreatePackData): Promise<ApiResponse<Pack>> {
    await RepositoryUtils.simulateDelay();
    
    const mockPack: Pack = {
      id: RepositoryUtils.generateMockId(),
      ...data,
      isAvailable: true,
      stock: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockPack);
  }

  protected async getMockUpdateData(id: string, data: UpdatePackData): Promise<ApiResponse<Pack>> {
    await RepositoryUtils.simulateDelay();
    
    const existingPack = await this.getMockByIdData(id);
    const updatedPack: Pack = {
      ...existingPack.data!,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(updatedPack);
  }

  protected async getMockDeleteData(id: string): Promise<ApiResponse<void>> {
    await RepositoryUtils.simulateDelay();
    return RepositoryUtils.createSuccessResponse(undefined, 'Pack deleted successfully');
  }

  // ==================== Pack Catalog Mock Data ====================

  private async getMockAvailablePacksData(filters?: any): Promise<PaginatedResponse<Pack>> {
    await RepositoryUtils.simulateDelay();
    
    let availablePacks = mockPacks.map(pack => ({
      ...pack,
      isAvailable: true,
      stock: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Apply filters
    if (filters) {
      if (filters.priceMin) {
        availablePacks = availablePacks.filter(pack => pack.price >= filters.priceMin);
      }
      if (filters.priceMax) {
        availablePacks = availablePacks.filter(pack => pack.price <= filters.priceMax);
      }
      if (filters.category) {
        availablePacks = availablePacks.filter(pack => 
          pack.name.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
    }

    return RepositoryUtils.createPaginatedResponse(availablePacks, {
      page: 1,
      limit: 10,
      total: availablePacks.length,
    });
  }

  private async getMockPackDetailsData(packId: string): Promise<Pack & { statistics?: any }> {
    await RepositoryUtils.simulateDelay();
    
    const basePack = await this.getMockByIdData(packId);
    const statistics = {
      totalSold: Math.floor(Math.random() * 1000) + 100,
      averageRating: 4.2 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      lastPurchased: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    };

    return {
      ...basePack.data!,
      statistics,
    };
  }

  private async getMockPackStatisticsData(packId: string): Promise<{
    odds: Record<string, number>;
    expectedValue: number;
    averageCardsPerRarity: Record<string, number>;
    popularityScore: number;
  }> {
    await RepositoryUtils.simulateDelay();
    
    return {
      odds: {
        common: 0.6,
        rare: 0.25,
        epic: 0.12,
        legendary: 0.03,
      },
      expectedValue: 35.5,
      averageCardsPerRarity: {
        common: 9,
        rare: 3.75,
        epic: 1.8,
        legendary: 0.45,
      },
      popularityScore: 8.7,
    };
  }

  // ==================== Purchase Mock Data ====================

  private async getMockPurchasePackData(request: PackPurchaseRequest): Promise<{
    transaction: any;
    packs: string[];
    totalCost: number;
    creditsRemaining: number;
  }> {
    await RepositoryUtils.simulateDelay();
    
    const pack = await this.getMockByIdData(request.packId);
    const totalCost = pack.data!.price * request.quantity;
    
    // Generate pack instances
    const packs = Array.from({ length: request.quantity }, () => 
      RepositoryUtils.generateMockId()
    );

    return {
      transaction: {
        id: RepositoryUtils.generateMockId(),
        type: 'pack_purchase',
        amount: totalCost,
        status: 'completed',
        timestamp: new Date().toISOString(),
      },
      packs,
      totalCost,
      creditsRemaining: 100 - totalCost, // Mock remaining credits
    };
  }

  private async getMockValidatePackPurchaseData(
    packId: string, 
    userId: string, 
    quantity: number
  ): Promise<{
    valid: boolean;
    totalCost: number;
    userCredits: number;
    packAvailable: boolean;
    errors?: string[];
  }> {
    await RepositoryUtils.simulateDelay();
    
    const pack = await this.getMockByIdData(packId);
    const totalCost = pack.data!.price * quantity;
    const userCredits = 100; // Mock user credits
    const packAvailable = pack.data!.isAvailable && (pack.data!.stock || 0) >= quantity;

    const errors: string[] = [];
    if (!packAvailable) {
      errors.push('Pack is not available or insufficient stock');
    }
    if (userCredits < totalCost) {
      errors.push('Insufficient credits');
    }

    return {
      valid: errors.length === 0,
      totalCost,
      userCredits,
      packAvailable,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // ==================== Opening Mock Data ====================

  private async getMockOpenPackData(request: PackOpenRequest): Promise<PackOpeningResult> {
    await RepositoryUtils.simulateDelay(1000, 2000); // Longer delay for pack opening
    
    const pack = await this.getMockByIdData(request.packId);
    
    // Generate random cards based on pack type
    const generatedCards: Card[] = this.generateRandomCards(pack.data!.cardCount);

    return {
      packId: request.packId,
      openingId: request.openingId || RepositoryUtils.generateMockId(),
      cards: generatedCards,
      timestamp: new Date().toISOString(),
      animation: {
        sequence: ['reveal', 'flip', 'glow'],
        duration: 3000,
      },
    };
  }

  private async getMockPackOpeningData(openingId: string): Promise<PackOpeningResult> {
    await RepositoryUtils.simulateDelay();
    
    const generatedCards = this.generateRandomCards(15);

    return {
      packId: '1',
      openingId,
      cards: generatedCards,
      timestamp: new Date().toISOString(),
      animation: {
        sequence: ['reveal', 'flip', 'glow'],
        duration: 3000,
      },
    };
  }

  private generateRandomCards(count: number): Card[] {
    const rarities: Array<{ type: Card['rarity']; weight: number }> = [
      { type: 'common', weight: 60 },
      { type: 'rare', weight: 25 },
      { type: 'epic', weight: 12 },
      { type: 'legendary', weight: 3 },
    ];

    const cards: Card[] = [];
    
    for (let i = 0; i < count; i++) {
      const random = Math.random() * 100;
      let cumulativeWeight = 0;
      let selectedRarity: Card['rarity'] = 'common';

      for (const { type, weight } of rarities) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) {
          selectedRarity = type;
          break;
        }
      }

      const mockCardNames = [
        'Sephiroth', 'Cloud Strife', 'Bahamut', 'Tifa Lockhart', 'Aerith Gainsborough',
        'Lightning', 'Noctis', 'Terra Branford', 'Cecil Harvey', 'Squall Leonhart'
      ];

      const cardName = mockCardNames[Math.floor(Math.random() * mockCardNames.length)];
      const basePrice = selectedRarity === 'legendary' ? 100 : 
                       selectedRarity === 'epic' ? 50 :
                       selectedRarity === 'rare' ? 20 : 5;

      cards.push({
        id: RepositoryUtils.generateMockId(),
        name: cardName,
        rarity: selectedRarity,
        price: basePrice + Math.floor(Math.random() * 20),
        image: `card-${cardName.toLowerCase().replace(' ', '-')}.jpg`,
        finish: Math.random() > 0.8 ? 'foil' : 'normal',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return cards;
  }

  // ==================== History Mock Data ====================

  private async getMockPackHistoryData(
    userId: string,
    filters?: any
  ): Promise<PaginatedResponse<any>> {
    await RepositoryUtils.simulateDelay();
    
    const mockHistory = [
      {
        id: '1',
        packId: '1',
        packName: 'Final Fantasy (Magic: The Gathering)',
        purchaseDate: new Date(Date.now() - 86400000).toISOString(),
        price: 25,
        status: 'opened' as const,
        cards: this.generateRandomCards(3),
      },
      {
        id: '2',
        packId: '2',
        packName: 'Pokemon (Battle Styles)',
        purchaseDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        price: 4,
        status: 'purchased' as const,
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockHistory, {
      page: 1,
      limit: 10,
      total: mockHistory.length,
    });
  }

  // ==================== Recommendations Mock Data ====================

  private async getMockPackRecommendationsData(userId: string): Promise<PaginatedResponse<PackRecommendation>> {
    await RepositoryUtils.simulateDelay();
    
    const recommendations: PackRecommendation[] = mockPacks.slice(0, 3).map(pack => ({
      pack: {
        ...pack,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      score: 0.8 + Math.random() * 0.2,
      reason: 'Based on your collection preferences',
      expectedValue: pack.price * 1.2,
    }));

    return RepositoryUtils.createPaginatedResponse(recommendations, {
      page: 1,
      limit: 10,
      total: recommendations.length,
    });
  }

  private async getMockTrendingPacksData(timeframe: string): Promise<PaginatedResponse<Pack & { trendingScore: number }>> {
    await RepositoryUtils.simulateDelay();
    
    const trendingPacks = mockPacks.map(pack => ({
      ...pack,
      trendingScore: 7 + Math.random() * 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return RepositoryUtils.createPaginatedResponse(trendingPacks, {
      page: 1,
      limit: 10,
      total: trendingPacks.length,
    });
  }

  // ==================== Administration Mock Data ====================

  private async getMockUpdateAvailabilityData(
    packId: string,
    isAvailable: boolean,
    stock?: number
  ): Promise<Pack> {
    await RepositoryUtils.simulateDelay();
    
    const existingPack = await this.getMockByIdData(packId);
    return {
      ...existingPack.data!,
      isAvailable,
      stock: stock !== undefined ? stock : existingPack.data!.stock,
      updatedAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const packRepository = new PackRepository();