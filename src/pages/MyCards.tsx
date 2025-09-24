import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface CardData {
  id: number;
  cardName: string;
  rarity: string;
  sellFor: string;
  expireDate: string;
  status: 'In Shipping' | 'Delivered' | 'Locked' | 'Available' | 'Sold';
}

const MyCards = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'locked'>('all');

  // Sample card data
  const allCards: CardData[] = [
    {
      id: 1,
      cardName: 'Sephiroth',
      rarity: 'Common',
      sellFor: '$100',
      expireDate: '12/4/2025',
      status: 'In Shipping'
    },
    {
      id: 2,
      cardName: 'Cloud Strife',
      rarity: 'Common',
      sellFor: '$80',
      expireDate: '12/4/2025',
      status: 'Delivered'
    },
    {
      id: 3,
      cardName: 'Rare Summon',
      rarity: 'Uncommon',
      sellFor: '$60',
      expireDate: '12/3/2025',
      status: 'Locked'
    },
    {
      id: 4,
      cardName: 'Chocobo',
      rarity: 'Rare',
      sellFor: '$40',
      expireDate: '12/4/2025',
      status: 'Available'
    },
    {
      id: 5,
      cardName: 'Materia',
      rarity: 'Legendary',
      sellFor: '$25',
      expireDate: '12/4/2025',
      status: 'Sold'
    }
  ];

  const lockedCards = allCards.filter(card => card.status === 'Locked');
  const displayCards = activeTab === 'all' ? allCards : lockedCards;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [isAuthenticated, navigate]);

  const getStatusBadge = (status: CardData['status']) => {
    const statusConfig = {
      'In Shipping': { className: 'bg-blue-500 text-white', label: 'In Shipping' },
      'Delivered': { className: 'bg-green-500 text-white', label: 'Delivered' },
      'Locked': { className: 'bg-red-500 text-white', label: 'Locked' },
      'Available': { className: 'bg-yellow-500 text-black', label: 'Available' },
      'Sold': { className: 'bg-gray-500 text-white', label: 'Sold' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleSell = (cardId: number) => {
    // Handle sell action
    console.log('Sell card:', cardId);
  };

  const handleShip = (cardId: number) => {
    // Handle ship action
    console.log('Ship card:', cardId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">My Cards</h1>
          
          {/* Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-1 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              All cards
            </button>
            <button
              onClick={() => setActiveTab('locked')}
              className={`pb-2 px-1 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'locked'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Lock cards
            </button>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Card number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Card Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rarity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Sell for</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Expire Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{card.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{card.cardName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.rarity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.sellFor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.expireDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(card.status)}</td>
                  <td className="px-6 py-4">
                    {card.status === 'Available' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSell(card.id)}
                          className="text-sm border border-gray-300"
                        >
                          Sell
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShip(card.id)}
                          className="text-sm border border-gray-300"
                        >
                          Ship
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayCards.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'all' ? 'No cards in your collection yet' : 'No locked cards found'}
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {activeTab === 'all' 
                ? 'Purchase card packs to start building your collection and unlock valuable cards!' 
                : 'You don\'t have any locked cards at the moment.'
              }
            </p>
            {activeTab === 'all' && (
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Card Packs
              </button>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyCards;