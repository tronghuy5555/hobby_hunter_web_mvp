import React, { useState, useMemo } from 'react';
import type { Pack, PackSortOption } from '../../types';
import { PackCard } from './PackCard';
import { LoadingSpinner } from '../ui';

interface PackGridProps {
  packs: Pack[];
  onPackPurchase: (packId: string) => void;
  loading?: boolean;
  className?: string;
}

export const PackGrid: React.FC<PackGridProps> = ({
  packs,
  onPackPurchase,
  loading = false,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<PackSortOption>('price');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  // Filter and sort packs
  const filteredAndSortedPacks = useMemo(() => {
    let filtered = [...packs];

    // Filter by availability
    if (filterAvailable) {
      filtered = filtered.filter(pack => pack.isAvailable !== false);
    }

    // Filter by price range
    filtered = filtered.filter(pack => 
      pack.price >= priceRange[0] && pack.price <= priceRange[1]
    );

    // Sort packs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        case 'newest':
          return new Date(b.featuredUntil || 0).getTime() - new Date(a.featuredUntil || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [packs, sortBy, filterAvailable, priceRange]);

  const maxPrice = Math.max(...packs.map(pack => pack.price));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters and Sort */}
      <div className="bg-background-secondary rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as PackSortOption)}
              className="bg-background-card border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="price">Price (Low to High)</option>
              <option value="name">Name (A-Z)</option>
              <option value="rarity">Rarity</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Availability Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.checked)}
                className="rounded border-gray-600 bg-background-card text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">Available only</span>
            </label>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Price:</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-20"
              />
              <span className="text-xs text-gray-400">
                ≤ {priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing {filteredAndSortedPacks.length} of {packs.length} packs
        </p>
        
        {filteredAndSortedPacks.length === 0 && (
          <button
            onClick={() => {
              setSortBy('price');
              setFilterAvailable(false);
              setPriceRange([0, maxPrice]);
            }}
            className="text-primary-400 hover:text-primary-300 text-sm underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Pack Grid */}
      {filteredAndSortedPacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedPacks.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              onPurchase={onPackPurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-1.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No packs found</h3>
          <p className="text-gray-400">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};