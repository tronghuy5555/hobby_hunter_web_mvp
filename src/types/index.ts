// Core enums for the application
export const Rarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHIC: 'mythic'
} as const;

export type Rarity = typeof Rarity[keyof typeof Rarity];

export const Finish = {
  NORMAL: 'normal',
  FOIL: 'foil',
  HOLOGRAPHIC: 'holographic'
} as const;

export type Finish = typeof Finish[keyof typeof Finish];

export const TransactionType = {
  PURCHASE: 'purchase',
  CREDIT_ADD: 'credit_add',
  SHIPPING: 'shipping',
  PAYPAL: 'paypal'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const PaymentMethod = {
  CREDITS: 'credits',
  PAYPAL: 'paypal'
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

// Core interfaces
export interface Card {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  value: number;
  finish: Finish;
  expiryDate: Date;
  isExpired: boolean;
  packId?: string;
  description?: string;
  category?: string;
}

export interface RarityGuarantee {
  rarity: Rarity;
  count: number;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: Rarity;
  cardCount: number;
  guarantees: RarityGuarantee[];
  description?: string;
  isAvailable?: boolean;
  featuredUntil?: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  joinDate: Date;
  avatar?: string;
  lastLogin?: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  autoSkipCommons: boolean;
  enableNotifications: boolean;
  defaultSortBy: 'name' | 'rarity' | 'value' | 'expiry' | 'newest';
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  status: TransactionStatus;
  description?: string;
  details?: Record<string, any>;
}

export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDays: number;
  description?: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PurchaseResponse {
  success: boolean;
  packId: string;
  cards: Card[];
  transaction: Transaction;
}

export interface PackOpenResponse {
  cards: Card[];
  packId: string;
  timestamp: Date;
}

export interface ShipResponse {
  success: boolean;
  trackingNumber: string;
  estimatedDelivery: Date;
  shippingCost: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
}

export interface CreditPurchaseResponse {
  success: boolean;
  creditsAdded: number;
  newBalance: number;
  transaction: Transaction;
}

// Component Props interfaces
export interface PackCardProps {
  pack: Pack;
  onPurchase: (packId: string) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface CardDisplayProps {
  card: Card;
  showDetails?: boolean;
  showExpiry?: boolean;
  onSelect?: (cardId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export interface CardRevealProps {
  cards: Card[];
  onRevealComplete: () => void;
  allowSkip?: boolean;
  currentIndex: number;
  onNext?: () => void;
  onSkipToRare?: () => void;
}

export interface CardListProps {
  cards: Card[];
  onShip?: (cardIds: string[]) => void;
  filter?: RarityFilter;
  sortBy?: CardSortOption;
  onCardSelect?: (cardId: string) => void;
  selectedCards?: string[];
  showBulkActions?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Filter and sort types
export interface RarityFilter {
  rarities: Rarity[];
  showExpired?: boolean;
  minValue?: number;
  maxValue?: number;
}

export type CardSortOption = 'name' | 'rarity' | 'value' | 'expiry' | 'newest';
export type PackSortOption = 'price' | 'name' | 'rarity' | 'newest';

// Form interfaces
export interface PaymentFormData {
  paymentMethod: PaymentMethod;
  amount: number;
  email?: string;
}

export interface ShippingFormData extends ShippingAddress {
  shippingOption: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  rarity?: Rarity[];
  finish?: Finish[];
  category?: string[];
  priceRange?: [number, number];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Animation and UI state types
export interface AnimationState {
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface PackRevealState {
  status: 'closed' | 'opening' | 'revealing' | 'complete';
  currentCardIndex: number;
  skippedToRare: boolean;
  canSkip: boolean;
}

// Store state interfaces (for Zustand)
export interface AppStoreState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Cards and packs
  userCards: Card[];
  availablePacks: Pack[];
  topCards: Card[];
  
  // UI state
  isLoading: LoadingState;
  error: string | null;
  notifications: Notification[];
  
  // Shopping cart / selection
  selectedCards: string[];
  
  // Recent activity
  recentTransactions: Transaction[];
  recentPurchases: Pack[];
}

export interface AppStoreActions {
  // Authentication
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  
  // Packs and cards
  fetchAvailablePacks: () => Promise<void>;
  fetchUserCards: () => Promise<void>;
  fetchTopCards: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  
  // Pack operations
  purchasePack: (packId: string, paymentMethod: PaymentMethod) => Promise<PurchaseResponse>;
  openPack: (packId: string) => Promise<Card[]>;
  
  // Card operations
  selectCard: (cardId: string) => void;
  unselectCard: (cardId: string) => void;
  clearSelection: () => void;
  shipCards: (cardIds: string[], address: ShippingAddress) => Promise<ShipResponse>;
  
  // Credits and payments
  addCredits: (amount: number) => Promise<void>;
  processPayPalPayment: (amount: number) => Promise<PaymentResponse>;
  
  // UI actions
  setLoading: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}

// Constants
export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: '#9CA3AF',
  [Rarity.UNCOMMON]: '#10B981',
  [Rarity.RARE]: '#3B82F6',
  [Rarity.EPIC]: '#8B5CF6',
  [Rarity.LEGENDARY]: '#F59E0B',
  [Rarity.MYTHIC]: '#EF4444',
};

export const RARITY_ORDER: Record<Rarity, number> = {
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 2,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 4,
  [Rarity.LEGENDARY]: 5,
  [Rarity.MYTHIC]: 6,
};

export const CARD_EXPIRY_DAYS = 14; // Cards expire after 14 days
export const MIN_CREDIT_PURCHASE = 100;
export const MAX_CREDIT_PURCHASE = 10000;