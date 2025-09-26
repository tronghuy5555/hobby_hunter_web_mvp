/**
 * Feature Flag System
 * 
 * Comprehensive feature flag system for controlling API service activation
 * and gradual rollout of new functionality. Supports environment-based flags,
 * user-level flags, and runtime flag management.
 */

import React from 'react';
import { apiConfig } from '../api/config';

/**
 * Feature flag configuration interface
 */
export interface FeatureFlagConfig {
  // Core API features
  useApiForAuthentication: boolean;
  useApiForCards: boolean;
  useApiForPacks: boolean;
  useApiForTransactions: boolean;
  
  // Advanced features
  enableOptimisticUpdates: boolean;
  enableBackgroundRefresh: boolean;
  enableAdvancedCaching: boolean;
  enableErrorRetry: boolean;
  
  // UI features
  enableNewPackOpeningAnimation: boolean;
  enableCardRecommendations: boolean;
  enableMarketDataDisplay: boolean;
  enableShippingTracking: boolean;
  
  // Analytics and monitoring
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
  
  // Experimental features
  enableExperimentalFeatures: boolean;
  enableBetaPackTypes: boolean;
  enableAdvancedFiltering: boolean;
}

/**
 * Default feature flag values
 */
const defaultFlags: FeatureFlagConfig = {
  // Core API features (start disabled for gradual rollout)
  useApiForAuthentication: false,
  useApiForCards: false,
  useApiForPacks: false,
  useApiForTransactions: false,
  
  // Advanced features (enabled by default)
  enableOptimisticUpdates: true,
  enableBackgroundRefresh: true,
  enableAdvancedCaching: true,
  enableErrorRetry: true,
  
  // UI features (enabled by default)
  enableNewPackOpeningAnimation: true,
  enableCardRecommendations: true,
  enableMarketDataDisplay: true,
  enableShippingTracking: true,
  
  // Analytics and monitoring (environment dependent)
  enableAnalytics: !import.meta.env.DEV,
  enableErrorReporting: !import.meta.env.DEV,
  enablePerformanceMonitoring: !import.meta.env.DEV,
  
  // Experimental features (disabled by default)
  enableExperimentalFeatures: false,
  enableBetaPackTypes: false,
  enableAdvancedFiltering: false,
};

/**
 * Feature flag manager class
 */
class FeatureFlagManager {
  private flags: FeatureFlagConfig;
  private listeners: Set<(flags: FeatureFlagConfig) => void> = new Set();

  constructor() {
    this.flags = this.loadFlags();
  }

  /**
   * Load feature flags from multiple sources
   */
  private loadFlags(): FeatureFlagConfig {
    const envFlags = this.loadEnvironmentFlags();
    const localFlags = this.loadLocalStorageFlags();
    const userFlags = this.loadUserFlags();

    // Merge flags in order of priority: user > local > env > default
    return {
      ...defaultFlags,
      ...envFlags,
      ...localFlags,
      ...userFlags,
    };
  }

  /**
   * Load flags from environment variables
   */
  private loadEnvironmentFlags(): Partial<FeatureFlagConfig> {
    return {
      useApiForAuthentication: import.meta.env.VITE_FEATURE_FLAG_API_AUTH === 'true',
      useApiForCards: import.meta.env.VITE_FEATURE_FLAG_API_CARDS === 'true',
      useApiForPacks: import.meta.env.VITE_FEATURE_FLAG_API_PACKS === 'true',
      useApiForTransactions: import.meta.env.VITE_FEATURE_FLAG_API_TRANSACTIONS === 'true',
      enableAnalytics: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
      enableErrorReporting: import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true',
      enableExperimentalFeatures: import.meta.env.VITE_EXPERIMENTAL_FEATURES === 'true',
    };
  }

  /**
   * Load flags from localStorage for development/testing
   */
  private loadLocalStorageFlags(): Partial<FeatureFlagConfig> {
    try {
      const stored = localStorage.getItem('featureFlags');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load feature flags from localStorage:', error);
      return {};
    }
  }

  /**
   * Load user-specific flags (would come from API in real implementation)
   */
  private loadUserFlags(): Partial<FeatureFlagConfig> {
    // In a real implementation, this would fetch user-specific flags from the API
    // For now, return empty object
    return {};
  }

  /**
   * Get a specific feature flag value
   */
  isEnabled(flag: keyof FeatureFlagConfig): boolean {
    return this.flags[flag];
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }

  /**
   * Update a feature flag (for development/testing)
   */
  setFlag(flag: keyof FeatureFlagConfig, value: boolean): void {
    this.flags = { ...this.flags, [flag]: value };
    this.persistFlags();
    this.notifyListeners();
  }

  /**
   * Update multiple feature flags
   */
  setFlags(updates: Partial<FeatureFlagConfig>): void {
    this.flags = { ...this.flags, ...updates };
    this.persistFlags();
    this.notifyListeners();
  }

  /**
   * Reset flags to defaults
   */
  resetFlags(): void {
    this.flags = { ...defaultFlags };
    this.persistFlags();
    this.notifyListeners();
  }

