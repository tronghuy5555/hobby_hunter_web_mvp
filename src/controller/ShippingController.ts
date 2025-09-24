import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/lib/store';

export interface ShippingFormData {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
}

export interface CardInfo {
  id: number;
  cardName: string;
  rarity: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  features: string;
  price: number;
  originalPrice?: number;
  discount?: string;
}

export interface ShippingControllerProps {
  // Optional props for future extensions
}

export const useShippingController = (_props?: ShippingControllerProps) => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  const { user, isAuthenticated } = useAppStore();

  // State
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    address: ''
  });
  
  const [selectedShipping, setSelectedShipping] = useState('usps-ground');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<CardInfo | null>(null);

  // Mock card data - in a real app, this would come from an API
  const mockCards: CardInfo[] = [
    { id: 1, cardName: 'Sephiroth', rarity: 'Common' },
    { id: 2, cardName: 'Cloud Strife', rarity: 'Common' },
    { id: 3, cardName: 'Rare Summon', rarity: 'Uncommon' },
    { id: 4, cardName: 'Chocobo', rarity: 'Rare' },
    { id: 5, cardName: 'Materia', rarity: 'Legendary' }
  ];

  // Available shipping options
  const shippingOptions: ShippingOption[] = [
    {
      id: 'usps-ground',
      name: 'USPS Ground Advantage',
      description: 'Delivery in 5 business days',
      deliveryTime: '5 business days',
      features: 'USPS tracking, insurance with most shipments, free package pickup service',
      price: 5.86,
      originalPrice: 7.05,
      discount: 'Save 17%'
    },
    {
      id: 'usps-priority',
      name: 'USPS Priority Mail',
      description: 'Delivery in 1-3 business days',
      deliveryTime: '1-3 business days',
      features: 'Fast delivery, tracking, insurance included',
      price: 12.50
    }
  ];

  // Initialize and validate
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Check authentication
      if (!isAuthenticated) {
        navigate('/auth?mode=login');
        return;
      }

      // Validate cardId
      if (!cardId) {
        setError('Card ID is required');
        navigate('/my-cards');
        return;
      }

      // Find the card
      const foundCard = mockCards.find(c => c.id === parseInt(cardId));
      if (!foundCard) {
        setError('Card not found');
        navigate('/my-cards');
        return;
      }

      setCard(foundCard);

      // Auto-fill form with user data
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          emailAddress: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || ''
        });
      }

      setIsLoading(false);
    };

    initialize();
  }, [cardId, user, isAuthenticated, navigate]);

  // Handle form input changes
  const handleInputChange = (field: keyof ShippingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Handle shipping option selection
  const handleShippingOptionChange = (optionId: string) => {
    setSelectedShipping(optionId);
  };

  // Validate form data
  const validateForm = (): boolean => {
    const requiredFields: (keyof ShippingFormData)[] = ['fullName', 'emailAddress', 'phoneNumber', 'address'];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!card) {
      setError('Card information is missing');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get selected shipping option
      const shippingOption = shippingOptions.find(option => option.id === selectedShipping);
      
      // Simulate API call to create shipping order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would:
      // 1. Create shipping order in the database
      // 2. Process payment for shipping cost
      // 3. Update card status to "In Shipping"
      // 4. Generate tracking number
      // 5. Send confirmation email
      // 6. Update user's shipping address if changed
      
      const orderDetails = {
        cardId: card.id,
        cardName: card.cardName,
        shippingMethod: shippingOption?.name,
        shippingCost: shippingOption?.price,
        estimatedDelivery: shippingOption?.deliveryTime,
        shippingAddress: formData
      };
      
      console.log('Shipping order created:', orderDetails);
      
      // Show success message
      alert(`Shipping order created successfully for ${card.cardName}! You will receive a tracking number via email.`);
      
      // Navigate back to My Cards
      navigate('/my-cards');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create shipping order';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected shipping option details
  const getSelectedShippingOption = (): ShippingOption | undefined => {
    return shippingOptions.find(option => option.id === selectedShipping);
  };

  // Calculate total shipping cost
  const getTotalShippingCost = (): number => {
    const option = getSelectedShippingOption();
    return option?.price || 0;
  };

  // Get breadcrumb data
  const getBreadcrumbData = () => {
    return {
      cardName: card?.cardName || 'Final Fantasy (Magic: The Gathering)',
      currentPage: 'Shipping'
    };
  };

  // Check if form is valid for submission
  const isFormValid = (): boolean => {
    return Object.values(formData).every(value => value.trim() !== '') && !!card;
  };

  return {
    // State
    formData,
    selectedShipping,
    isSubmitting,
    isLoading,
    error,
    card,
    
    // Data
    shippingOptions,
    breadcrumbData: getBreadcrumbData(),
    selectedShippingOption: getSelectedShippingOption(),
    totalShippingCost: getTotalShippingCost(),
    
    // Validation
    isFormValid: isFormValid(),
    
    // Actions
    handleInputChange,
    handleShippingOptionChange,
    handleSubmit,
    
    // Utils
    clearError: () => setError(null)
  };
};