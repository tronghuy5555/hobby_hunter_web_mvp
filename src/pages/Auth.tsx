import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuthController } from '@/controller/AuthController';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const {
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
    getStepInfo
  } = useAuthController();

  const { isValid, canSubmit } = getFormValidation();
  const { title, description } = getStepInfo();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back Button - Top Left of Screen */}
      <Button
        variant="ghost"
        size="sm"
        onClick={step === 'initial' ? handleGoHome : handleGoBack}
        className="fixed top-4 left-4 z-50 p-3 h-12 w-12 bg-background/80 backdrop-blur-sm hover:bg-background border"
        disabled={isLoading}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 px-3 py-1 bg-muted rounded text-sm font-medium text-muted-foreground">
            HOBBY HUNTER
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          {step === 'initial' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <Button 
                onClick={handleEmailSubmit} 
                className="w-full"
                disabled={!canSubmit}
              >
                {isLoading ? 'Please wait...' : 'Log in'}
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
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
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
                  onChange={(e) => updateEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => updatePassword(e.target.value)}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </div>

              <Button 
                onClick={handleSignup} 
                className="w-full"
                disabled={!canSubmit}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
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
                  onChange={(e) => updatePassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
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
                disabled={!canSubmit}
              >
                {isLoading ? 'Signing in...' : 'Log in'}
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
                    onClick={handleGoBack}
                    className="text-primary"
                    disabled={isLoading}
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
                  onChange={(e) => updateVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  disabled={isLoading}
                />
              </div>

              <Button 
                onClick={handleVerification} 
                className="w-full"
                disabled={!canSubmit}
              >
                {isLoading ? 'Verifying...' : 'Sign up'}
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
                    onChange={(e) => updatePaymentMethod(e.target.value)}
                    placeholder="Add payment method (optional)"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Address</Label>
                  <Input
                    id="shipping"
                    value={shippingAddress}
                    onChange={(e) => updateShippingAddress(e.target.value)}
                    placeholder="Add shipping address (optional)"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSetupComplete(true)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Skip'}
                  </Button>
                  <Button 
                    onClick={() => handleSetupComplete(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Finish'}
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