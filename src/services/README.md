# API Service Layer

This directory contains the complete API service layer for the Hobby Hunter Web MVP application. The service layer provides a robust, type-safe, and maintainable API integration infrastructure that works alongside existing mock data systems.

## 🏗️ Architecture Overview

The API service layer follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                           │
├─────────────────────────────────────────────────────────────┤
│                     Controllers                             │
├─────────────────────────────────────────────────────────────┤
│                   React Query Hooks                         │
├─────────────────────────────────────────────────────────────┤
│                     Repositories                            │
├─────────────────────────────────────────────────────────────┤
│                    HTTP Client                              │
├─────────────────────────────────────────────────────────────┤
│                   External API                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

- **Non-disruptive**: Coexists with existing mock data and controllers
- **Feature flags**: Gradual rollout control with environment-based configuration
- **Type safety**: Comprehensive TypeScript interfaces throughout
- **Error resilience**: Automatic fallback to mock data on API failures
- **Optimistic updates**: Immediate UI feedback with server reconciliation
- **Caching strategy**: Intelligent caching with background refresh
- **Retry logic**: Exponential backoff for transient failures

## 📁 Directory Structure

```
src/services/
├── api/                     # Core API configuration and client
│   ├── client.ts           # HTTP client with interceptors and retry logic
│   ├── config.ts           # API endpoints and configuration
│   └── types.ts            # Common API types and interfaces
├── repositories/           # Domain-specific repository implementations
│   ├── BaseRepository.ts   # Abstract base class with common operations
│   ├── UserRepository.ts   # User authentication and profile management
│   ├── CardRepository.ts   # Card collection and marketplace operations
│   ├── PackRepository.ts   # Pack catalog and opening mechanics
│   └── TransactionRepository.ts # Financial transactions and payments
├── hooks/                  # React Query hooks for each repository
│   ├── queryClient.ts      # React Query configuration and utilities
│   ├── useUserQueries.ts   # User-related query and mutation hooks
│   ├── useCardQueries.ts   # Card-related operations hooks
│   ├── usePackQueries.ts   # Pack operations and history hooks
│   └── useTransactionQueries.ts # Transaction and payment hooks
├── types/                  # Domain entity type definitions
│   └── domain.ts          # User, Card, Pack, Transaction interfaces
├── features/              # Feature flag system
│   └── featureFlags.ts    # Comprehensive feature flag management
├── __tests__/            # Validation tests
│   └── validation.test.ts # Compatibility tests with existing mock data
├── index.ts              # Main export file for clean imports
└── README.md            # This documentation file
```

## 🚀 Quick Start

### 1. Installation

The service layer uses the native `fetch` API and existing React Query setup, so no additional dependencies are required.

### 2. Environment Configuration

Copy the example environment file and configure for your environment:

```bash
cp .env.example .env.local
```

Key environment variables:

```env
# API Configuration
VITE_API_BASE_URL=https://hunterna-api-production.up.railway.app
VITE_API_TIMEOUT=30000
VITE_MOCK_DATA_FALLBACK=true

# Feature Flags (start with false for gradual rollout)
VITE_FEATURE_FLAG_API_AUTH=false
VITE_FEATURE_FLAG_API_CARDS=false
VITE_FEATURE_FLAG_API_PACKS=false
VITE_FEATURE_FLAG_API_TRANSACTIONS=false
```

### 3. Initialize Services

Add to your main application entry point:

```typescript
import { initializeApiServices } from '@/services';

// Initialize API services (call once at app startup)
initializeApiServices();
```

### 4. Use in Components

Import and use the hooks in your React components:

```typescript
import { useCurrentUser, useUserCards, useAvailablePacks } from '@/services';

function MyComponent() {
  const { user, isLoading } = useCurrentUser();
  const { data: cards } = useUserCards(user?.id || '');
  const { data: packs } = useAvailablePacks();

  // Component implementation...
}
```

## 🔧 Core Concepts

### Repository Pattern

Each domain entity (User, Card, Pack, Transaction) has a dedicated repository that implements:

- **CRUD operations**: Standard create, read, update, delete methods
- **Domain-specific methods**: Specialized operations for each entity
- **Mock fallback**: Automatic fallback to mock data when API is unavailable
- **Error handling**: Consistent error transformation and recovery

```typescript
// Example: Using the UserRepository
import { userRepository } from '@/services';

const user = await userRepository.getProfile(userId);
const updated = await userRepository.updateProfile(userId, { fullName: 'New Name' });
```

### React Query Integration

All repository methods are wrapped with React Query hooks providing:

- **Automatic caching**: Intelligent cache management with stale time configuration
- **Background refetch**: Keep data fresh without blocking UI
- **Optimistic updates**: Immediate UI feedback with rollback on errors
- **Error boundaries**: Graceful error handling and user feedback

```typescript
// Example: Using React Query hooks
import { useUserProfile, useUpdateProfile } from '@/services';

function ProfileComponent({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUserProfile(userId);
  const updateProfileMutation = useUpdateProfile();

  const handleUpdate = (data: UpdateUserData) => {
    updateProfileMutation.mutate({ userId, data });
  };

  // Component implementation...
}
```

### Feature Flag System

Comprehensive feature flag system for controlled rollout:

```typescript
import { useFeatureFlag, featureFlags } from '@/services';

function NewFeatureComponent() {
  const isEnabled = useFeatureFlag('enableNewPackOpeningAnimation');
  
  if (!isEnabled) {
    return <OldPackOpeningComponent />;
  }
  
  return <NewPackOpeningComponent />;
}

// Programmatic feature flag checks
if (featureFlags.shouldUseApi('cards')) {
  // Use API-based card operations
} else {
  // Use mock data
}
```

## 🎯 Usage Examples

### Authentication Flow

```typescript
import { useLogin, useRegister, useLogout } from '@/services';

function AuthComponent() {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const handleLogin = async (credentials: AuthCredentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // User is automatically stored in global state
    } catch (error) {
      // Handle login error
    }
  };

  // Component implementation...
}
```

### Pack Purchase and Opening

```typescript
import { usePackPurchaseFlow, usePackOpeningState } from '@/services';

function PackPurchaseComponent({ packId }: { packId: string }) {
  const {
    quantity,
    setQuantity,
    canPurchase,
    purchasePack,
    isPurchasing,
    validationData,
  } = usePackPurchaseFlow(packId);

  const {
    isOpening,
    openingResult,
    openPack,
    resetOpening,
  } = usePackOpeningState();

  const handlePurchaseAndOpen = async () => {
    try {
      const result = await purchasePack();
      if (result?.success && result.data?.packs) {
        await openPack({ packId: result.data.packs[0] });
      }
    } catch (error) {
      // Handle error
    }
  };

  // Component implementation...
}
```

### Card Collection Management

```typescript
import { 
  useUserCards, 
  useCardCollectionStats,
  useConvertCardsToCredits 
} from '@/services';

function CardCollectionComponent({ userId }: { userId: string }) {
  const { data: cards, isLoading } = useUserCards(userId);
  const { stats } = useCardCollectionStats(userId);
  const convertMutation = useConvertCardsToCredits();

  const handleConvertExpiredCards = (cardIds: string[]) => {
    convertMutation.mutate({
      cardIds,
      reason: 'Auto-conversion of expired cards',
    });
  };

  // Component implementation with stats display and bulk operations...
}
```

## ⚡ Performance Optimization

### Caching Strategy

The service layer implements intelligent caching:

- **User data**: 5-minute stale time with background refresh
- **Card collections**: 2-minute stale time for frequently changing data
- **Pack catalog**: 2-minute stale time with background refresh
- **Market data**: 30-second stale time for real-time pricing
- **Transactions**: 2-minute stale time for financial accuracy

### Background Refresh

Automatic background refresh for critical data:

```typescript
// User credits refresh every 30 seconds
const { data: credits } = useUserCredits(userId);

// Market data refresh every 5 minutes
const { data: marketData } = useCardMarketData(cardId);

// Pending transactions refresh every 10 seconds
const { data: pending } = usePendingTransactions(userId);
```

### Optimistic Updates

Immediate UI feedback with server reconciliation:

```typescript
// Credit updates show immediately, then sync with server
const updateCreditsMutation = useUpdateCredits();

// Card status changes reflect immediately in UI
const updateStatusMutation = useUpdateCardStatus();

// Pack purchases update credits optimistically
const purchasePackMutation = usePurchasePack();
```

## 🔒 Error Handling

### Graceful Degradation

The service layer provides multiple levels of error handling:

1. **Retry logic**: Exponential backoff for transient failures
2. **Mock fallback**: Automatic fallback to mock data when API is unavailable
3. **Error boundaries**: Component-level error isolation
4. **User feedback**: Contextual error messages and recovery suggestions

### Error Types

```typescript
// Network errors automatically retry and may fall back to mock data
// Authentication errors redirect to login
// Validation errors show field-level feedback
// Server errors show user-friendly messages with support contact
```

## 🧪 Testing

### Validation Tests

The service layer includes comprehensive validation tests:

