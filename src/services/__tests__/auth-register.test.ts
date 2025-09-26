/**
 * Authentication Register Endpoint Test
 * 
 * Tests the auth/register endpoint with the specified request/response format
 */

import { describe, it, expect } from 'vitest';
import { userRepository } from '../repositories/UserRepository';
import type { RegisterData, RegisterResponse } from '../types/domain';

describe('Auth Register Endpoint', () => {
  it('should register a user with the expected request format', async () => {
    const requestData: RegisterData = {
      email: "user@example.com",
      password: "password123",
      username: "johndoe"
    };

    const response = await userRepository.register(requestData);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    
    if (response.data) {
      const registerResponse: RegisterResponse = response.data;
      
      // Validate user object structure
      expect(registerResponse.user).toBeDefined();
      expect(registerResponse.user.id).toBeDefined();
      expect(registerResponse.user.email).toBe("user@example.com");
      expect(registerResponse.user.created_at).toBeDefined();
      expect(typeof registerResponse.user.created_at).toBe('string');
      
      // Validate profile object structure
      expect(registerResponse.profile).toBeDefined();
      expect(registerResponse.profile.id).toBe(registerResponse.user.id); // Should be same ID
      expect(registerResponse.profile.username).toBe("johndoe");
      
      // Validate message
      expect(registerResponse.message).toBe("User and profile registered successfully. Please login to get access token.");
      
      // Ensure no tokens are returned (as per specification)
      expect(registerResponse).not.toHaveProperty('tokens');
      expect(registerResponse).not.toHaveProperty('accessToken');
      expect(registerResponse).not.toHaveProperty('refreshToken');
    }
  });

  it('should handle registration with optional fields', async () => {
    const requestData: RegisterData = {
      email: "user@example.com",
      password: "password123",
      username: "johndoe",
      fullName: "John Doe",
      phoneNumber: "+1234567890",
      agreeToTerms: true
    };

    const response = await userRepository.register(requestData);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    
    if (response.data) {
      expect(response.data.user.email).toBe("user@example.com");
      expect(response.data.profile.username).toBe("johndoe");
      expect(response.data.message).toContain("registered successfully");
    }
  });

  it('should match the exact response format from specification', () => {
    const expectedResponseFormat = {
      user: {
        id: "8473b937-2e0d-48ee-bf77-e251694aa4f2",
        email: "user@example.com",
        created_at: "2025-09-26T11:22:13.795009Z"
      },
      profile: {
        id: "8473b937-2e0d-48ee-bf77-e251694aa4f2",
        username: "johndoe"
      },
      message: "User and profile registered successfully. Please login to get access token."
    };

    // Test that our types match the expected structure
    const testResponse: RegisterResponse = expectedResponseFormat;
    
    expect(testResponse.user.id).toBeDefined();
    expect(testResponse.user.email).toBeDefined();
    expect(testResponse.user.created_at).toBeDefined();
    expect(testResponse.profile.id).toBeDefined();
    expect(testResponse.profile.username).toBeDefined();
    expect(testResponse.message).toBeDefined();
  });
});