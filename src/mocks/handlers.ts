import { http, HttpResponse } from 'msw';
import { 
  mockPacks, 
  mockCards, 
  mockUsers, 
  mockTransactions, 
  generateRandomCards,
  getUserCards,
  getTopCards 
} from './mockData';
import { 
  PaymentMethod,
  TransactionType,
  TransactionStatus 
} from '../types';
import type {
  LoginCredentials, 
  ShippingAddress
} from '../types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate current user (for demo purposes)
const currentUser = mockUsers[0];
let userCredits = currentUser.credits;

export const handlers = [
  // Authentication
  http.post('/api/auth/login', async ({ request }) => {
    const credentials = await request.json() as LoginCredentials;
    
    // Simple mock authentication - accept any valid email
    if (credentials.email && credentials.password) {
      return HttpResponse.json({
        success: true,
        user: {
          ...currentUser,
          credits: userCredits
        },
        token: 'mock-jwt-token'
      });
    }
    
    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  // Products & Packs
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: mockPacks
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const pack = mockPacks.find(p => p.id === params.id);
    if (!pack) {
      return HttpResponse.json(
        { success: false, error: 'Pack not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: pack });
  }),

  // Pack Purchase & Opening
  http.post('/api/purchase', async ({ request }) => {
    const body = await request.json() as { packId: string; paymentMethod: PaymentMethod };
    const { packId, paymentMethod } = body;
    
    const pack = mockPacks.find(p => p.id === packId);
    if (!pack) {
      return HttpResponse.json(
        { success: false, error: 'Pack not found' },
        { status: 404 }
      );
    }

    // Check credits if paying with credits
    if (paymentMethod === 'credits' && userCredits < pack.price) {
      return HttpResponse.json(
        { success: false, error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Deduct credits
    if (paymentMethod === 'credits') {
      userCredits -= pack.price;
    }

    // Generate cards for the pack
    const revealedCards = generateRandomCards(pack);

    const transaction = {
      id: generateId(),
      type: TransactionType.PURCHASE,
      amount: pack.price,
      date: new Date(),
      status: TransactionStatus.COMPLETED,
      description: `${pack.name} Purchase`,
      details: {
        packId,
        packName: pack.name,
        paymentMethod,
        cardCount: revealedCards.length
      }
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return HttpResponse.json({
      success: true,
      packId,
      cards: revealedCards,
      transaction
    });
  }),

  http.post('/api/packs/:id/open', async ({ params }) => {
    const pack = mockPacks.find(p => p.id === params.id);
    if (!pack) {
      return HttpResponse.json(
        { success: false, error: 'Pack not found' },
        { status: 404 }
      );
    }

    const cards = generateRandomCards(pack);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      success: true,
      cards,
      packId: pack.id,
      timestamp: new Date()
    });
  }),

  // Cards
  http.get('/api/cards/top5', () => {
    const topCards = getTopCards();
    return HttpResponse.json({
      success: true,
      data: topCards
    });
  }),

  http.get('/api/user/cards', () => {
    const userCards = getUserCards(currentUser.id);
    return HttpResponse.json({
      success: true,
      data: userCards
    });
  }),

  http.get('/api/cards/:id', ({ params }) => {
    const card = mockCards.find(c => c.id === params.id);
    if (!card) {
      return HttpResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: card });
  }),

  // User Management
  http.get('/api/user', () => {
    return HttpResponse.json({
      success: true,
      data: {
        ...currentUser,
        credits: userCredits
      }
    });
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const updates = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...currentUser,
        ...(updates as any),
        credits: userCredits
      }
    });
  }),

  // Shipping
  http.post('/api/user/ship', async ({ request }) => {
    const body = await request.json() as { 
      cardIds: string[]; 
      address: ShippingAddress;
      shippingOption?: string;
    };
    const { cardIds, address, shippingOption = 'standard' } = body;

    if (!cardIds || cardIds.length === 0) {
      return HttpResponse.json(
        { success: false, error: 'No cards selected for shipping' },
        { status: 400 }
      );
    }

    // Calculate shipping cost (mock logic)
    const baseShippingCost = 15;
    const perCardCost = 2;
    const shippingCost = baseShippingCost + (cardIds.length * perCardCost);

    // Deduct shipping cost from credits
    if (userCredits < shippingCost) {
      return HttpResponse.json(
        { success: false, error: 'Insufficient credits for shipping' },
        { status: 400 }
      );
    }

    userCredits -= shippingCost;

    const trackingNumber = `HH${Date.now()}`;
    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await new Promise(resolve => setTimeout(resolve, 1000));

    return HttpResponse.json({
      success: true,
      trackingNumber,
      estimatedDelivery,
      shippingCost,
      cardCount: cardIds.length
    });
  }),

  http.get('/api/shipping/tracking/:trackingNumber', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        trackingNumber: params.trackingNumber,
        status: 'in_transit',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        updates: [
          {
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'picked_up',
            location: 'Distribution Center'
          },
          {
            date: new Date(),
            status: 'in_transit',
            location: 'Regional Facility'
          }
        ]
      }
    });
  }),

  // Credits & Payments
  http.post('/api/credits/add', async ({ request }) => {
    const body = await request.json() as { amount: number };
    const { amount } = body;

    if (amount < 100 || amount > 10000) {
      return HttpResponse.json(
        { success: false, error: 'Invalid credit amount' },
        { status: 400 }
      );
    }

    userCredits += amount;

    const transaction = {
      id: generateId(),
      type: TransactionType.CREDIT_ADD,
      amount,
      date: new Date(),
      status: TransactionStatus.COMPLETED,
      description: 'Credit Purchase',
      details: {
        creditsAdded: amount,
        paymentMethod: 'paypal'
      }
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    return HttpResponse.json({
      success: true,
      creditsAdded: amount,
      newBalance: userCredits,
      transaction
    });
  }),

  http.post('/api/payment/paypal', async ({ request }) => {
    const body = await request.json() as { amount: number };
    const { amount } = body;

    // Simulate PayPal processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 10% chance of payment failure for testing
    if (Math.random() < 0.1) {
      return HttpResponse.json({
        success: false,
        error: 'Payment processing failed. Please try again.'
      }, { status: 400 });
    }

    const transactionId = `pp_${generateId()}`;

    return HttpResponse.json({
      success: true,
      transactionId,
      amount,
      status: TransactionStatus.COMPLETED,
      paymentMethod: 'paypal'
    });
  }),

  // Transaction History
  http.get('/api/user/transactions', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const userTransactions = [...mockTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const paginatedTransactions = userTransactions.slice(offset, offset + limit);

    return HttpResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: userTransactions.length,
        limit,
        offset,
        hasMore: offset + limit < userTransactions.length
      }
    });
  }),

  // Statistics & Analytics
  http.get('/api/user/stats', () => {
    const userCards = getUserCards(currentUser.id);
    const cardsByRarity = userCards.reduce((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = userCards.reduce((sum, card) => sum + card.value, 0);

    return HttpResponse.json({
      success: true,
      data: {
        totalCards: userCards.length,
        totalValue,
        cardsByRarity,
        packsOpened: 15, // Mock data
        creditsSpent: 2500, // Mock data
        accountAge: Math.floor((Date.now() - currentUser.joinDate.getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  }),

  // Search and Filtering
  http.get('/api/cards/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const rarity = url.searchParams.get('rarity');
    const category = url.searchParams.get('category');

    let filteredCards = [...mockCards];

    if (query) {
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (rarity) {
      filteredCards = filteredCards.filter(card => card.rarity === rarity);
    }

    if (category) {
      filteredCards = filteredCards.filter(card => card.category === category);
    }

    return HttpResponse.json({
      success: true,
      data: filteredCards,
      total: filteredCards.length
    });
  }),

  // Contact/Support
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return HttpResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      ticketId: `TICKET-${generateId().toUpperCase()}`
    });
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }),

  // Fallback handler for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    );
  })
];