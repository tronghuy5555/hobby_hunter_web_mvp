/**
 * Card Repository
 * 
 * Handles card collection management, shipping, trading operations, and market data.
 * Provides comprehensive card-related functionality with mock data fallback.
 */

import { BaseRepository, RepositoryUtils } from './BaseRepository';
import { apiEndpoints } from '../api/config';
import { mockTopCards } from '@/lib/store';
import type {
  Card,
  CardCollectionParams,
  CardFilters,
  ShipCardsRequest,
  SellCardRequest,
  ConvertCardsRequest,
  MarketData,
  ShipmentTracker,
  CreateCardData,
  UpdateCardData,
} from '../types/domain';
import type {
  ApiResponse,
  PaginatedResponse,
  ListRequestParams,
} from '../api/types';

/**
 * Card repository for collection management and marketplace operations
 */
export class CardRepository extends BaseRepository<Card> {
  constructor() {
    super({
      baseEndpoint: apiEndpoints.cards.collection,
      featureFlag: 'useApiForCards',
      mockFallback: true,
    });
  }

  /**
   * Transform request data for API
   */
  protected transformRequest(data: any): any {
    // Convert UI filter format to API format
    if (data.filters) {
      return {
        ...data,
        rarity: data.filters.rarity,
        finish: data.filters.finish,
        price_min: data.filters.priceMin,
        price_max: data.filters.priceMax,
        set_name: data.filters.setName,
        search: data.filters.search,
      };
    }
    return data;
  }

  /**
   * Transform API response to UI format
   */
  protected transformResponse(data: any): Card {
    // Convert API format to UI format
    return {
      ...data,
      // Ensure required fields have defaults
      finish: data.finish || 'normal',
      status: data.status || 'active',
    };
  }

  // ==================== Collection Management Methods ====================

  /**
   * Get user's card collection with filters
   */
  async getUserCards(userId: string, filters?: CardFilters): Promise<PaginatedResponse<Card>> {
    const params: CardCollectionParams = {
      userId,
      filters,
    };

    return this.makeApiCall(
      'GET',
      apiEndpoints.cards.collection,
      undefined,
      params,
      () => this.getMockUserCardsData(userId, filters)
    );
  }

  /**
   * Get detailed card information including market data
   */
  async getCardDetails(cardId: string): Promise<ApiResponse<Card & { marketData?: MarketData }>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.cards.details, { id: cardId }),
      undefined,
      undefined,
      () => this.getMockCardDetailsData(cardId)
    );
  }

  /**
   * Get market value and data for a card
   */
  async getCardMarketValue(cardId: string): Promise<ApiResponse<MarketData>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.cards.market, { id: cardId }),
      undefined,
      undefined,
      () => this.getMockMarketData(cardId)
    );
  }

  /**
   * Search cards with advanced criteria
   */
  async searchCards(criteria: CardFilters & { query?: string }): Promise<PaginatedResponse<Card>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.cards.search,
      undefined,
      this.transformRequest({ filters: criteria }),
      () => this.getMockSearchCardsData(criteria)
    );
  }

  /**
   * Get cards nearing expiration for a user
   */
  async getExpiringCards(userId: string, daysThreshold: number = 30): Promise<PaginatedResponse<Card>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.cards.expiring,
      undefined,
      { userId, daysThreshold },
      () => this.getMockExpiringCardsData(userId, daysThreshold)
    );
  }

  // ==================== Card Status Management ====================

  /**
   * Update card status (e.g., shipped, expired, converted)
   */
  async updateCardStatus(cardId: string, status: Card['status']): Promise<ApiResponse<Card>> {
    return this.makeApiCall(
      'PATCH',
      this.buildUrl(apiEndpoints.cards.details, { id: cardId }),
      { status },
      undefined,
      () => this.getMockUpdateStatusData(cardId, status)
    );
  }

  /**
   * Convert expired cards to credits
   */
  async convertCardsToCredits(request: ConvertCardsRequest): Promise<ApiResponse<{ convertedCards: Card[]; creditsEarned: number }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.cards.convert,
      request,
      undefined,
      () => this.getMockConvertCardsData(request)
    );
  }

  // ==================== Shipping Methods ====================

  /**
   * Request physical shipping for cards
   */
  async shipCards(request: ShipCardsRequest): Promise<ApiResponse<{ shipment: ShipmentTracker; estimatedCost: number }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.cards.ship,
      request,
      undefined,
      () => this.getMockShipCardsData(request)
    );
  }

  /**
   * Get shipping status for cards
   */
  async getShippingStatus(shipmentId: string): Promise<ApiResponse<ShipmentTracker>> {
    return this.makeApiCall(
      'GET',
      `/cards/shipments/${shipmentId}`,
      undefined,
      undefined,
      () => this.getMockShippingStatusData(shipmentId)
    );
  }

  // ==================== Marketplace Methods ====================

  /**
   * List a card for sale on the marketplace
   */
  async sellCard(request: SellCardRequest): Promise<ApiResponse<{ listingId: string; card: Card }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.cards.sell,
      request,
      undefined,
      () => this.getMockSellCardData(request)
    );
  }

  /**
   * Get card ownership and transaction history
   */
  async getCardHistory(cardId: string): Promise<PaginatedResponse<any>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.cards.history, { id: cardId }),
      undefined,
      undefined,
      () => this.getMockCardHistoryData(cardId)
    );
  }

  // ==================== Analytics Methods ====================

  /**
   * Get popular/trending cards
   */
  async getTopCards(category?: string, timeframe: string = '24h'): Promise<PaginatedResponse<Card>> {
    return this.makeApiCall(
      'GET',
      '/cards/trending',
      undefined,
      { category, timeframe },
      () => this.getMockTopCardsData(category, timeframe)
    );
  }

  /**
   * Get card recommendations for a user
   */
  async getCardRecommendations(userId: string): Promise<PaginatedResponse<Card>> {
    return this.makeApiCall(
      'GET',
      '/cards/recommendations',
      undefined,
      { userId },
      () => this.getMockRecommendationsData(userId)
    );
  }

  // ==================== Mock Data Methods ====================

  protected async getMockListData(params?: ListRequestParams): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const mockCards: Card[] = mockTopCards.map(card => ({
      ...card,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return RepositoryUtils.createPaginatedResponse(mockCards, {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: mockCards.length,
    });
  }

  protected async getMockByIdData(id: string): Promise<ApiResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const mockCard: Card = {
      id,
      name: 'Sephiroth',
      rarity: 'legendary',
      price: 100,
      image: 'card-sephiroth.jpg',
      finish: 'foil',
      description: 'Legendary antagonist from Final Fantasy VII',
      setName: 'Final Fantasy Collection',
      cardNumber: '001',
      artist: 'Yoshitaka Amano',
      marketValue: 120,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockCard);
  }

  protected async getMockCreateData(data: CreateCardData): Promise<ApiResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const mockCard: Card = {
      id: RepositoryUtils.generateMockId(),
      ...data,
      finish: data.finish || 'normal',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockCard);
  }

  protected async getMockUpdateData(id: string, data: UpdateCardData): Promise<ApiResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const existingCard = await this.getMockByIdData(id);
    const updatedCard: Card = {
      ...existingCard.data!,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(updatedCard);
  }

  protected async getMockDeleteData(id: string): Promise<ApiResponse<void>> {
    await RepositoryUtils.simulateDelay();
    return RepositoryUtils.createSuccessResponse(undefined, 'Card deleted successfully');
  }

  // ==================== Collection Management Mock Data ====================

  private async getMockUserCardsData(userId: string, filters?: CardFilters): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    let mockCards: Card[] = [
      {
        id: '1',
        name: 'Sephiroth',
        rarity: 'legendary',
        price: 100,
        image: 'card-sephiroth.jpg',
        finish: 'foil',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Cloud Strife',
        rarity: 'epic',
        price: 80,
        image: 'card-cloud.jpg',
        finish: 'reverse-foil',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Bahamut',
        rarity: 'legendary',
        price: 120,
        image: 'card-bahamut.jpg',
        finish: 'foil',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply filters if provided
    if (filters) {
      if (filters.rarity) {
        mockCards = mockCards.filter(card => filters.rarity!.includes(card.rarity));
      }
      if (filters.finish) {
        mockCards = mockCards.filter(card => card.finish && filters.finish!.includes(card.finish));
      }
      if (filters.priceMin) {
        mockCards = mockCards.filter(card => card.price >= filters.priceMin!);
      }
      if (filters.priceMax) {
        mockCards = mockCards.filter(card => card.price <= filters.priceMax!);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        mockCards = mockCards.filter(card => 
          card.name.toLowerCase().includes(searchLower) ||
          card.setName?.toLowerCase().includes(searchLower)
        );
      }
    }

    return RepositoryUtils.createPaginatedResponse(mockCards, {
      page: 1,
      limit: 10,
      total: mockCards.length,
    });
  }

  private async getMockCardDetailsData(cardId: string): Promise<Card & { marketData?: MarketData }> {
    await RepositoryUtils.simulateDelay();
    
    const baseCard = await this.getMockByIdData(cardId);
    const marketData: MarketData = {
      cardId,
      currentPrice: 120,
      averagePrice: 115,
      priceHistory: [
        { timestamp: new Date(Date.now() - 86400000).toISOString(), price: 110, volume: 5 },
        { timestamp: new Date().toISOString(), price: 120, volume: 3 },
      ],
      volume24h: 8,
      priceChange24h: 10,
      lastUpdated: new Date().toISOString(),
    };

    return {
      ...baseCard.data!,
      marketData,
    };
  }

  private async getMockMarketData(cardId: string): Promise<MarketData> {
    await RepositoryUtils.simulateDelay();
    
    return {
      cardId,
      currentPrice: 120,
      averagePrice: 115,
      priceHistory: [
        { timestamp: new Date(Date.now() - 86400000).toISOString(), price: 110, volume: 5 },
        { timestamp: new Date().toISOString(), price: 120, volume: 3 },
      ],
      volume24h: 8,
      priceChange24h: 10,
      lastUpdated: new Date().toISOString(),
    };
  }

  private async getMockSearchCardsData(criteria: CardFilters & { query?: string }): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    // Use existing user cards mock but filter by criteria
    return this.getMockUserCardsData('mock_user', criteria);
  }

  private async getMockExpiringCardsData(userId: string, daysThreshold: number): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const expiringDate = new Date();
    expiringDate.setDate(expiringDate.getDate() + daysThreshold);

    const mockExpiringCards: Card[] = [
      {
        id: '4',
        name: 'Tifa Lockhart',
        rarity: 'rare',
        price: 60,
        image: 'card-tifa.jpg',
        finish: 'normal',
        status: 'active',
        expirationDate: expiringDate.toISOString(),
        isExpiring: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockExpiringCards, {
      page: 1,
      limit: 10,
      total: mockExpiringCards.length,
    });
  }

  // ==================== Status Management Mock Data ====================

  private async getMockUpdateStatusData(cardId: string, status: Card['status']): Promise<Card> {
    await RepositoryUtils.simulateDelay();
    
    const existingCard = await this.getMockByIdData(cardId);
    return {
      ...existingCard.data!,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  private async getMockConvertCardsData(request: ConvertCardsRequest): Promise<{ convertedCards: Card[]; creditsEarned: number }> {
    await RepositoryUtils.simulateDelay();
    
    const convertedCards: Card[] = request.cardIds.map(id => ({
      id,
      name: 'Converted Card',
      rarity: 'common' as const,
      price: 10,
      image: 'card-placeholder.jpg',
      finish: 'normal' as const,
      status: 'converted' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const creditsEarned = convertedCards.reduce((total, card) => total + card.price, 0);

    return { convertedCards, creditsEarned };
  }

  // ==================== Shipping Mock Data ====================

  private async getMockShipCardsData(request: ShipCardsRequest): Promise<{ shipment: ShipmentTracker; estimatedCost: number }> {
    await RepositoryUtils.simulateDelay();
    
    const shipment: ShipmentTracker = {
      id: RepositoryUtils.generateMockId(),
      trackingNumber: `TRK${Date.now()}`,
      carrier: 'FedEx',
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
      events: [
        {
          timestamp: new Date().toISOString(),
          status: 'pending',
          description: 'Shipment created',
        },
      ],
    };

    const estimatedCost = request.shippingMethod === 'express' ? 25 : 
                         request.shippingMethod === 'overnight' ? 50 : 10;

    return { shipment, estimatedCost };
  }

  private async getMockShippingStatusData(shipmentId: string): Promise<ShipmentTracker> {
    await RepositoryUtils.simulateDelay();
    
    return {
      id: shipmentId,
      trackingNumber: `TRK${Date.now()}`,
      carrier: 'FedEx',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      events: [
        {
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
          description: 'Shipment created',
        },
        {
          timestamp: new Date().toISOString(),
          status: 'in_transit',
          location: 'Distribution Center',
          description: 'Package in transit',
        },
      ],
    };
  }

  // ==================== Marketplace Mock Data ====================

  private async getMockSellCardData(request: SellCardRequest): Promise<{ listingId: string; card: Card }> {
    await RepositoryUtils.simulateDelay();
    
    const card = await this.getMockByIdData(request.cardId);
    
    return {
      listingId: RepositoryUtils.generateMockId(),
      card: {
        ...card.data!,
        price: request.price,
        status: 'active',
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private async getMockCardHistoryData(cardId: string): Promise<PaginatedResponse<any>> {
    await RepositoryUtils.simulateDelay();
    
    const mockHistory = [
      {
        id: '1',
        type: 'pack_opening',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: 'Card obtained from pack opening',
      },
      {
        id: '2',
        type: 'price_update',
        timestamp: new Date().toISOString(),
        description: 'Market price updated',
        oldPrice: 100,
        newPrice: 120,
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockHistory, {
      page: 1,
      limit: 10,
      total: mockHistory.length,
    });
  }

  // ==================== Analytics Mock Data ====================

  private async getMockTopCardsData(category?: string, timeframe: string = '24h'): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const topCards: Card[] = mockTopCards.map(card => ({
      ...card,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return RepositoryUtils.createPaginatedResponse(topCards, {
      page: 1,
      limit: 10,
      total: topCards.length,
    });
  }

  private async getMockRecommendationsData(userId: string): Promise<PaginatedResponse<Card>> {
    await RepositoryUtils.simulateDelay();
    
    const recommendedCards: Card[] = [
      {
        id: '5',
        name: 'Aerith Gainsborough',
        rarity: 'epic',
        price: 90,
        image: 'card-aerith.jpg',
        finish: 'foil',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(recommendedCards, {
      page: 1,
      limit: 10,
      total: recommendedCards.length,
    });
  }
}

// Export singleton instance
export const cardRepository = new CardRepository();