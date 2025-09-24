import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCheckOutPackController } from '@/controller/CheckOutPackController';
import { Package, AlertCircle, CreditCard } from 'lucide-react';
import packImage from '@/assets/pack-ff-gathering.jpg';

const CheckOutPack = () => {
  const {
    // State
    cartItems,
    discountCode,
    appliedDiscount,
    isProcessingPayment,
    error,
    isLoading,
    user,
    
    // Calculations
    getSubtotal,
    getDiscountAmount,
    getTotal,
    getTotalItems,
    
    // Actions
    setDiscountCode,
    handleApplyDiscount,
    handleRemoveDiscount,
    handlePayment,
    handleContinueShopping,
    
    // Utils
    getPaymentOptions
  } = useCheckOutPackController();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-foreground">Loading checkout...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some packs to your cart to continue shopping
            </p>
            <Button onClick={handleContinueShopping} className="btn-primary">
              Continue Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
          </div>

          {/* Review your cart */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">Review your cart</h2>
            
            {/* Cart Item */}
            {cartItems.map((item) => (
              <div key={item.pack.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={packImage}
                      alt={item.pack.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{item.pack.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Each pack contains {item.pack.cardCount} cards
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-semibold text-lg">${item.pack.price}</span>
                </div>
              </div>
            ))}

            {/* Discount Code */}
            <div className="space-y-4">
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">{appliedDiscount.code}</div>
                    <div className="text-sm text-green-600">{appliedDiscount.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveDiscount}
                    className="text-green-600 hover:text-green-700"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleApplyDiscount}
                    variant="outline"
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    Apply
                  </Button>
                </div>
              )}
              
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Package</span>
                <span>1</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Items</span>
                <span>{cartItems[0]?.pack.cardCount || 0}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Item Total</span>
                <span>${getSubtotal().toFixed(0)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${getTotal().toFixed(0)}</span>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">*Taxes calculated at checkout</p>
            </div>

            {/* Payment Button */}
            <div className="space-y-4">
              <Button 
                onClick={() => handlePayment('paypal')}
                disabled={isProcessingPayment || cartItems.length === 0}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Stripe'
                )}
              </Button>
              
              {user && (
                <Button 
                  onClick={() => handlePayment('credits')}
                  disabled={isProcessingPayment || !getPaymentOptions().find(p => p.id === 'credits')?.available}
                  variant="outline"
                  className="w-full h-12 font-semibold"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with Credits (${user.credits} available)
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckOutPack;