/**
 * Authentication Integration Test
 * 
 * This test verifies that the UserRepository authentication method
 * properly integrates with the real API endpoint.
 */

import { userRepository } from '../src/services';
import type { AuthCredentials } from '../src/services';

// Test credentials (matching the endpoint example)
const testCredentials: AuthCredentials = {
  email: "user@example.com",
  password: "password123"
};

async function testAuthentication() {
  console.log('🧪 Testing Authentication Integration...');
  console.log('Credentials:', testCredentials);
  
  try {
    const response = await userRepository.authenticate(testCredentials);
    
    console.log('✅ Authentication Response:', {
      success: response.success,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : []
    });
    
    if (response.success && response.data) {
      const { access_token, refresh_token, user } = response.data;
      
      console.log('🔐 Token Info:', {
        hasAccessToken: !!access_token,
        hasRefreshToken: !!refresh_token,
        accessTokenLength: access_token?.length || 0,
        refreshTokenLength: refresh_token?.length || 0
      });
      
      console.log('👤 User Info:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      });
      
      // Test token storage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      console.log('💾 Tokens stored in localStorage');
      
      return {
        success: true,
        tokens: { access_token, refresh_token },
        user
      };
    } else {
      console.error('❌ Authentication failed:', response.error || 'Unknown error');
      return { success: false, error: response.error };
    }
    
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return { success: false, error };
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  (window as any).testAuthentication = testAuthentication;
  console.log('🚀 Authentication test function available as window.testAuthentication()');
}

export { testAuthentication };