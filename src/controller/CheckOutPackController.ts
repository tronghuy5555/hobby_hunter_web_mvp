import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAppStore, Pack, mockPacks } from '@/lib/store';

export interface CheckOutPackControllerProps {
  // Optional props for future extensions
  initialPackId?: string;
}

export interface CartItem {
  pack: Pack;
  quantity: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minAmount?: number;
}

export const useCheckOutPackController = (_props?: CheckOutPackControllerProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAppStore();
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock discount codes
  const availableDiscounts: DiscountCode[] = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: '10% off your first purchase',
      minAmount: 20
    },
    {
      code: 'SAVE5',
      type: 'fixed',
      value: 5,
      description: '$5 off any purchase',
      minAmount: 25
    },
    {
      code: 'MEGA20',
      type: 'percentage',
      value: 20,
      description: '20% off orders over $50',
      minAmount: 50
    }
  ];

  // Initialize cart from URL params or router state
  useEffect(() => {
    // First check if pack data was passed via router state (from Buy Now buttons)
    const statePackId = (location.state as { packId?: string })?.packId;
    
    // Then check URL search params as fallback
    const urlPackId = searchParams.get('packId');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    
    const packId = statePackId || urlPackId;
    
    if (packId) {
      const pack = mockPacks.find(p => p.id === packId);
      if (pack) {
        setCartItems([{ pack, quantity }]);
      } else {
        setError('Pack not found');
      }
    } else {
      // No pack selected, show empty cart
      setCartItems([]);
    }
    
    setIsLoading(false);
  }, [searchParams, location.state]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth?mode=login&redirect=checkout');
    }
  }, [isAuthenticated, navigate, isLoading]);

  // Calculate totals
  const getSubtotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.pack.price * item.quantity), 0);
  };

  const getDiscountAmount = (): number => {
    if (!appliedDiscount) return 0;
    
    const subtotal = getSubtotal();
    
    if (appliedDiscount.type === 'percentage') {
      return Math.round((subtotal * appliedDiscount.value / 100) * 100) / 100;
    } else {
      return Math.min(appliedDiscount.value, subtotal);
    }
  };

  const getTotal = (): number => {
    return Math.max(0, getSubtotal() - getDiscountAmount());
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle discount code application
  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setError('Please enter a discount code');
      return;
    }

    const discount = availableDiscounts.find(
      d => d.code.toLowerCase() === discountCode.trim().toLowerCase()
    );

    if (!discount) {
      setError('Invalid discount code');
      return;
    }

    const subtotal = getSubtotal();
    if (discount.minAmount && subtotal < discount.minAmount) {
      setError(`Minimum order of $${discount.minAmount} required for this discount`);
      return;
    }

    setAppliedDiscount(discount);
    setError(null);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setError(null);
  };

  // Handle quantity changes
  const updateQuantity = (packId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(packId);
      return;
    }

    setCartItems(items => 
      items.map(item => 
        item.pack.id === packId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (packId: string) => {
    setCartItems(items => items.filter(item => item.pack.id !== packId));
  };

  // Handle payment processing
  const handlePayment = async (paymentMethod: 'paypal' | 'credits') => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const total = getTotal();

    if (paymentMethod === 'credits' && user.credits < total) {
      setError(`Insufficient credits. You have $${user.credits} but need $${total}`);
      return;
    }

    setIsProcessingPayment(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would:
      // 1. Process payment with payment provider
      // 2. Update user credits if using credits
      // 3. Create order record
      // 4. Add purchased packs to user inventory
      // 5. Send confirmation email

      // For now, navigate to pack opening experience
      if (cartItems.length === 1) {
        // Single pack purchase - go directly to opening
        navigate(`/?openPack=${cartItems[0].pack.id}`);
      } else {
        // Multiple packs - could go to inventory or pack selection
        navigate('/my-cards');
      }
    } catch (error) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // Check if user can afford the purchase
  const canAffordWithCredits = (): boolean => {
    if (!user) return false;
    return user.credits >= getTotal();
  };

  // Get payment options
  const getPaymentOptions = () => {
    const options = [
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay securely with PayPal',
        available: true
      }
    ];

    if (user) {
      options.unshift({
        id: 'credits',
        name: 'Account Credits',
        description: `Use your $${user.credits} credit balance`,
        available: canAffordWithCredits()
      });
    }

    return options;
  };

  return {
    // State
    cartItems,
    discountCode,
    appliedDiscount,
    isProcessingPayment,
    error,
    isLoading,
    
    // User info
    user,
    isAuthenticated,
    
    // Calculations
    getSubtotal,
    getDiscountAmount,
    getTotal,
    getTotalItems,
    
    // Actions
    setDiscountCode,
    handleApplyDiscount,
    handleRemoveDiscount,
    updateQuantity,
    removeFromCart,
    handlePayment,
    handleGoBack,
    handleContinueShopping,
    
    // Utils
    canAffordWithCredits,
    getPaymentOptions,
    clearError: () => setError(null)
  };
};