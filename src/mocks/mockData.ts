import { 
  Rarity, 
  Finish, 
  TransactionType, 
  TransactionStatus
} from '../types';
import type { 
  Card, 
  Pack, 
  User, 
  Transaction
} from '../types';

// Mock Cards Data
export const mockCards: Card[] = [
  // Mythic Cards
  {
    id: 'card-001',
    name: 'Celestial Dragon Emperor',
    image: '/images/cards/celestial-dragon.jpg',
    rarity: Rarity.MYTHIC,
    value: 5000,
    finish: Finish.HOLOGRAPHIC,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'The supreme ruler of all dragonkind, wielding the power of the stars themselves.',
    category: 'Dragons'
  },
  {
    id: 'card-002',
    name: 'Void Walker Supreme',
    image: '/images/cards/void-walker.jpg',
    rarity: Rarity.MYTHIC,
    value: 4800,
    finish: Finish.HOLOGRAPHIC,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'A being that exists between dimensions, master of space and time.',
    category: 'Cosmic'
  },

  // Legendary Cards
  {
    id: 'card-003',
    name: 'Ancient Phoenix Reborn',
    image: '/images/cards/phoenix.jpg',
    rarity: Rarity.LEGENDARY,
    value: 2500,
    finish: Finish.FOIL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Rising from ashes with eternal flame, the phoenix brings rebirth and renewal.',
    category: 'Mythical Beasts'
  },
  {
    id: 'card-004',
    name: 'Shadowblade Assassin',
    image: '/images/cards/shadowblade.jpg',
    rarity: Rarity.LEGENDARY,
    value: 2200,
    finish: Finish.HOLOGRAPHIC,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Master of stealth and precision, striking from the shadows without warning.',
    category: 'Warriors'
  },
  {
    id: 'card-005',
    name: 'Crystal Sage Archmage',
    image: '/images/cards/crystal-sage.jpg',
    rarity: Rarity.LEGENDARY,
    value: 2300,
    finish: Finish.FOIL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Wielder of crystalline magic, channeling the earth\'s pure energy.',
    category: 'Mages'
  },

  // Epic Cards
  {
    id: 'card-006',
    name: 'Storm Giant Warlord',
    image: '/images/cards/storm-giant.jpg',
    rarity: Rarity.EPIC,
    value: 800,
    finish: Finish.FOIL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Commanding the power of thunder and lightning in battle.',
    category: 'Giants'
  },
  {
    id: 'card-007',
    name: 'Mystic Forest Guardian',
    image: '/images/cards/forest-guardian.jpg',
    rarity: Rarity.EPIC,
    value: 750,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Ancient protector of the sacred woodlands and all natural life.',
    category: 'Nature'
  },
  {
    id: 'card-008',
    name: 'Cyber Knight Sentinel',
    image: '/images/cards/cyber-knight.jpg',
    rarity: Rarity.EPIC,
    value: 900,
    finish: Finish.FOIL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Fusion of ancient chivalry and advanced technology.',
    category: 'Tech'
  },

  // Rare Cards
  {
    id: 'card-009',
    name: 'Fire Elemental Mage',
    image: '/images/cards/fire-elemental.jpg',
    rarity: Rarity.RARE,
    value: 300,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Master of flame magic, capable of devastating pyromancy.',
    category: 'Elementals'
  },
  {
    id: 'card-010',
    name: 'Ice Queen Sorceress',
    image: '/images/cards/ice-queen.jpg',
    rarity: Rarity.RARE,
    value: 320,
    finish: Finish.FOIL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Ruler of the frozen realm, wielding the power of eternal winter.',
    category: 'Royalty'
  },
  {
    id: 'card-011',
    name: 'Lightning Speedster',
    image: '/images/cards/lightning-speedster.jpg',
    rarity: Rarity.RARE,
    value: 280,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Moving at the speed of light, leaving trails of electricity.',
    category: 'Speedsters'
  },

  // Uncommon Cards
  {
    id: 'card-012',
    name: 'Battle Hardened Warrior',
    image: '/images/cards/battle-warrior.jpg',
    rarity: Rarity.UNCOMMON,
    value: 80,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'A seasoned fighter with countless victories in combat.',
    category: 'Warriors'
  },
  {
    id: 'card-013',
    name: 'Woodland Archer',
    image: '/images/cards/woodland-archer.jpg',
    rarity: Rarity.UNCOMMON,
    value: 75,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Expert marksman with unparalleled accuracy in forest terrain.',
    category: 'Rangers'
  },
  {
    id: 'card-014',
    name: 'Crystal Healer',
    image: '/images/cards/crystal-healer.jpg',
    rarity: Rarity.UNCOMMON,
    value: 90,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Using the power of healing crystals to restore life and vitality.',
    category: 'Healers'
  },

  // Common Cards
  {
    id: 'card-015',
    name: 'Village Defender',
    image: '/images/cards/village-defender.jpg',
    rarity: Rarity.COMMON,
    value: 25,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'A brave soul protecting their homeland from threats.',
    category: 'Defenders'
  },
  {
    id: 'card-016',
    name: 'Mountain Scout',
    image: '/images/cards/mountain-scout.jpg',
    rarity: Rarity.COMMON,
    value: 30,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Swift and agile explorer of treacherous mountain paths.',
    category: 'Scouts'
  },
  {
    id: 'card-017',
    name: 'Apprentice Mage',
    image: '/images/cards/apprentice-mage.jpg',
    rarity: Rarity.COMMON,
    value: 20,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Young student learning the fundamentals of magical arts.',
    category: 'Mages'
  },
  {
    id: 'card-018',
    name: 'Forest Spirit',
    image: '/images/cards/forest-spirit.jpg',
    rarity: Rarity.COMMON,
    value: 35,
    finish: Finish.NORMAL,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isExpired: false,
    description: 'Gentle guardian of woodland creatures and plants.',
    category: 'Nature'
  }
];

