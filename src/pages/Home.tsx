import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PackCard from '@/components/PackCard';
import CardDisplay from '@/components/CardDisplay';
import PackOpening from '@/components/PackOpening';
import { Button } from '@/components/ui/button';
import { useAppStore, mockPacks, mockTopCards, Card } from '@/lib/store';
import { Shield, Zap, Package } from 'lucide-react';
import chocoboCard from '@/assets/card-chocobo.jpg';
import moogleCard from '@/assets/card-moogle.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { setCurrentPack, openedCards, isOpening, openPack, setIsOpening, clearOpenedCards } = useAppStore();
  const [isOpeningPack, setIsOpeningPack] = useState(false);

  const handleBuyPack = (packId: string) => {
    // In a real app, this would handle payment
    const pack = mockPacks.find(p => p.id === packId);
    if (!pack) return;
    
    setCurrentPack(pack);
    setIsOpening(true);
    setIsOpeningPack(true);
    
    // Simulate pack opening with mock cards
    setTimeout(() => {
      const mockCards: Card[] = [
        { id: 'opened-1', name: 'Chocobo Rider', rarity: 'common', price: 2, image: chocoboCard },
        { id: 'opened-2', name: 'Fire Spell', rarity: 'common', price: 1.5, image: '/placeholder-card.jpg' },
        { id: 'opened-3', name: 'Materia Shard', rarity: 'common', price: 3, image: '/placeholder-card.jpg' },
        mockTopCards[1], // Cloud Strife
        { id: 'opened-4', name: 'Moogle Helper', rarity: 'rare', price: 15, image: moogleCard },
      ];
      openPack(mockCards);
    }, 2000);
  };

  const handlePackOpeningComplete = () => {
    setIsOpeningPack(false);
    clearOpenedCards();
    // In a real app, cards would be added to user collection
  };

  const handleSkipToRares = () => {
    // This would be handled in PackOpening component
  };

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
          {/* Left Column - Hot Buyback & Recent Pulls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Hot Buyback Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-container p-6"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                HOT BUYBACK CARD
              </div>
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">We're paying $100 for Sephiroth today!</p>
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
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Baseball Starter Pack</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 seconds ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Baseball Starter Pack</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 seconds ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">1999 Upper Deck #156 Ken Griffey Jr (PSA 8 NM-MT)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Baseball Starter Pack</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 seconds ago</p>
                  </div>
                </div>
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
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-900 dark:text-gray-100">Sephiroth</span>
                  <span className="text-gray-900 dark:text-gray-100">$100</span>
                  <span className="text-gray-900 dark:text-gray-100">10x</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-900 dark:text-gray-100">Cloud Strife</span>
                  <span className="text-gray-900 dark:text-gray-100">$80</span>
                  <span className="text-gray-900 dark:text-gray-100">8x</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-900 dark:text-gray-100">Rare Summon</span>
                  <span className="text-gray-900 dark:text-gray-100">$60</span>
                  <span className="text-gray-900 dark:text-gray-100">6x</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-900 dark:text-gray-100">Chocobo</span>
                  <span className="text-gray-900 dark:text-gray-100">$40</span>
                  <span className="text-gray-900 dark:text-gray-100">4x</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-900 dark:text-gray-100">Materia</span>
                  <span className="text-gray-900 dark:text-gray-100">$25</span>
                  <span className="text-gray-900 dark:text-gray-100">2.5x</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Featured Pack */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PackCard 
                pack={mockPacks[0]} 
                onBuyNow={() => handleBuyPack(mockPacks[0].id)}
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
              {mockTopCards.map((card, index) => (
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
              <div className="card-container p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All transactions are processed through PayPal, ensuring your payments are safe, encrypted, and protected by industry standard security.
                </p>
              </div>
              
              <div className="card-container p-6 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Instant Buyback</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sell your cards back to the platform instantly and receive credit added to your account balance right away — no delays, no waiting.
                </p>
              </div>
              
              <div className="card-container p-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Ship Your Cards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Prefer to keep your rare pulls? Request physical shipping and get your cards securely delivered to your doorstep.
                </p>
              </div>
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