  /**
   * Subscribe to flag changes
   */
  subscribe(listener: (flags: FeatureFlagConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Persist flags to localStorage
   */
  private persistFlags(): void {
    try {
      localStorage.setItem('featureFlags', JSON.stringify(this.flags));
    } catch (error) {
      console.warn('Failed to persist feature flags:', error);
    }
  }

  /**
   * Notify all listeners of flag changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.flags));
  }

  /**
   * Get environment-specific recommendations
   */
  getEnvironmentRecommendations(): {
    suggested: Partial<FeatureFlagConfig>;
    warnings: string[];
  } {
    const warnings: string[] = [];
    const suggested: Partial<FeatureFlagConfig> = {};

    // Development recommendations
    if (import.meta.env.DEV) {
      suggested.enableAnalytics = false;
      suggested.enableErrorReporting = false;
      suggested.enableExperimentalFeatures = true;
      
      if (this.flags.enableAnalytics) {
        warnings.push('Analytics should be disabled in development');
      }
    }

    // Production recommendations
    if (import.meta.env.PROD) {
      suggested.enableAnalytics = true;
      suggested.enableErrorReporting = true;
      suggested.enableExperimentalFeatures = false;
      
      if (!this.flags.enableErrorReporting) {
        warnings.push('Error reporting should be enabled in production');
      }
    }

    return { suggested, warnings };
  }

  /**
   * Validate flag configuration
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for conflicting flags
    if (this.flags.useApiForCards && !this.flags.enableOptimisticUpdates) {
      errors.push('API cards require optimistic updates for good UX');
    }

    if (this.flags.useApiForPacks && !this.flags.enableBackgroundRefresh) {
      errors.push('API packs should enable background refresh for stock updates');
    }

    // Check environment-specific requirements
    if (import.meta.env.PROD && this.flags.enableExperimentalFeatures) {
      errors.push('Experimental features should not be enabled in production');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Create singleton instance
export const featureFlagManager = new FeatureFlagManager();

/**
 * Hook for using feature flags in React components
 */
export function useFeatureFlags() {
  const [flags, setFlags] = React.useState(featureFlagManager.getAllFlags());

  React.useEffect(() => {
    return featureFlagManager.subscribe(setFlags);
  }, []);

  return {
    flags,
    isEnabled: (flag: keyof FeatureFlagConfig) => featureFlagManager.isEnabled(flag),
    setFlag: (flag: keyof FeatureFlagConfig, value: boolean) => featureFlagManager.setFlag(flag, value),
    setFlags: (updates: Partial<FeatureFlagConfig>) => featureFlagManager.setFlags(updates),
    resetFlags: () => featureFlagManager.resetFlags(),
  };
}

/**
 * Hook for specific feature flag
 */
export function useFeatureFlag(flag: keyof FeatureFlagConfig): boolean {
  const [enabled, setEnabled] = React.useState(featureFlagManager.isEnabled(flag));

  React.useEffect(() => {
    return featureFlagManager.subscribe((flags) => {
      setEnabled(flags[flag]);
    });
  }, [flag]);

  return enabled;
}

/**
 * Higher-order component for feature gating
 */
export function withFeatureFlag<P extends object>(
  flag: keyof FeatureFlagConfig,
  fallback?: React.ComponentType<P> | null
) {
  return function FeatureGatedComponent(Component: React.ComponentType<P>) {
    return function WrappedComponent(props: P) {
      const isEnabled = useFeatureFlag(flag);

      if (!isEnabled) {
        return fallback ? React.createElement(fallback, props) : null;
      }

      return React.createElement(Component, props);
    };
  };
}

/**
 * Utility functions for feature flag management
 */
export const featureFlags = {
  /**
   * Check if a feature is enabled
   */
  isEnabled: (flag: keyof FeatureFlagConfig) => featureFlagManager.isEnabled(flag),

  /**
   * Get all flags
   */
  getAll: () => featureFlagManager.getAllFlags(),

  /**
   * Check if API should be used for a specific domain
   */
  shouldUseApi: (domain: 'auth' | 'cards' | 'packs' | 'transactions') => {
    const flagMap = {
      auth: 'useApiForAuthentication',
      cards: 'useApiForCards',
      packs: 'useApiForPacks',
      transactions: 'useApiForTransactions',
    } as const;

    return featureFlagManager.isEnabled(flagMap[domain]);
  },

  /**
   * Check if advanced features are enabled
   */
  hasAdvancedFeatures: () => {
    const { flags } = featureFlagManager.getAllFlags();
    return flags.enableOptimisticUpdates &&
           flags.enableBackgroundRefresh &&
           flags.enableAdvancedCaching;
  },

  /**
   * Get development tools availability
   */
  getDevTools: () => ({
    setFlag: featureFlagManager.setFlag.bind(featureFlagManager),
    setFlags: featureFlagManager.setFlags.bind(featureFlagManager),
    resetFlags: featureFlagManager.resetFlags.bind(featureFlagManager),
    getRecommendations: featureFlagManager.getEnvironmentRecommendations.bind(featureFlagManager),
    validate: featureFlagManager.validateConfiguration.bind(featureFlagManager),
  }),
};

// Development-only: Expose feature flag manager to window for debugging
if (import.meta.env.DEV) {
  (window as any).__featureFlags = featureFlags.getDevTools();
}

export default featureFlagManager;