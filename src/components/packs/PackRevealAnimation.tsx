import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Rarity, RARITY_ORDER } from '../../types';
import type { Card } from '../../types';
import { Button, ProgressBar } from '../ui';
import { useSwipeGestures, useMobileOptimization } from '../../hooks/useGestures';

interface PackRevealAnimationProps {
  cards: Card[];
  onComplete: () => void;
  allowSkip?: boolean;
  packName?: string;
}

export const PackRevealAnimation: React.FC<PackRevealAnimationProps> = ({
  cards,
  onComplete,
  allowSkip = true,
  packName = 'Card Pack'
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = pack closed
  const [isRevealing, setIsRevealing] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const { isMobile, getOptimizedProps } = useMobileOptimization();
  const optimizedProps = getOptimizedProps();

  // Sort cards by rarity (common first, mythic last)
  const sortedCards = React.useMemo(() => {
    return [...cards].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  }, [cards]);

  useEffect(() => {
    if (currentIndex >= sortedCards.length) {
      setShowRecap(true);
    }
  }, [currentIndex, sortedCards.length]);

  const handleStartReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 800); // Delay to show pack opening animation
  };

  const handleNextCard = () => {
    if (currentIndex < sortedCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowRecap(true);
    }
  };

  const handleSkipToRare = () => {
    const rareIndex = sortedCards.findIndex(card => 
      [Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHIC].includes(card.rarity as any)
    );
    if (rareIndex >= 0) {
      setCurrentIndex(rareIndex);
    } else {
      setCurrentIndex(sortedCards.length - 1);
    }
  };

  const handleSkipAll = () => {
    setShowRecap(true);
  };

  const progress = currentIndex >= 0 ? ((currentIndex + 1) / sortedCards.length) * 100 : 0;

  const rarityColors = {
    [Rarity.COMMON]: 'from-rarity-common to-rarity-common',
    [Rarity.UNCOMMON]: 'from-rarity-uncommon to-rarity-uncommon',
    [Rarity.RARE]: 'from-rarity-rare to-rarity-rare',
    [Rarity.EPIC]: 'from-rarity-epic to-rarity-epic',
    [Rarity.LEGENDARY]: 'from-rarity-legendary to-rarity-legendary',
    [Rarity.MYTHIC]: 'from-rarity-mythic to-rarity-mythic'
  };

  if (showRecap) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto p-6 bg-background-secondary rounded-xl border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          🎉 Pack Opening Complete!
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {sortedCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative bg-gradient-to-br ${rarityColors[card.rarity]} 
                p-1 rounded-lg group cursor-pointer
              `}
            >
              <div className="bg-background-card rounded-lg p-3 text-center">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full aspect-[3/4] object-cover rounded mb-2"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/150x200/1e293b/white?text=${encodeURIComponent(card.name)}`;
                  }}
                />
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                  {card.name}
                </h4>
                <p className="text-xs text-gray-400 capitalize">
                  {card.rarity}
                </p>
                <p className="text-xs text-yellow-400 font-semibold">
                  {card.value.toLocaleString()} credits
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="bg-background-card rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{cards.length}</p>
                <p className="text-sm text-gray-400">Cards Opened</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {cards.reduce((sum, card) => sum + card.value, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {cards.filter(card => [Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHIC].includes(card.rarity as any)).length}
                </p>
                <p className="text-sm text-gray-400">Rare Cards</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {Math.max(...cards.map(card => card.value)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Best Card</p>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={onComplete}>
            Continue to Collection
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6`}>
      {/* Progress Bar */}
      {isRevealing && (
        <div className="mb-6">
          <ProgressBar
            value={progress}
            showLabel
            label={`Revealing Cards (${currentIndex + 1}/${sortedCards.length})`}
            variant="primary"
            animated
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentIndex === -1 ? (
          // Pack Closed State
          <motion.div
            key="pack-closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="relative mx-auto w-64 h-80 mb-8 cursor-pointer"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotateY: [0, 5, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }
              }}
              onClick={handleStartReveal}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-2xl flex items-center justify-center border-4 border-primary-400 relative overflow-hidden">
                {/* Animated Background Particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    📦
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-2">{packName}</h2>
                  <p className="text-primary-200 text-sm">{cards.length} cards inside</p>
                </div>
              </div>
              
              {/* Enhanced Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-primary-400 rounded-xl opacity-20 blur-xl"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to open your pack?
            </h3>
            <p className="text-gray-400 mb-6">
              Click the pack above or the button below to start revealing your cards!
            </p>
            
            <Button variant="primary" size="lg" onClick={handleStartReveal}>
              🎴 {isMobile ? 'Tap to Open' : 'Open Pack'}
            </Button>
          </motion.div>
        ) : (
          // Card Reveal State
          <motion.div
            key={`card-${currentIndex}`}
            initial={{ opacity: 0, rotateY: 180, scale: 0.5, y: 100 }}
            animate={{ 
              opacity: 1, 
              rotateY: 0, 
              scale: 1, 
              y: 0,
              transition: {
                duration: 0.8,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }
            }}
            exit={{ 
              opacity: 0, 
              rotateY: -180, 
              scale: 0.5, 
              y: -100,
              transition: { duration: 0.5 }
            }}
            className="text-center"
          >
            <motion.div 
              className={`
                relative mx-auto w-80 h-96 mb-8 bg-gradient-to-br ${rarityColors[sortedCards[currentIndex].rarity]}
                rounded-xl shadow-2xl p-1
              `}
              animate={{
                boxShadow: [
                  `0 0 20px ${sortedCards[currentIndex].rarity === Rarity.MYTHIC ? '#EF4444' : sortedCards[currentIndex].rarity === Rarity.LEGENDARY ? '#F59E0B' : '#3B82F6'}40`,
                  `0 0 40px ${sortedCards[currentIndex].rarity === Rarity.MYTHIC ? '#EF4444' : sortedCards[currentIndex].rarity === Rarity.LEGENDARY ? '#F59E0B' : '#3B82F6'}80`,
                  `0 0 20px ${sortedCards[currentIndex].rarity === Rarity.MYTHIC ? '#EF4444' : sortedCards[currentIndex].rarity === Rarity.LEGENDARY ? '#F59E0B' : '#3B82F6'}40`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div 
                className="w-full h-full bg-background-card rounded-xl p-6 flex flex-col relative overflow-hidden"
                initial={{ rotateX: -15 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Sparkle Effect for Rare Cards */}
                {[Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHIC].includes(sortedCards[currentIndex].rarity as any) && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          repeatType: 'loop'
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                <motion.img
                  src={sortedCards[currentIndex].image}
                  alt={sortedCards[currentIndex].name}
                  className="w-full flex-1 object-cover rounded-lg mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/300x200/1e293b/white?text=${encodeURIComponent(sortedCards[currentIndex].name)}`;
                  }}
                />
                <motion.div 
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <motion.h3 
                    className="text-xl font-bold text-white mb-2"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(255,255,255,0.5)',
                        '0 0 20px rgba(255,255,255,0.8)',
                        '0 0 10px rgba(255,255,255,0.5)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {sortedCards[currentIndex].name}
                  </motion.h3>
                  <p className="text-lg font-semibold text-primary-400 capitalize mb-1">
                    {sortedCards[currentIndex].rarity}
                  </p>
                  <motion.p 
                    className="text-yellow-400 font-bold"
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    {sortedCards[currentIndex].value.toLocaleString()} credits
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" onClick={handleNextCard}>
                {currentIndex < sortedCards.length - 1 ? (isMobile ? 'Next →' : 'Next Card') : 'Finish'}
              </Button>
              
              {allowSkip && currentIndex < sortedCards.length - 1 && (
                <>
                  <Button variant="secondary" onClick={handleSkipToRare}>
                    {isMobile ? 'Skip ⭐' : 'Skip to Rare'}
                  </Button>
                  <Button variant="ghost" onClick={handleSkipAll}>
                    {isMobile ? 'Skip All ⏭️' : 'Skip All'}
                  </Button>
                </>
              )}
            </div>
            
            {/* Mobile-specific gesture hint */}
            {isMobile && (
              <motion.p 
                className="text-xs text-gray-500 text-center mt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👈 Swipe or tap to continue 👉
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};