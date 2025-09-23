import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PackCard from '@/components/PackCard';
import CardDisplay from '@/components/CardDisplay';
import PackOpening from '@/components/PackOpening';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Package } from 'lucide-react';
import { useHomeController, getLeftColumnData, getWhyChooseUsData } from '@/controller/HomeController';

const Home = () => {
  const navigate = useNavigate();
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  
  const {
    openedCards,
    isOpening,
    featuredPack,
    availablePacks,
    potentialHits,
    shouldShowLeftColumn,
    centerColumnClass,
    handleBuyPack,
    handlePackOpeningComplete,
    handleSkipToRares,
  } = useHomeController({ setIsOpeningPack });
  
  const leftColumnData = getLeftColumnData();
  const whyChooseUsData = getWhyChooseUsData();

  if (isOpeningPack) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isOpening ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <motion.div
                  className="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Package className="h-16 w-16 text-primary-foreground" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground">Opening your pack...</h2>
                <p className="text-muted-foreground">Get ready for some amazing cards!</p>
              </div>
            </div>
          ) : (
            <PackOpening
              cards={openedCards}
              onComplete={handlePackOpeningComplete}
              onSkipToRares={handleSkipToRares}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          {/* Left Column - Hot Buyback & Recent Pulls - Only show if more than 1 pack */}
          {shouldShowLeftColumn && (
            <div className="lg:col-span-1 space-y-6">
              {/* Hot Buyback Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card-container p-6"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                  {leftColumnData.hotBuybackCard.badgeText}
                </div>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <div className="w-12 h-12 bg-muted-foreground/20 rounded"></div>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{leftColumnData.hotBuybackCard.title}</p>
              </motion.div>

              {/* Recent Big Pulls */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card-container p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Big Pulls</h3>
                <div className="space-y-3">
                  {leftColumnData.recentBigPulls.map((pull) => (
                    <div key={pull.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{pull.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{pull.packType}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{pull.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top 5 Buybacks */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card-container p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Top 5 Buybacks</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 pb-2 border-b border-border">
                    <span>Card Name</span>
                    <span>Buyback Price ($)</span>
                    <span>Multiplier</span>
                  </div>
                  {leftColumnData.topBuybacks.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                      <span className="text-gray-900 dark:text-gray-100">${item.price}</span>
                      <span className="text-gray-900 dark:text-gray-100">{item.multiplier}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Center Column - Featured Pack */}
          <div className={centerColumnClass}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PackCard 
                pack={featuredPack} 
                onBuyNow={() => handleBuyPack(featuredPack.id)}
                className="transform hover:scale-100 transition-transform"
              />
            </motion.div>
          {/* Potential Hits */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-left text-gray-900 dark:text-gray-100 mb-8">Potential hits</h2>
            <div className="flex overflow-x-auto gap-6 pb-4">
              {potentialHits.map((card, index) => (
                <div key={card.id} className="flex-shrink-0 min-w-[300px]">
                  <CardDisplay card={card} index={index} />
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              *Prices updated daily from MTGGoldfish / TCGPlayer
            </p>
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUsData.map((item, index) => {
                const IconComponent = item.icon === 'Shield' ? Shield : item.icon === 'Zap' ? Zap : Package;
                return (
                  <div key={index} className="card-container p-6 text-center">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>


        {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm">
                HOBBY HUNTER
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/cards')}>
                CARDS
              </Button>
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/about')}>
                ABOUT
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Copyright 2025. HobbyHunter. All Rights Reserved</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <p>📧 hobbyhunter@gmail.com</p>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">𝕏</span>
                </div>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
          </div>
        </div>

        
      </main>

    </div>
  );
};

export default Home;