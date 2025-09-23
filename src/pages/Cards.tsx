import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CardDisplay from '@/components/CardDisplay';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCardsController } from '@/controller/CardsController';
import { Package, Clock, ArrowRight } from 'lucide-react';

const Cards = () => {
  const {
    // State
    selectedCards,
    hasSelectedCards,
    selectedCardsCount,
    
    // Data getters
    getCardsData,
    getCardExpiryInfo,
    getCardCreditValue,
    getTopCards,
    getAuthState,
    
    // Actions
    handleCardToggle,
    handleShipCards,
    navigateToBuyPacks,
    navigateToAuth,
    
    // Validations
    canShipCards,
    getShippingValidationMessage
  } = useCardsController();

  const { isAuthenticated, user } = getAuthState();
  const { userCards, hasCards, isCardSelected } = getCardsData();
  const topCards = getTopCards();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto" />
              <h1 className="text-3xl font-bold">My Cards</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sign in to view your card collection and manage your pulls
              </p>
              <Button className="btn-primary" onClick={navigateToAuth}>
                Sign In to Continue
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Cards</h1>
          <p className="text-muted-foreground">
            Manage your opened cards and request physical shipping
          </p>
        </div>

        {!hasCards ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-2xl font-semibold">No Cards Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't opened any packs yet. Start by purchasing and opening your first pack!
              </p>
              <Button className="btn-primary" onClick={navigateToBuyPacks}>
                Buy Your First Pack
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Your Collection ({userCards.length} cards)
                </h2>
                {hasSelectedCards && (
                  <Button 
                    onClick={handleShipCards}
                    disabled={!canShipCards()}
                    className="btn-primary flex items-center gap-2"
                    title={getShippingValidationMessage() || undefined}
                  >
                    <Package className="h-4 w-4" />
                    Ship {selectedCardsCount} Cards
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {userCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div 
                      className={`cursor-pointer transition-all ${
                        isCardSelected(card.id) 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : ''
                      }`}
                      onClick={() => handleCardToggle(card.id)}
                    >
                      <CardDisplay card={card} showPrice={false} />
                    </div>
                    
                    {/* Expiry Info */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getCardExpiryInfo(card.id).daysLeft} days left
                      </div>
                      <p className="text-xs font-medium text-primary">
                        ${getCardCreditValue(card)} credit value
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="card-container p-6 bg-muted/50">
              <div className="flex items-start gap-4">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Card Expiration</h3>
                  <p className="text-sm text-muted-foreground">
                    Cards expire in 1 month and automatically convert to credits worth 50% of their real-world value. 
                    Request physical shipping to keep your cards permanently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Cards for Demo */}
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Top Cards This Week</h2>
            <p className="text-muted-foreground">See what other players are pulling</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCards.map((card, index) => (
              <CardDisplay key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cards;