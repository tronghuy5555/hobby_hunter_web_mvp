import React, { useState, useRef, useEffect } from 'react';
import type { Card } from '../../types';
import { CardDisplay } from './CardDisplay';
import { Button, LoadingSpinner } from '../ui';
import { useMobileOptimization } from '../../hooks/useGestures';

interface TopCardsCarouselProps {
  cards: Card[];
  loading?: boolean;
  title?: string;
  className?: string;
}

export const TopCardsCarousel: React.FC<TopCardsCarouselProps> = ({
  cards,
  loading = false,
  title = "🏆 Top 5 Most Valuable Cards",
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);
  const { isMobile } = useMobileOptimization();

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && cards.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % cards.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, cards.length]);

  // Scroll to current card
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      const gap = 24; // 1.5rem gap
      const scrollPosition = currentIndex * (cardWidth + gap);
      
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % cards.length);
    setIsAutoPlaying(false);
  };

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  if (loading) {
    return (
      <div className={`bg-background-secondary rounded-xl p-6 border border-gray-700 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={`bg-background-secondary rounded-xl p-6 border border-gray-700 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No top cards available</h3>
          <p className="text-gray-400">Cards will appear here as the collection grows!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-background-secondary rounded-xl p-6 border border-gray-700 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`
            p-2 rounded-lg transition-colors text-sm
            ${isAutoPlaying 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-background-card text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
          title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
        >
          {isAutoPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {cards.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}

        {/* Cards Container */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`
                flex-shrink-0 ${isMobile ? 'w-56' : 'w-64'} snap-center transition-all duration-300 cursor-pointer
                ${index === currentIndex ? 'scale-105 ring-2 ring-primary-500' : 'scale-95 opacity-70'}
              `}
              onClick={() => handleCardClick(index)}
            >
              <CardDisplay
                card={card}
                showDetails={true}
                showExpiry={false}
                className="h-full"
              />
              
              {/* Rank Badge */}
              <div className="absolute top-2 left-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        {cards.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                  }
                `}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Card Info */}
      <div className="mt-6 text-center">
        <div className="bg-background-card rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-2">
            #{currentIndex + 1} - {cards[currentIndex]?.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            {cards[currentIndex]?.description}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${
              cards[currentIndex]?.rarity === 'mythic' ? 'bg-red-600 text-white' :
              cards[currentIndex]?.rarity === 'legendary' ? 'bg-orange-500 text-white' :
              cards[currentIndex]?.rarity === 'epic' ? 'bg-purple-600 text-white' :
              cards[currentIndex]?.rarity === 'rare' ? 'bg-blue-600 text-white' :
              cards[currentIndex]?.rarity === 'uncommon' ? 'bg-green-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {cards[currentIndex]?.rarity}
            </span>
            <span className="text-yellow-400 font-bold">
              ${(cards[currentIndex]?.value / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};