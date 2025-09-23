import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { useNavigate, useSearchParams } from 'react-router-dom';

type AuthStep = 'initial' | 'signup' | 'login' | 'verify' | 'setup';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<AuthStep>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  // Handle direct sign up navigation
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setStep('signup');
    } else if (mode === 'login') {
      setStep('initial');
    }
  }, [searchParams]);

  // Mock user database
  const existingUsers = ['john@example.com', 'user@test.com'];

  const handleEmailSubmit = () => {
    if (existingUsers.includes(email)) {
      setStep('login');
    } else {
      setStep('signup');
    }
  };

  const handleSignup = () => {
    // Simulate sending verification code
    setStep('verify');
  };

  const handleLogin = () => {
    // Mock login
    const mockUser = {
      id: '1',
      email,
      credits: 100,
      cards: [],
    };
    setUser(mockUser);
    navigate('/');
  };

  const handleVerification = () => {
    if (verificationCode === '123456') {
      setStep('setup');
    }
  };

  const handleSetupComplete = (skip = false) => {
    const mockUser = {
      id: '1',
      email,
      credits: 100,
      cards: [],
    };
    setUser(mockUser);
    navigate('/');
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign in
    const mockUser = {
      id: '2',
      email: 'google@user.com',
      credits: 100,
      cards: [],
    };
    setUser(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 px-3 py-1 bg-muted rounded text-sm font-medium text-muted-foreground">
            HOBBY HUNTER
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to Hobby Hunter
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === 'setup' ? 'Complete your profile' : 'Log in or sign up'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'initial' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <Button 
                onClick={handleEmailSubmit} 
                className="w-full"
                disabled={!email}
              >
                Log in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn}
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="underline">Terms of Service</a> &{' '}
                <a href="#" className="underline">Privacy Policy</a>
              </p>
            </>
          )}

          {step === 'signup' && (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Create your account
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email*</Label>
                <Input
                  id="email-signup"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </div>

              <Button 
                onClick={handleSignup} 
                className="w-full"
                disabled={!email || !password}
              >
                Sign up
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="underline">Terms of Service</a> &{' '}
                <a href="#" className="underline">Privacy Policy</a>
              </p>
            </>
          )}

          {step === 'login' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email-login">Email*</Label>
                <Input
                  id="email-login"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-login">Password*</Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full"
                disabled={!password}
              >
                Log in
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email-verify">Email*</Label>
                <div className="flex gap-2">
                  <Input
                    id="email-verify"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-muted"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setStep('signup')}
                    className="text-primary"
                  >
                    change
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                We've sent a code to {email}
                <br />
                Enter the code below to continue. Please check your spam folder. It may take up to a minute to arrive.
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                />
              </div>

              <Button 
                onClick={handleVerification} 
                className="w-full"
                disabled={!verificationCode}
              >
                Sign up
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="underline">Terms of Service</a> &{' '}
                <a href="#" className="underline">Privacy Policy</a>
              </p>
            </>
          )}

          {step === 'setup' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Input
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="Add payment method (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Address</Label>
                  <Input
                    id="shipping"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Add shipping address (optional)"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSetupComplete(true)}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={() => handleSetupComplete(false)}
                    className="flex-1"
                  >
                    Finish
                  </Button>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="underline">Terms of Service</a> &{' '}
                <a href="#" className="underline">Privacy Policy</a>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;