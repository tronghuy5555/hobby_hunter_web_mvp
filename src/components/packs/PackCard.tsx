import React from 'react';
import { Rarity } from '../../types';
import type { PackCardProps } from '../../types';
import { Button } from '../ui';

export const PackCard: React.FC<PackCardProps> = ({
  pack,
  onPurchase,
  disabled = false,
  loading = false,
  className = ''
}) => {
  const rarityColors = {
    [Rarity.COMMON]: 'border-rarity-common bg-rarity-common',
    [Rarity.UNCOMMON]: 'border-rarity-uncommon bg-rarity-uncommon',
    [Rarity.RARE]: 'border-rarity-rare bg-rarity-rare',
    [Rarity.EPIC]: 'border-rarity-epic bg-rarity-epic',
    [Rarity.LEGENDARY]: 'border-rarity-legendary bg-rarity-legendary',
    [Rarity.MYTHIC]: 'border-rarity-mythic bg-rarity-mythic'
  };

  const rarityGlow = {
    [Rarity.COMMON]: 'rarity-glow common',
    [Rarity.UNCOMMON]: 'rarity-glow uncommon',
    [Rarity.RARE]: 'rarity-glow rare',
    [Rarity.EPIC]: 'rarity-glow epic',
    [Rarity.LEGENDARY]: 'rarity-glow legendary',
    [Rarity.MYTHIC]: 'rarity-glow mythic'
  };

  const handlePurchase = () => {
    if (!disabled && !loading) {
      onPurchase(pack.id);
    }
  };

  return (
    <div className={`
      group relative bg-background-card rounded-xl overflow-hidden 
      border-2 transition-all duration-300 hover:scale-105
      ${rarityColors[pack.rarity]} ${rarityGlow[pack.rarity]}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `}>
      {/* Featured Badge */}
      {pack.featuredUntil && new Date(pack.featuredUntil) > new Date() && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-black">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Pack Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={pack.image}
          alt={pack.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder image
            e.currentTarget.src = `https://via.placeholder.com/300x400/1e293b/white?text=${encodeURIComponent(pack.name)}`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Pack Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`
              px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${rarityColors[pack.rarity]} bg-opacity-20 text-white border
            `}>
              {pack.rarity}
            </span>
            <span className="text-white text-sm font-medium">
              {pack.cardCount} cards
            </span>
          </div>
        </div>
      </div>

      {/* Pack Details */}
      <div className="p-4 bg-background-secondary">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
          {pack.name}
        </h3>
        
        {pack.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {pack.description}
          </p>
        )}

        {/* Guarantees */}
        {pack.guarantees && pack.guarantees.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Guaranteed:</p>
            <div className="flex flex-wrap gap-1">
              {pack.guarantees.map((guarantee, index) => (
                <span
                  key={index}
                  className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${rarityColors[guarantee.rarity]} bg-opacity-20 text-white border border-opacity-50
                  `}
                >
                  {guarantee.count}x {guarantee.rarity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price and Purchase */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">💰</span>
            <span className="text-xl font-bold text-white">
              {pack.price.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm">credits</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePurchase}
            disabled={disabled || !pack.isAvailable}
            loading={loading}
            className="shrink-0"
          >
            {!pack.isAvailable ? 'Sold Out' : 'Open Pack'}
          </Button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};