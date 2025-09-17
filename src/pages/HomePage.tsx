import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { PackGrid } from '../components/packs';
import { TopCardsCarousel } from '../components/cards';
import { Button, CarouselSkeleton, PackGridSkeleton } from '../components/ui';
import { PaymentMethod } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    availablePacks, 
    topCards, 
    isLoading, 
    purchasePack, 
    user, 
    isAuthenticated 
  } = useAppStore();

  const handlePackPurchase = async (packId: string) => {
    if (!isAuthenticated) {
      alert('Please log in to purchase packs');
      return;
    }

    try {
      const response = await purchasePack(packId, PaymentMethod.CREDITS);
      if (response.success) {
        navigate(`/open-pack/${packId}`, { 
          state: { 
            cards: response.cards,
            packName: availablePacks.find(p => p.id === packId)?.name 
          } 
        });
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const isLoadingData = isLoading === 'loading';
  const hasData = availablePacks.length > 0 || topCards.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-background-primary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500 rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-gaming font-bold text-white mb-6 text-reveal">
              <span>Welcome</span> <span>to</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hover-glow">
                HobbyHunter
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto slide-up">
              Open digital card packs, collect rare cards, and ship your favorites to your doorstep!
            </p>
            
            <div className="scale-in">
              {isAuthenticated && user ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="bg-background-card/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-600 hover-lift pulse-glow">
                    <span className="text-gray-300">Your Balance:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-400">💰</span>
                      <span className="text-2xl font-bold text-white">
                        {user.credits.toLocaleString()}
                      </span>
                      <span className="text-gray-400">credits</span>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => navigate('/account')}
                    className="liquid-button hover-lift"
                  >
                    💳 Add Credits
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="primary" size="lg" className="liquid-button hover-lift">
                    🎮 Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="morph-hover">
                    📖 Learn More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Top Cards Carousel */}
        <section className="slide-up">
          {isLoadingData && !hasData ? (
            <CarouselSkeleton />
          ) : (
            <div className="fade-in">
              <TopCardsCarousel 
                cards={topCards} 
                loading={isLoadingData}
              />
            </div>
          )}
        </section>

        {/* All Packs Grid */}
        <section className="slide-up">
          <div className="text-center mb-8 fade-in">
            <h2 className="text-3xl font-bold text-white mb-4 text-reveal">
              <span>🎴</span> <span>All</span> <span>Card</span> <span>Packs</span>
            </h2>
            <p className="text-gray-400">Choose your adventure - each pack contains unique surprises!</p>
          </div>
          
          {isLoadingData && !hasData ? (
            <PackGridSkeleton count={8} />
          ) : (
            <div className="stagger-children">
              <PackGrid 
                packs={availablePacks}
                onPackPurchase={handlePackPurchase}
                loading={isLoadingData}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;