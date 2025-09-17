import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import CardDisplay from '@/components/CardDisplay';
import { useNavigate } from 'react-router-dom';

const PackOpeningPage = () => {
  const navigate = useNavigate();
  const {
    currentPack,
    isOpeningPack,
    revealedCards,
    currentCardIndex,
    startPackOpening,
    revealNextCard,
    finishPackOpening,
    resetPackOpening,
  } = useGameStore();

  const [showSummary, setShowSummary] = useState(false);

  // Sample pack contents for demo
  const generatePackContents = () => {
    const sampleCards = [
      {
        id: Date.now() + '-1',
        name: 'Forest Sprite',
        rarity: 'common' as const,
        price: 0.25,
        finish: 'normal' as const,
        image: '/src/assets/sample-card.jpg',
        set: 'Mystic Realms',
      },
      {
        id: Date.now() + '-2',
        name: 'Lightning Bolt',
        rarity: 'common' as const,
        price: 0.30,
        finish: 'normal' as const,
        image: '/src/assets/sample-card.jpg',
        set: 'Mystic Realms',
      },
      {
        id: Date.now() + '-3',
        name: 'Crystal Guardian',
        rarity: 'uncommon' as const,
        price: 1.50,
        finish: 'normal' as const,
        image: '/src/assets/sample-card.jpg',
        set: 'Mystic Realms',
      },
      {
        id: Date.now() + '-4',
        name: 'Ancient Tome',
        rarity: 'rare' as const,
        price: 8.99,
        finish: 'foil' as const,
        image: '/src/assets/sample-card.jpg',
        set: 'Mystic Realms',
      },
      {
        id: Date.now() + '-5',
        name: 'Dragon Lord',
        rarity: 'mythic' as const,
        price: 24.99,
        finish: 'holographic' as const,
        image: '/src/assets/sample-card.jpg',
        set: 'Mystic Realms',
      },
    ];
    return sampleCards;
  };

  useEffect(() => {
    if (!currentPack) {
      navigate('/packs');
      return;
    }
  }, [currentPack, navigate]);

  const handleStartOpening = () => {
    const packContents = generatePackContents();
    startPackOpening(packContents);
  };

  const handleNextCard = () => {
    if (currentCardIndex < revealedCards.length - 1) {
      revealNextCard();
    } else {
      setShowSummary(true);
    }
  };

  const handleFinish = () => {
    finishPackOpening();
    navigate('/cards');
  };

  const handleSkipToRares = () => {
    const rareIndex = revealedCards.findIndex(card => 
      ['rare', 'mythic', 'legendary'].includes(card.rarity)
    );
    if (rareIndex !== -1) {
      // Skip to first rare card
      while (currentCardIndex < rareIndex) {
        revealNextCard();
      }
    }
  };

  if (!currentPack) return null;

  const currentCard = revealedCards[currentCardIndex];
  const totalValue = revealedCards.reduce((sum, card) => sum + card.price, 0);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {!isOpeningPack ? (
          // Pre-opening screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-card border-border">
              <motion.div
                className="mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src={currentPack.image}
                  alt={currentPack.name}
                  className="w-64 h-48 mx-auto object-cover rounded-lg shadow-card"
                />
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-4">{currentPack.name}</h1>
              <p className="text-muted-foreground mb-6">{currentPack.description}</p>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStartOpening}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white px-8"
                >
                  Open Pack
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/packs')}
                >
                  Back to Packs
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : showSummary ? (
          // Summary screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-card border-border">
              <h2 className="text-3xl font-bold mb-6">Pack Opening Complete!</h2>
              
              <div className="mb-6">
                <p className="text-lg text-muted-foreground mb-2">Total Value:</p>
                <p className="text-3xl font-bold text-accent">${totalValue.toFixed(2)}</p>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Card Name</th>
                      <th className="text-left p-2">Rarity</th>
                      <th className="text-left p-2">Finish</th>
                      <th className="text-right p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revealedCards.map((card) => (
                      <tr key={card.id} className="border-b border-border/50">
                        <td className="p-2 font-medium">{card.name}</td>
                        <td className="p-2 capitalize">{card.rarity}</td>
                        <td className="p-2 capitalize">{card.finish.replace('_', ' ')}</td>
                        <td className="p-2 text-right font-semibold text-accent">
                          ${card.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleFinish}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  Add to Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/packs')}
                >
                  Open Another Pack
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Card revealing screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6">
              <p className="text-lg text-muted-foreground mb-2">
                Card {currentCardIndex + 1} of {revealedCards.length}
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="h-2 bg-gradient-primary rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / revealedCards.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div
                  key={currentCard.id}
                  initial={{ rotateY: 180, scale: 0.8 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  exit={{ rotateY: -180, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8 flex justify-center"
                >
                  <CardDisplay card={currentCard} size="lg" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleNextCard}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white px-8"
              >
                {currentCardIndex < revealedCards.length - 1 ? 'Next Card' : 'See Summary'}
              </Button>
              
              {currentCardIndex < revealedCards.length - 1 && (
                <Button
                  variant="outline"
                  onClick={handleSkipToRares}
                >
                  Skip to Rares
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PackOpeningPage;