import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import CardDisplay from '@/components/CardDisplay';
import { useState } from 'react';

const CardsPage = () => {
  const { ownedCards, credits, convertExpiredCards } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'expiring' | 'rare'>('all');

  const now = new Date();
  const expiringCards = ownedCards.filter(card => 
    card.expiresAt && card.expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
  );
  
  const rareCards = ownedCards.filter(card => 
    ['rare', 'mythic', 'legendary'].includes(card.rarity)
  );

  const getFilteredCards = () => {
    switch (filter) {
      case 'expiring': return expiringCards;
      case 'rare': return rareCards;
      default: return ownedCards;
    }
  };

  const totalValue = ownedCards.reduce((sum, card) => sum + card.price, 0);

  const handleShipCards = () => {
    // In a real app, this would send data to Google Sheets
    console.log('Shipping cards to Google Sheets:', ownedCards);
    alert('Cards will be shipped! (Demo: Data sent to Google Sheets)');
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            My <span className="bg-gradient-primary bg-clip-text text-transparent">Card Collection</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-lg font-semibold mb-2">Total Cards</h3>
              <p className="text-3xl font-bold text-primary">{ownedCards.length}</p>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-lg font-semibold mb-2">Collection Value</h3>
              <p className="text-3xl font-bold text-accent">${totalValue.toFixed(2)}</p>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-lg font-semibold mb-2">Credits</h3>
              <p className="text-3xl font-bold text-rare">${credits.toFixed(2)}</p>
            </Card>
          </div>

          {expiringCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Card className="p-6 bg-destructive/10 border-destructive/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-destructive mb-2">
                      Expiring Soon
                    </h3>
                    <p className="text-muted-foreground">
                      {expiringCards.length} cards expire within 7 days and will convert to credits
                    </p>
                  </div>
                  <Button
                    onClick={convertExpiredCards}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    Convert Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-gradient-primary text-white' : ''}
          >
            All Cards ({ownedCards.length})
          </Button>
          <Button
            variant={filter === 'rare' ? 'default' : 'outline'}
            onClick={() => setFilter('rare')}
            className={filter === 'rare' ? 'bg-gradient-primary text-white' : ''}
          >
            Rare+ ({rareCards.length})
          </Button>
          <Button
            variant={filter === 'expiring' ? 'default' : 'outline'}
            onClick={() => setFilter('expiring')}
            className={filter === 'expiring' ? 'bg-gradient-primary text-white' : ''}
          >
            Expiring ({expiringCards.length})
          </Button>
        </div>

        {/* Cards Grid */}
        {getFilteredCards().length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8"
          >
            {getFilteredCards().map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="relative"
              >
                <CardDisplay card={card} size="md" />
                {card.expiresAt && card.expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    Expiring
                  </Badge>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold mb-4">
              {filter === 'all' ? 'No Cards Yet' : `No ${filter} Cards`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? 'Start opening packs to build your collection!'
                : `You don't have any ${filter} cards in your collection.`
              }
            </p>
            <Button 
              onClick={() => window.location.href = '/packs'}
              className="bg-gradient-primary hover:opacity-90 text-white"
            >
              Open Packs
            </Button>
          </motion.div>
        )}

        {/* Action Buttons */}
        {ownedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <Button
              onClick={handleShipCards}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white"
            >
              Ship Physical Cards
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CardsPage;