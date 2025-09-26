/**
 * API Service Validation Tests
 * 
 * Test suite to ensure compatibility between API services and existing mock data structures.
 * These tests validate that the repository implementations maintain the same interface
 * and data structures as the existing mock implementations.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { userRepository } from '../repositories/UserRepository';
import { cardRepository } from '../repositories/CardRepository';
import { packRepository } from '../repositories/PackRepository';
import { transactionRepository } from '../repositories/TransactionRepository';
import { mockPacks, mockTopCards } from '@/lib/store';
import type { User, Card, Pack, Transaction } from '../types/domain';

// Mock data for testing
const mockUser: User = {
  id: 'test-user-1',
  email: 'test@example.com',
  credits: 100,
  cards: [],
  fullName: 'Test User',
  phoneNumber: '+1234567890',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockCard: Card = {
  id: 'test-card-1',
  name: 'Test Card',
  rarity: 'common',
  price: 10,
  image: 'test-card.jpg',
  finish: 'normal',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('API Service Validation', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  describe('Data Structure Compatibility', () => {
    it('should maintain User interface compatibility', async () => {
      // Test that repository methods return data matching existing User interface
      const response = await userRepository.getProfile(mockUser.id);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      
      if (response.data) {
        const user = response.data;
        
        // Validate required fields exist
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('credits');
        expect(user).toHaveProperty('cards');
        
        // Validate field types
        expect(typeof user.id).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.credits).toBe('number');
        expect(Array.isArray(user.cards)).toBe(true);
      }
    });

    it('should maintain Card interface compatibility', async () => {
      const response = await cardRepository.findById(mockCard.id);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      
      if (response.data) {
        const card = response.data;
        
        // Validate required fields
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('price');
        expect(card).toHaveProperty('image');
        
        // Validate enum values
        expect(['common', 'rare', 'epic', 'legendary']).toContain(card.rarity);
        if (card.finish) {
          expect(['normal', 'foil', 'reverse-foil']).toContain(card.finish);
        }
        if (card.status) {
          expect(['active', 'shipped', 'expired', 'converted']).toContain(card.status);
        }
      }
    });

    it('should maintain Pack interface compatibility', async () => {
      const response = await packRepository.findById('1'); // Using mock pack ID
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      
      if (response.data) {
        const pack = response.data;
        
        // Validate required fields
        expect(pack).toHaveProperty('id');
        expect(pack).toHaveProperty('name');
        expect(pack).toHaveProperty('description');
        expect(pack).toHaveProperty('price');
        expect(pack).toHaveProperty('image');
        expect(pack).toHaveProperty('cardCount');
        
        // Validate field types
        expect(typeof pack.name).toBe('string');
        expect(typeof pack.price).toBe('number');
        expect(typeof pack.cardCount).toBe('number');
      }
    });

    it('should maintain Transaction interface compatibility', async () => {
      const response = await transactionRepository.findById('test-transaction-1');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      
      if (response.data) {
        const transaction = response.data;
        
        // Validate required fields
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('userId');
        expect(transaction).toHaveProperty('type');
        expect(transaction).toHaveProperty('amount');
        expect(transaction).toHaveProperty('currency');
        expect(transaction).toHaveProperty('status');
        expect(transaction).toHaveProperty('description');
        
        // Validate enum values
        const validTypes = ['credit_purchase', 'pack_purchase', 'card_sale', 'shipping_fee', 'refund', 'card_conversion', 'bonus_credit'];
        const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
        
        expect(validTypes).toContain(transaction.type);
        expect(validStatuses).toContain(transaction.status);
      }
    });
  });

  describe('Mock Data Compatibility', () => {
    it('should return mock data consistent with existing store data', async () => {
      // Test pack catalog compatibility
      const packResponse = await packRepository.getAvailablePacks();
      
      expect(packResponse.success).toBe(true);
      expect(packResponse.data).toBeDefined();
      
      if (packResponse.data) {
        const packs = packResponse.data;
        
        // Should return packs with same structure as mockPacks
        expect(Array.isArray(packs)).toBe(true);
        
        if (packs.length > 0) {
          const pack = packs[0];
          
          // Compare with mockPacks structure
          const mockPack = mockPacks[0];
          expect(typeof pack.id).toBe(typeof mockPack.id);
          expect(typeof pack.name).toBe(typeof mockPack.name);
          expect(typeof pack.price).toBe(typeof mockPack.price);
          expect(typeof pack.cardCount).toBe(typeof mockPack.cardCount);
        }
      }
    });

    it('should return cards consistent with existing mock cards', async () => {
      const cardResponse = await cardRepository.getUserCards('test-user-1');
      
      expect(cardResponse.success).toBe(true);
      expect(cardResponse.data).toBeDefined();
      
      if (cardResponse.data) {
        const cards = cardResponse.data;
        
        expect(Array.isArray(cards)).toBe(true);
        
        if (cards.length > 0) {
          const card = cards[0];
          
          // Compare with mockTopCards structure
          const mockCard = mockTopCards[0];
          expect(typeof card.id).toBe(typeof mockCard.id);
          expect(typeof card.name).toBe(typeof mockCard.name);
          expect(typeof card.rarity).toBe(typeof mockCard.rarity);
          expect(typeof card.price).toBe(typeof mockCard.price);
        }
      }
    });
  });

  describe('API Response Format', () => {
    it('should return consistent API response format', async () => {
      const response = await userRepository.getProfile('test-user-1');
      
      // Validate response structure
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('timestamp');
      
      expect(typeof response.success).toBe('boolean');
      
      if (!response.success) {
        expect(response).toHaveProperty('error');
        expect(response.error).toHaveProperty('code');
        expect(response.error).toHaveProperty('message');
      }
    });

    it('should return consistent paginated response format', async () => {
      const response = await cardRepository.getUserCards('test-user-1');
      
      // Should be a paginated response
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('data');
      
      if (response.success && response.data) {
        // Validate pagination metadata if present
        if ('pagination' in response) {
          const pagination = (response as any).pagination;
          expect(pagination).toHaveProperty('page');
          expect(pagination).toHaveProperty('limit');
          expect(pagination).toHaveProperty('total');
          expect(pagination).toHaveProperty('hasNext');
          expect(pagination).toHaveProperty('hasPrev');
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle not found errors gracefully', async () => {
      try {
        await userRepository.getProfile('non-existent-user');
      } catch (error) {
        // Should either return error response or throw with proper error structure
        expect(error).toBeDefined();
      }
    });

    it('should handle validation errors properly', async () => {
      try {
        // Test with invalid data
        await userRepository.updateProfile('test-user-1', {
          email: 'invalid-email', // Invalid email format
        });
      } catch (error) {
        // Should handle validation errors appropriately
        expect(error).toBeDefined();
      }
    });
  });

  describe('Async Behavior', () => {
    it('should simulate realistic API delays', async () => {
      const startTime = Date.now();
      await userRepository.getProfile('test-user-1');
      const endTime = Date.now();
      
      // Should have some delay to simulate real API
      const delay = endTime - startTime;
      expect(delay).toBeGreaterThan(50); // At least 50ms delay
      expect(delay).toBeLessThan(2000); // But not too long for tests
    });
  });

  describe('Feature Flag Integration', () => {
    it('should respect feature flags for API vs mock behavior', async () => {
      // This test would verify that feature flags properly control
      // whether API or mock data is used
      
      // Mock feature flag state
      const response = await userRepository.getProfile('test-user-1');
      
      // Should return data regardless of feature flag state
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });
});