import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { userRepository } from '@/services';
import type { User, AuthCredentials, LoginResponse } from '@/services';

export type AuthStep = 'initial' | 'signup' | 'login' | 'verify' | 'setup';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthControllerProps {
  // Optional props for future extensions
}



export const useAuthController = (_props?: AuthControllerProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  // Form state
  const [step, setStep] = useState<AuthStep>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user database - in real app this would be API calls
  const existingUsers = ['john@example.com', 'user@test.com'];

  // Initialize step based on URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setStep('signup');
    } else if (mode === 'login') {
      setStep('initial');
    }
  }, [searchParams]);

  // Clear error when step changes
  useEffect(() => {
    setError(null);
  }, [step]);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6; // Minimum 6 characters
  };

  // Check if user exists
  const checkUserExists = (email: string): boolean => {
    return existingUsers.includes(email.toLowerCase());
  };

  // Handle initial email submission
  const handleEmailSubmit = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (checkUserExists(email)) {
        setStep('login');
      } else {
        setStep('signup');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll keep the mock behavior for signup since we only have login endpoint
      // TODO: Implement actual registration when endpoint is available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Verification code sent to:', email);
      setStep('verify');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (): Promise<void> => {
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credentials: AuthCredentials = { email, password };
      const response = await userRepository.authenticate(credentials);
      
      if (!response.success || !response.data) {
        setError('Login failed. Please try again.');
        return;
      }

      const loginData: LoginResponse = response.data;
      
      // Store the authentication tokens
      localStorage.setItem('access_token', loginData.access_token);
      localStorage.setItem('refresh_token', loginData.refresh_token);
      
      // Fetch full user profile with the user ID from login response
      const profileResponse = await userRepository.getUserProfile(loginData.user.id);
      
      let user: User;
      if (profileResponse.success && profileResponse.data) {
        // Use the full profile data
        user = {
          ...profileResponse.data,
          email: loginData.user.email, // Ensure email is from login response
        };
      } else {
        // Fallback to basic user data from login response
        user = {
          id: loginData.user.id,
          email: loginData.user.email,
          credits: 100, // Default credits
          cards: [], // Empty initially
          createdAt: loginData.user.created_at,
          updatedAt: new Date().toISOString(),
        };
      }

      setUser(user);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleVerification = async (): Promise<void> => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification - accept '123456'
      if (verificationCode !== '123456') {
        setError('Invalid verification code. Please try again.');
        return;
      }

      setStep('setup');
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '2',
        email: 'google@user.com',
        credits: 100,
        cards: [],
      };

      setUser(mockUser);
      navigate('/');
    } catch (error) {
      setError('Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setup completion
  const handleSetupComplete = async (skip: boolean = false): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to save user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        credits: 100,
        cards: [],
      };

      // In real app: save payment method and shipping address
      if (!skip) {
        console.log('Saved payment method:', paymentMethod);
        console.log('Saved shipping address:', shippingAddress);
      }

      setUser(mockUser);
      navigate('/');
    } catch (error) {
      setError('Setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleGoBack = (): void => {
    if (step === 'signup' || step === 'login') {
      setStep('initial');
      setError(null);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = (): void => {
    navigate('/');
  };

  // Form field updates
  const updateEmail = (newEmail: string): void => {
    setEmail(newEmail);
    setError(null);
  };

  const updatePassword = (newPassword: string): void => {
    setPassword(newPassword);
    setError(null);
  };

  const updateVerificationCode = (newCode: string): void => {
    setVerificationCode(newCode);
    setError(null);
  };

  const updatePaymentMethod = (newPaymentMethod: string): void => {
    setPaymentMethod(newPaymentMethod);
  };

  const updateShippingAddress = (newShippingAddress: string): void => {
    setShippingAddress(newShippingAddress);
  };

  // Get form validation state
  const getFormValidation = () => {
    switch (step) {
      case 'initial':
        return {
          isValid: isValidEmail(email),
          canSubmit: isValidEmail(email) && !isLoading
        };
      case 'signup':
        return {
          isValid: isValidEmail(email) && isValidPassword(password),
          canSubmit: isValidEmail(email) && isValidPassword(password) && !isLoading
        };
      case 'login':
        return {
          isValid: password.length > 0,
          canSubmit: password.length > 0 && !isLoading
        };
      case 'verify':
        return {
          isValid: verificationCode.length > 0,
          canSubmit: verificationCode.length > 0 && !isLoading
        };
      case 'setup':
        return {
          isValid: true,
          canSubmit: !isLoading
        };
      default:
        return {
          isValid: false,
          canSubmit: false
        };
    }
  };

  // Get step title and description
  const getStepInfo = () => {
    switch (step) {
      case 'initial':
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Log in or sign up'
        };
      case 'signup':
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Create your account'
        };
      case 'login':
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Log in to your account'
        };
      case 'verify':
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Verify your email'
        };
      case 'setup':
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Complete your profile'
        };
      default:
        return {
          title: 'Welcome to Hobby Hunter',
          description: 'Log in or sign up'
        };
    }
  };

  return {
    // State
    step,
    email,
    password,
    verificationCode,
    paymentMethod,
    shippingAddress,
    isLoading,
    error,

    // Actions
    handleEmailSubmit,
    handleSignup,
    handleLogin,
    handleVerification,
    handleGoogleSignIn,
    handleSetupComplete,
    handleGoBack,
    handleGoHome,

    // Field updates
    updateEmail,
    updatePassword,
    updateVerificationCode,
    updatePaymentMethod,
    updateShippingAddress,

    // Computed values
    getFormValidation,
    getStepInfo,
    
    // Validation helpers
    isValidEmail,
    isValidPassword,
    checkUserExists
  };
};

// Static configuration
export const getAuthConfig = () => {
  return {
    minPasswordLength: 6,
    verificationCodeLength: 6,
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
    termsOfServiceUrl: '#',
    privacyPolicyUrl: '#'
  };
};

// Auth validation helpers
export const authValidators = {
  email: (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
  },

  verificationCode: (code: string): string | null => {
    if (!code) return 'Verification code is required';
    if (code.length !== 6) return 'Please enter the 6-digit code';
    return null;
  }
};