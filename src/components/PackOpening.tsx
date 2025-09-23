import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/lib/store';
import CardDisplay from './CardDisplay';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PackOpeningProps {
  cards: Card[];
  onComplete: () => void;
  onSkipToRares: () => void;
}

const PackOpening = ({ cards, onComplete, onSkipToRares }: PackOpeningProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  const currentCard = cards[currentCardIndex];
  const isLastCard = currentCardIndex === cards.length - 1;
  const hasRares = cards.some(card => card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentCardIndex]);

  const handleNext = () => {
    if (isLastCard) {
      setShowAllCards(true);
    } else {
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handleSkipToRares = () => {
    const rareCards = cards.filter(card => 
      card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary'
    );
    if (rareCards.length > 0) {
      const firstRareIndex = cards.findIndex(card => 
        card.rarity === 'rare' || card.rarity === 'epic' || card.rarity === 'legendary'
      );
      setShowCard(false);
      setTimeout(() => {
        setCurrentCardIndex(firstRareIndex);
      }, 300);
    }
  };

  if (showAllCards) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Pack Opening Complete!</h2>
          <p className="text-muted-foreground">Here are all the cards you opened:</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <CardDisplay key={card.id} card={card} index={index} />
          ))}
        </div>
        
        <div className="text-center">
          <Button onClick={onComplete} className="btn-primary">
            Add to Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 min-h-[60vh] justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Opening Pack...</h2>
        <p className="text-muted-foreground">
          Card {currentCardIndex + 1} of {cards.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 max-w-xs">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showCard && (
          <motion.div
            key={currentCardIndex}
            className="w-64"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardDisplay card={currentCard} showPrice={false} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        {hasRares && currentCard && (currentCard.rarity === 'common') && (
          <Button
            variant="outline"
            onClick={handleSkipToRares}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Skip to Rares
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          className="btn-primary"
          disabled={!showCard}
        >
          {isLastCard ? 'View All Cards' : 'Next Card'}
        </Button>
      </div>
    </div>
  );
};

export default PackOpening;