import React from 'react';
import { motion } from 'framer-motion';
import { Rarity } from '../../types';
import type { CardDisplayProps } from '../../types';
import { CountdownTimer } from '../ui';

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  showDetails = true,
  showExpiry = true,
  onSelect,
  isSelected = false,
  className = ''
}) => {
  const rarityColors = {
    [Rarity.COMMON]: 'border-rarity-common from-rarity-common to-rarity-common',
    [Rarity.UNCOMMON]: 'border-rarity-uncommon from-rarity-uncommon to-rarity-uncommon',
    [Rarity.RARE]: 'border-rarity-rare from-rarity-rare to-rarity-rare',
    [Rarity.EPIC]: 'border-rarity-epic from-rarity-epic to-rarity-epic',
    [Rarity.LEGENDARY]: 'border-rarity-legendary from-rarity-legendary to-rarity-legendary',
    [Rarity.MYTHIC]: 'border-rarity-mythic from-rarity-mythic to-rarity-mythic'
  };

  const rarityGlow = {
    [Rarity.COMMON]: 'rarity-glow common',
    [Rarity.UNCOMMON]: 'rarity-glow uncommon',
    [Rarity.RARE]: 'rarity-glow rare',
    [Rarity.EPIC]: 'rarity-glow epic',
    [Rarity.LEGENDARY]: 'rarity-glow legendary',
    [Rarity.MYTHIC]: 'rarity-glow mythic'
  };

  const finishEffects = {
    normal: '',
    foil: 'animate-pulse-slow',
    holographic: 'animate-pulse-slow bg-gradient-to-br from-purple-500/20 to-blue-500/20'
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(card.id);
    }
  };

  const isExpiringSoon = new Date(card.expiryDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      className={`
        group relative bg-background-card rounded-xl overflow-hidden border-2 
        transition-all duration-300 card-perspective
        ${rarityColors[card.rarity]} ${rarityGlow[card.rarity]}
        ${onSelect ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-4 ring-primary-500 scale-105' : ''}
        ${card.isExpired ? 'opacity-50 grayscale' : ''}
        ${className}
      `}
      onClick={handleClick}
      whileHover={{
        scale: onSelect ? 1.05 : 1.02,
        rotateY: 5,
        rotateX: 2,
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      layout
    >
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-primary-500/20 z-10 rounded-xl">
          <div className="absolute top-2 right-2 bg-primary-500 rounded-full w-6 h-6 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute top-2 left-2 z-20 space-y-1">
        {card.isExpired && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            ⏰ Expired
          </span>
        )}
        {!card.isExpired && isExpiringSoon && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-black animate-pulse">
            ⚠️ Expiring Soon
          </span>
        )}
        {card.finish !== 'normal' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
            ✨ {card.finish}
          </span>
        )}
      </div>

      {/* Card Image */}
      <motion.div 
        className={`relative aspect-[3/4] overflow-hidden ${finishEffects[card.finish]}`}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      >
        <motion.img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 card-3d"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x400/1e293b/white?text=${encodeURIComponent(card.name)}`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Rarity Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`
            w-3 h-3 rounded-full bg-gradient-to-br ${rarityColors[card.rarity]}
            shadow-lg ring-2 ring-white/50
          `} />
        </div>
      </motion.div>

      {/* Card Details */}
      {showDetails && (
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                {card.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  bg-gradient-to-r ${rarityColors[card.rarity]} bg-opacity-20 text-white border border-opacity-50
                `}>
                  {card.rarity}
                </span>
                {card.category && (
                  <span className="text-xs text-gray-400">
                    {card.category}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">💰</span>
                <span className="text-lg font-bold text-white">
                  {card.value.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-gray-400">credits</span>
            </div>
          </div>

          {/* Description */}
          {card.description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {card.description}
            </p>
          )}

          {/* Expiry Timer */}
          {showExpiry && !card.isExpired && (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Expires in:</span>
                <CountdownTimer
                  targetDate={card.expiryDate}
                  format="compact"
                  showDays={false}
                  className="text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Hover Effect */}
      <motion.div 
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Enhanced Holographic Effect */}
      {card.finish === 'holographic' && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)',
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)',
              'linear-gradient(225deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </motion.div>
  );
};