```bash
# Run validation tests
npm test src/services/__tests__/validation.test.ts
```

Tests verify:

- Data structure compatibility with existing mock data
- API response format consistency
- Error handling behavior
- Feature flag integration
- Async behavior and timing

### Mock Data Compatibility

All repositories maintain compatibility with existing mock data structures, ensuring:

- Same TypeScript interfaces
- Consistent data shapes
- Identical error scenarios
- Matching async behavior patterns

## 🚩 Feature Flags

### Environment-Based Configuration

Feature flags are configured through environment variables:

```env
# Core API features
VITE_FEATURE_FLAG_API_AUTH=false      # Authentication
VITE_FEATURE_FLAG_API_CARDS=false     # Card operations  
VITE_FEATURE_FLAG_API_PACKS=false     # Pack operations
VITE_FEATURE_FLAG_API_TRANSACTIONS=false # Transactions

# Advanced features
VITE_EXPERIMENTAL_FEATURES=false      # Experimental features
VITE_ANALYTICS_ENABLED=true           # Analytics tracking
```

### Runtime Management

Feature flags can be managed at runtime for development:

```typescript
// Access development tools (development only)
window.__featureFlags.setFlag('useApiForCards', true);
window.__featureFlags.getRecommendations();
window.__featureFlags.validate();
```

### Gradual Rollout Strategy

Recommended rollout sequence:

1. **Phase 1**: Enable authentication API (`useApiForAuthentication`)
2. **Phase 2**: Enable read-only operations (card browsing, pack catalog)
3. **Phase 3**: Enable transactional operations (purchases, shipping)
4. **Phase 4**: Enable advanced features and optimizations

## 🔄 Migration Strategy

### Current State Preservation

The service layer is designed for zero-disruption deployment:

- **No changes** to existing controllers required
- **No changes** to existing components required
- **All mock data** continues to work unchanged
- **All user flows** remain functional

### Integration Points

When ready to integrate:

1. **Feature flag activation**: Enable specific API features via environment variables
2. **Controller updates**: Optional integration with repository services
3. **Gradual migration**: Migrate features one at a time
4. **Monitoring**: Track performance and errors during migration

### Rollback Plan

Complete rollback capability:

- Disable feature flags to return to mock data
- No code changes required for rollback
- Instant fallback on API failures
- Data consistency maintained throughout

## 📊 Monitoring and Analytics

### Performance Metrics

The service layer provides insights into:

- API response times by endpoint
- Cache hit/miss ratios
- Error rates and types
- Feature flag usage statistics
- User engagement with new features

### Error Tracking

Comprehensive error tracking:

- Network errors and retry attempts
- API errors with context
- Feature flag validation issues
- Performance bottlenecks
- User experience impact

## 🤝 Contributing

### Adding New Features

1. **Repository methods**: Add to appropriate repository class
2. **React Query hooks**: Create corresponding hooks with proper caching
3. **Type definitions**: Update domain types as needed
4. **Tests**: Add validation tests for new functionality
5. **Documentation**: Update README with usage examples

### Code Standards

- **TypeScript**: Strict type checking enabled
- **Error handling**: Comprehensive error scenarios covered
- **Performance**: Optimistic updates and intelligent caching
- **Testing**: Validation tests for compatibility
- **Documentation**: Clear examples and API documentation

## 📝 API Documentation

### Repository Methods

Each repository implements a consistent interface:

#### Base Operations
- `findAll(params?)`: Retrieve all entities with optional filtering
- `findById(id)`: Retrieve single entity by ID
- `create(data)`: Create new entity
- `update(id, data)`: Update existing entity
- `delete(id)`: Remove entity

#### Domain-Specific Operations
- See individual repository files for specialized methods
- All methods support both API and mock implementations
- Consistent error handling and response formats

### Hook Patterns

React Query hooks follow consistent naming:

- **Queries**: `use[Entity][Operation]` (e.g., `useUserProfile`)
- **Mutations**: `use[Action][Entity]` (e.g., `useUpdateProfile`)
- **Utilities**: `use[Feature][Action]` (e.g., `useRefreshUser`)

## 🔗 Related Documentation

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Store Documentation](../lib/README.md)
- [Controller Layer Documentation](../controller/README.md)
- [Component Architecture](../components/README.md)

## 📞 Support

For questions or issues with the API service layer:

1. Check existing validation tests for examples
2. Review feature flag configuration
3. Verify environment variable setup
4. Test with mock data fallback enabled
5. Check browser console for detailed error messages

The service layer is designed to be robust and self-healing, with comprehensive fallback mechanisms to ensure your application continues working even when the API is unavailable.