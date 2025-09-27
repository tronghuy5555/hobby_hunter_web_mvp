import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PackCard from '@/components/PackCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHomeController } from '@/controller/HomeController';
import { Package, Star, Zap } from 'lucide-react';

const Packs = () => {
  const {
    availablePacks,
    featuredPack,
    handleBuyPack,
  } = useHomeController({ setIsOpeningPack: () => {} });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Packs</h1>
          <p className="text-muted-foreground">
            Choose from our collection of card packs and start building your collection
          </p>
        </div>

        {/* Featured Pack Section */}
        {featuredPack && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-semibold">Featured Pack</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div>
                <PackCard
                  pack={featuredPack}
                  onBuyNow={() => handleBuyPack(featuredPack.id)}
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Featured
                </Badge>
                <h3 className="text-xl font-semibold">{featuredPack.name}</h3>
                <p className="text-muted-foreground">
                  {featuredPack.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {featuredPack.cardCount} cards per pack
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Guaranteed rare+
                    </span>
                  </div>
                </div>
                <Button 
                  className="btn-primary w-full lg:w-auto"
                  onClick={() => handleBuyPack(featuredPack.id)}
                >
                  Buy for ${featuredPack.price}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* All Packs Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">All Packs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availablePacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PackCard
                  pack={pack}
                  onBuyNow={() => handleBuyPack(pack.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to start collecting</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">1. Choose a Pack</h3>
              <p className="text-sm text-muted-foreground">
                Select from our variety of card packs with different rarities and themes
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">2. Open Your Pack</h3>
              <p className="text-sm text-muted-foreground">
                Experience the excitement of digital pack opening with guaranteed rare cards
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">3. Collect & Ship</h3>
              <p className="text-sm text-muted-foreground">
                Build your collection and request physical shipping for your favorite cards
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Packs;