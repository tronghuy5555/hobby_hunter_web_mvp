import React, { useState, useMemo } from 'react';
import { Rarity } from '../../types';
import type { CardListProps, CardSortOption } from '../../types';
import { CardDisplay } from './CardDisplay';
import { Button } from '../ui';
import { useUserStore } from '../../store';

export const CardList: React.FC<CardListProps> = ({
  cards,
  onShip,
  filter,
  sortBy = 'newest',
  onCardSelect,
  selectedCards = [],
  showBulkActions = false
}) => {
  const { cardViewMode, setCardViewMode } = useUserStore();
  const [localSortBy, setLocalSortBy] = useState<CardSortOption>(sortBy);
  const [showExpiredCards, setShowExpiredCards] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<Rarity[]>([]);
  const [valueRange, setValueRange] = useState<[number, number]>([0, 10000]);

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = [...cards];

    // Apply expired filter
    if (!showExpiredCards) {
      filtered = filtered.filter(card => !card.isExpired);
    }

    // Apply rarity filter
    if (rarityFilter.length > 0) {
      filtered = filtered.filter(card => rarityFilter.includes(card.rarity));
    }

    // Apply value range filter
    filtered = filtered.filter(card => 
      card.value >= valueRange[0] && card.value <= valueRange[1]
    );

    // Apply custom filter if provided
    if (filter) {
      if (filter.rarities.length > 0) {
        filtered = filtered.filter(card => filter.rarities.includes(card.rarity));
      }
      if (filter.minValue !== undefined) {
        filtered = filtered.filter(card => card.value >= filter.minValue!);
      }
      if (filter.maxValue !== undefined) {
        filtered = filtered.filter(card => card.value <= filter.maxValue!);
      }
      if (filter.showExpired !== undefined) {
        if (!filter.showExpired) {
          filtered = filtered.filter(card => !card.isExpired);
        }
      }
    }

    // Sort cards
    filtered.sort((a, b) => {
      switch (localSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]; // Highest rarity first
        case 'value':
          return b.value - a.value; // Highest value first
        case 'expiry':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(); // Soonest expiry first
        case 'newest':
        default:
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime(); // Newest first
      }
    });

    return filtered;
  }, [cards, localSortBy, showExpiredCards, rarityFilter, valueRange, filter]);

  const maxValue = Math.max(...cards.map(card => card.value), 1000);

  const handleSelectAll = () => {
    if (onCardSelect) {
      const nonExpiredCards = filteredAndSortedCards.filter(card => !card.isExpired);
      nonExpiredCards.forEach(card => onCardSelect(card.id));
    }
  };

  const handleClearSelection = () => {
    if (onCardSelect) {
      selectedCards.forEach(cardId => onCardSelect(cardId));
    }
  };

  const handleShipSelected = () => {
    if (onShip && selectedCards.length > 0) {
      onShip(selectedCards);
    }
  };

  const selectedCardObjects = cards.filter(card => selectedCards.includes(card.id));
  const totalSelectedValue = selectedCardObjects.reduce((sum, card) => sum + card.value, 0);

  const rarityOptions = [
    { value: Rarity.MYTHIC, label: 'Mythic', color: 'text-rarity-mythic' },
    { value: Rarity.LEGENDARY, label: 'Legendary', color: 'text-rarity-legendary' },
    { value: Rarity.EPIC, label: 'Epic', color: 'text-rarity-epic' },
    { value: Rarity.RARE, label: 'Rare', color: 'text-rarity-rare' },
    { value: Rarity.UNCOMMON, label: 'Uncommon', color: 'text-rarity-uncommon' },
    { value: Rarity.COMMON, label: 'Common', color: 'text-rarity-common' }
  ];

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No cards found</h3>
        <p className="text-gray-400">Start opening packs to build your collection!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-background-secondary rounded-lg p-4 border border-gray-700 space-y-4">
        {/* Top Row - View Mode and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-background-card rounded-lg p-1">
              <button
                onClick={() => setCardViewMode('grid')}
                className={`p-2 rounded ${cardViewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setCardViewMode('list')}
                className={`p-2 rounded ${cardViewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Sort Options */}
            <select
              value={localSortBy}
              onChange={(e) => setLocalSortBy(e.target.value as CardSortOption)}
              className="bg-background-card border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="value">Highest Value</option>
              <option value="rarity">Highest Rarity</option>
              <option value="name">Name (A-Z)</option>
              <option value="expiry">Expiring Soon</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedCards.length} of {cards.length} cards
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Rarity Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Rarity:</label>
            <div className="flex flex-wrap gap-1">
              {rarityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (rarityFilter.includes(option.value)) {
                      setRarityFilter(prev => prev.filter(r => r !== option.value));
                    } else {
                      setRarityFilter(prev => [...prev, option.value]);
                    }
                  }}
                  className={`
                    px-2 py-1 rounded text-xs font-medium border transition-colors
                    ${rarityFilter.includes(option.value)
                      ? `${option.color} border-current bg-current bg-opacity-20`
                      : 'text-gray-400 border-gray-600 hover:text-white hover:border-gray-500'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showExpiredCards}
                onChange={(e) => setShowExpiredCards(e.target.checked)}
                className="rounded border-gray-600 bg-background-card text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">Show expired</span>
            </label>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Max value:</label>
              <input
                type="range"
                min="0"
                max={maxValue}
                step="100"
                value={valueRange[1]}
                onChange={(e) => setValueRange([valueRange[0], parseInt(e.target.value)])}
                className="w-20"
              />
              <span className="text-xs text-gray-400 min-w-[4rem]">
                {valueRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && selectedCards.length > 0 && (
        <div className="bg-primary-600/20 border border-primary-500 rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                {selectedCards.length} cards selected
              </span>
              <span className="text-yellow-400 font-semibold">
                Total value: {totalSelectedValue.toLocaleString()} credits
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" onClick={handleClearSelection}>
                Clear Selection
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                Select All Visible
              </Button>
              {onShip && (
                <Button variant="primary" size="sm" onClick={handleShipSelected}>
                  Ship Selected ({selectedCards.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards Display */}
      {filteredAndSortedCards.length > 0 ? (
        <div className={
          cardViewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedCards.map((card) => (
            <CardDisplay
              key={card.id}
              card={card}
              showDetails={true}
              showExpiry={true}
              onSelect={onCardSelect}
              isSelected={selectedCards.includes(card.id)}
              className={cardViewMode === 'list' ? 'flex flex-row max-w-full' : ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No cards match your filters</h3>
          <p className="text-gray-400">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};