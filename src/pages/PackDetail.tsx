import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowLeft, Package, Shield, Star } from 'lucide-react';
import packImage from '@/assets/pack-ff-gathering.jpg';
import { usePackDetailController } from '@/controller/PackDetailController';

const PackDetail = () => {
  const { packId } = useParams<{ packId: string }>();

  const {
    // State
    pack,
    isLoading,
    error,
    user,
    isAuthenticated,
    
    // Actions
    handlePurchase,
    handleGoBack,
    handleSignIn,
    
    // Data getters
    getPackTags,
    getPackDescription,
    getUserBalanceInfo
  } = usePackDetailController({ packId: packId || '' });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-foreground">Loading pack details...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (!pack || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {error || 'Pack not found'}
            </h1>
            <Button 
              onClick={handleGoBack} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Button 
          onClick={handleGoBack} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Packs
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Pack Image */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="relative mb-6">
                <img
                  src={packImage}
                  alt={pack.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {pack.guaranteed && (
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verify certification
                  </Badge>
                )}
              </div>
            </Card>

            {/* Potential Cards Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Potential Cards</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Pack Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {pack.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-muted-foreground">Each pack contains {pack.cardCount} cards</span>
                {pack.guaranteed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Verify certification</span>
                  </div>
                )}
              </div>
              
              {/* Price */}
              <div className="text-4xl font-bold text-foreground mb-6">
                ${pack.price}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Buy Button */}
              <Button 
                onClick={handlePurchase}
                size="lg"
                className="w-full btn-primary text-lg py-6 mb-4"
              >
                BUY NOW
              </Button>

              {/* Purchase Restriction */}
              <div className="flex items-center justify-center text-amber-600 bg-amber-50 rounded-lg p-3 mb-6">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm">You can only purchase this pack once</span>
              </div>
            </div>

            <Separator />

            {/* Details Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  {getPackDescription()}
                </p>
                
                <p className="text-sm">
                  Each pack contains {pack.cardCount} random cards.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {getPackTags().map((tag, index) => (
                    <Badge key={index} variant={tag.variant}>
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">
                  Guaranteed {pack.guaranteed || 'rare or better card'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Free shipping for orders over $50
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Authentic cards with verification
                </span>
              </div>
            </div>

            {/* User Account Info */}
            {(() => {
              const balanceInfo = getUserBalanceInfo();
              if (!balanceInfo) return null;
              
              return (
                <Card className="p-4 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Balance:</span>
                    <span className="font-semibold">${balanceInfo.balance}</span>
                  </div>
                  {!balanceInfo.canAfford && (
                    <p className="text-sm text-red-600 mt-2">
                      Insufficient credits. Add ${balanceInfo.shortfall} more to purchase.
                    </p>
                  )}
                </Card>
              );
            })()}

            {!isAuthenticated && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600"
                    onClick={handleSignIn}
                  >
                    Sign in
                  </Button>
                  {' '}to purchase packs and track your collection.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PackDetail;