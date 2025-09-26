/**
 * Domain Entity Types
 * 
 * TypeScript interfaces for all domain entities used throughout the application.
 * These types ensure consistency between API responses, database models, and UI components.
 * Based on existing store types but extended for API integration.
 */

import type { BaseEntity } from './BaseRepository';

/**
 * Card entity interface
 */
export interface Card extends BaseEntity {
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  image: string;
  finish?: 'normal' | 'foil' | 'reverse-foil';
  description?: string;
  setName?: string;
  cardNumber?: string;
  artist?: string;
  expirationDate?: string;
  marketValue?: number;
  isExpiring?: boolean;
  status?: 'active' | 'shipped' | 'expired' | 'converted';
}

/**
 * Pack entity interface
 */
export interface Pack extends BaseEntity {
  name: string;
  description: string;
  price: number;
  image: string;
  cardCount: number;
  guaranteed?: string;
  setName?: string;
  packType?: string;
  isAvailable?: boolean;
  stock?: number;
  odds?: Record<string, number>;
  releaseDate?: string;
}

/**
 * User entity interface
 */
export interface User extends BaseEntity {
  email: string;
  credits: number;
  cards: Card[];
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  preferences?: UserPreferences;
  settings?: UserSettings;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  status?: 'active' | 'suspended' | 'pending';
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  packRecommendations?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  autoConvertExpiredCards?: boolean;
  preferredCategories?: string[];
  currency?: string;
  language?: string;
}

/**
 * User settings interface
 */
export interface UserSettings {
  twoFactorEnabled?: boolean;
  autoShipThreshold?: number;
  defaultShippingMethod?: string;
  privacyLevel?: 'public' | 'friends' | 'private';
}

/**
 * Transaction entity interface
 */
export interface Transaction extends BaseEntity {
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  reference?: string;
  paymentMethod?: string;
  paymentId?: string;
  metadata?: Record<string, any>;
  processedAt?: string;
  failureReason?: string;
}

/**
 * Transaction types
 */
export type TransactionType =
  | 'credit_purchase'
  | 'pack_purchase'
  | 'card_sale'
  | 'shipping_fee'
  | 'refund'
  | 'card_conversion'
  | 'bonus_credit';

/**
 * Transaction statuses
 */
export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

/**
 * Authentication-related types
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface VerificationData {
  email: string;
  code: string;
}

/**
 * Card-related request/response types
 */
export interface CardFilters {
  rarity?: Card['rarity'][];
  finish?: Card['finish'][];
  priceMin?: number;
  priceMax?: number;
  setName?: string;
  search?: string;
  status?: Card['status'][];
  isExpiring?: boolean;
}

export interface CardCollectionParams {
  userId: string;
  filters?: CardFilters;
  sortBy?: 'name' | 'rarity' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ShipCardsRequest {
  cardIds: string[];
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express' | 'overnight';
  notes?: string;
}

export interface SellCardRequest {
  cardId: string;
  price: number;
  notes?: string;
}

export interface ConvertCardsRequest {
  cardIds: string[];
  reason?: string;
}

/**
 * Pack-related request/response types
 */
export interface PackPurchaseRequest {
  packId: string;
  quantity: number;
  paymentMethod?: string;
}

export interface PackOpenRequest {
  packId: string;
  openingId?: string;
}

export interface PackOpeningResult {
  packId: string;
  openingId: string;
  cards: Card[];
  timestamp: string;
  animation?: {
    sequence: string[];
    duration: number;
  };
}

export interface PackRecommendation {
  pack: Pack;
  score: number;
  reason: string;
  expectedValue: number;
}

/**
 * Transaction-related request/response types
 */
export interface CreditPurchaseRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodId?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
}

/**
 * Shipping-related types
 */
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  trackingIncluded: boolean;
}

export interface ShipmentTracker {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: ShipmentEvent[];
}

export type ShipmentStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface ShipmentEvent {
  timestamp: string;
  status: ShipmentStatus;
  location?: string;
  description: string;
}

/**
 * Market and analytics types
 */
export interface MarketData {
  cardId: string;
  currentPrice: number;
  averagePrice: number;
  priceHistory: PricePoint[];
  volume24h: number;
  priceChange24h: number;
  lastUpdated: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  totalCost: number;
  rarityBreakdown: Record<Card['rarity'], number>;
  topCards: Card[];
  performance: {
    gain: number;
    gainPercentage: number;
    period: string;
  };
}

/**
 * Search and filter types
 */
export interface SearchRequest {
  query: string;
  type?: 'cards' | 'packs' | 'all';
  filters?: Record<string, any>;
  limit?: number;
  page?: number;
}

export interface SearchResult<T = any> {
  items: T[];
  total: number;
  facets?: Record<string, SearchFacet[]>;
  suggestions?: string[];
}

export interface SearchFacet {
  value: string;
  count: number;
  selected?: boolean;
}

/**
 * Error types specific to domain operations
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BusinessError {
  type: 'insufficient_credits' | 'pack_out_of_stock' | 'card_not_available' | 'invalid_operation';
  message: string;
  details?: Record<string, any>;
}

/**
 * Utility types for API operations
 */
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'cards'>;
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'email' | 'cards'>>;

export type CreateCardData = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCardData = Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreatePackData = Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePackData = Partial<Omit<Pack, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTransactionData = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'type'>>;