import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyCardsController } from '@/controller/MyCardsController';

const MyCards = () => {
  const navigate = useNavigate();
  const {
    // State
    activeTab,
    isLoading,
    error,
    
    // Data
    displayCards,
    statistics,
    
    // Actions
    handleTabChange,
    handleSell,
    handleShip,
    
    // Utils
    getStatusBadgeConfig,
    hasAvailableActions,
    clearError
  } = useMyCardsController();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-foreground">Loading your cards...</h1>
          </div>
        </main>
      </div>
    );
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
              onClick={() => handleTabChange('all')}
              className={`pb-2 px-1 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              All cards
            </button>
            <button
              onClick={() => handleTabChange('locked')}
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
              {displayCards.map((card) => {
                const statusConfig = getStatusBadgeConfig(card.status);
                return (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{card.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{card.cardName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{card.rarity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{card.sellFor}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{card.expireDate}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {hasAvailableActions(card) && (
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
                );
              })}
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