// Mock Packs Data
export const mockPacks: Pack[] = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    price: 100,
    image: '/images/packs/starter-pack.jpg',
    rarity: Rarity.COMMON,
    cardCount: 5,
    guarantees: [
      { rarity: Rarity.COMMON, count: 3 },
      { rarity: Rarity.UNCOMMON, count: 2 }
    ],
    description: 'Perfect for beginners! Contains 5 cards with guaranteed uncommons.',
    isAvailable: true
  },
  {
    id: 'adventure-pack',
    name: 'Adventure Pack',
    price: 250,
    image: '/images/packs/adventure-pack.jpg',
    rarity: Rarity.UNCOMMON,
    cardCount: 8,
    guarantees: [
      { rarity: Rarity.COMMON, count: 4 },
      { rarity: Rarity.UNCOMMON, count: 3 },
      { rarity: Rarity.RARE, count: 1 }
    ],
    description: 'Embark on an adventure with 8 cards including a guaranteed rare!',
    isAvailable: true
  },
  {
    id: 'premium-pack',
    name: 'Premium Pack',
    price: 500,
    image: '/images/packs/premium-pack.jpg',
    rarity: Rarity.RARE,
    cardCount: 10,
    guarantees: [
      { rarity: Rarity.UNCOMMON, count: 5 },
      { rarity: Rarity.RARE, count: 3 },
      { rarity: Rarity.EPIC, count: 2 }
    ],
    description: 'Premium collection with higher rarity cards and epic guarantees.',
    isAvailable: true
  },
  {
    id: 'legendary-pack',
    name: 'Legendary Pack',
    price: 1000,
    image: '/images/packs/legendary-pack.jpg',
    rarity: Rarity.EPIC,
    cardCount: 12,
    guarantees: [
      { rarity: Rarity.RARE, count: 6 },
      { rarity: Rarity.EPIC, count: 4 },
      { rarity: Rarity.LEGENDARY, count: 2 }
    ],
    description: 'Legendary treasures await! Guaranteed legendary cards included.',
    isAvailable: true
  },
  {
    id: 'mythic-pack',
    name: 'Mythic Ultimate Pack',
    price: 2500,
    image: '/images/packs/mythic-pack.jpg',
    rarity: Rarity.LEGENDARY,
    cardCount: 15,
    guarantees: [
      { rarity: Rarity.EPIC, count: 8 },
      { rarity: Rarity.LEGENDARY, count: 5 },
      { rarity: Rarity.MYTHIC, count: 2 }
    ],
    description: 'The ultimate pack! Includes guaranteed mythic cards - the rarest of all!',
    isAvailable: true,
    featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Featured for 7 days
  },
  {
    id: 'limited-edition',
    name: 'Limited Holiday Pack',
    price: 750,
    image: '/images/packs/holiday-pack.jpg',
    rarity: Rarity.EPIC,
    cardCount: 10,
    guarantees: [
      { rarity: Rarity.RARE, count: 4 },
      { rarity: Rarity.EPIC, count: 3 },
      { rarity: Rarity.LEGENDARY, count: 3 }
    ],
    description: 'Special holiday edition with exclusive seasonal cards!',
    isAvailable: true,
    featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Featured for 30 days
  }
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'DragonCollector',
    email: 'dragon@hobbyhunter.com',
    credits: 1500,
    joinDate: new Date('2024-01-15'),
    avatar: '/images/avatars/dragon-collector.jpg',
    lastLogin: new Date()
  },
  {
    id: 'user-002',
    username: 'CardMaster99',
    email: 'cardmaster@hobbyhunter.com',
    credits: 2750,
    joinDate: new Date('2023-11-20'),
    avatar: '/images/avatars/card-master.jpg',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 'user-003',
    username: 'MythicHunter',
    email: 'mythic@hobbyhunter.com',
    credits: 500,
    joinDate: new Date('2024-03-10'),
    avatar: '/images/avatars/mythic-hunter.jpg',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
];

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: TransactionType.PURCHASE,
    amount: 500,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: TransactionStatus.COMPLETED,
    description: 'Premium Pack Purchase',
    details: {
      packId: 'premium-pack',
      packName: 'Premium Pack',
      paymentMethod: 'credits'
    }
  },
  {
    id: 'txn-002',
    type: TransactionType.CREDIT_ADD,
    amount: 1000,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: TransactionStatus.COMPLETED,
    description: 'PayPal Credit Purchase',
    details: {
      paypalTransactionId: 'pp_1234567890',
      creditsAdded: 1000
    }
  },
  {
    id: 'txn-003',
    type: TransactionType.SHIPPING,
    amount: 25,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: TransactionStatus.COMPLETED,
    description: 'Card Shipping - 3 cards',
    details: {
      trackingNumber: 'HH2024091301',
      cardCount: 3,
      shippingMethod: 'Standard'
    }
  },
  {
    id: 'txn-004',
    type: TransactionType.PURCHASE,
    amount: 1000,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: TransactionStatus.COMPLETED,
    description: 'Legendary Pack Purchase',
    details: {
      packId: 'legendary-pack',
      packName: 'Legendary Pack',
      paymentMethod: 'credits'
    }
  },
  {
    id: 'txn-005',
    type: TransactionType.PAYPAL,
    amount: 2000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: TransactionStatus.COMPLETED,
    description: 'PayPal Payment for Credits',
    details: {
      paypalTransactionId: 'pp_9876543210',
      creditsAdded: 2000
    }
  }
];

// Helper function to get random cards for pack opening
export const generateRandomCards = (pack: Pack): Card[] => {
  const result: Card[] = [];
  const availableCards = [...mockCards];
  
  // Sort guarantees by rarity order (common first, mythic last)
  const sortedGuarantees = pack.guarantees.sort((a, b) => {
    const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });
  
  // Fulfill guarantees first
  for (const guarantee of sortedGuarantees) {
    const cardsOfRarity = availableCards.filter(card => card.rarity === guarantee.rarity);
    for (let i = 0; i < guarantee.count && cardsOfRarity.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * cardsOfRarity.length);
      const selectedCard = cardsOfRarity.splice(randomIndex, 1)[0];
      
      // Create a new card instance with updated expiry
      const newCard: Card = {
        ...selectedCard,
        id: `${selectedCard.id}-${Date.now()}-${i}`, // Unique ID for each instance
        packId: pack.id,
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isExpired: false
      };
      
      result.push(newCard);
      
      // Remove from available cards to avoid duplicates
      const originalIndex = availableCards.findIndex(card => card.id === selectedCard.id);
      if (originalIndex > -1) {
        availableCards.splice(originalIndex, 1);
      }
    }
  }
  
  // Fill remaining slots with random cards
  const remainingSlots = pack.cardCount - result.length;
  for (let i = 0; i < remainingSlots && availableCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards.splice(randomIndex, 1)[0];
    
    const newCard: Card = {
      ...selectedCard,
      id: `${selectedCard.id}-${Date.now()}-${i + result.length}`,
      packId: pack.id,
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isExpired: false
    };
    
    result.push(newCard);
  }
  
  return result;
};

// Helper function to get user's cards (for My Cards page)
export const getUserCards = (userId: string): Card[] => {
  // Simulate user having some cards from previous pack openings
  const userCardIds = ['card-003', 'card-009', 'card-012', 'card-015', 'card-007', 'card-001'];
  return userCardIds.map((cardId, index) => {
    const baseCard = mockCards.find(card => card.id === cardId);
    if (!baseCard) return null;
    
    return {
      ...baseCard,
      id: `${cardId}-user-${userId}-${index}`,
      expiryDate: new Date(Date.now() + (10 - index) * 24 * 60 * 60 * 1000), // Different expiry dates
      isExpired: index >= 5 // Last card is expired for testing
    };
  }).filter(Boolean) as Card[];
};

// Helper function to get top 5 most valuable cards
export const getTopCards = (): Card[] => {
  return [...mockCards]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};