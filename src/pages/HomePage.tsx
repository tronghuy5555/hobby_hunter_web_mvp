import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import PackCard from '@/components/PackCard';
import CardDisplay from '@/components/CardDisplay';
import { Link } from 'react-router-dom';
import heroPackImage from '@/assets/hero-pack.jpg';

const HomePage = () => {
  const { featuredPacks, setCurrentPack } = useGameStore();
  
  const handleBuyPack = (pack: any) => {
    setCurrentPack(pack);
    // In a real app, this would navigate to payment flow
    console.log('Buying pack:', pack.name);
  };

  const topCards = featuredPacks[0]?.topCards || [];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-primary text-white px-4 py-2">
              Safe Virtual Pack Opening
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                HobbyHunter
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Experience the thrill of opening trading card packs in a safe, controlled environment. 
              Get that dopamine hit without the real-world violence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/packs">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg">
                  Start Opening Packs
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Pack Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Featured Pack
            </h2>
            
            <div className="max-w-md mx-auto">
              {featuredPacks.length > 0 && (
                <PackCard
                  pack={featuredPacks[0]}
                  onBuy={handleBuyPack}
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Cards Showcase */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Current Top Cards
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {topCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <CardDisplay card={card} size="md" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose HobbyHunter?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 rounded-lg bg-gradient-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe Environment</h3>
                <p className="text-muted-foreground">
                  No real-world violence or disputes. Enjoy the thrill in a controlled, safe space.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rare rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Pack Experience</h3>
                <p className="text-muted-foreground">
                  Authentic opening animations and the same dopamine rush as physical packs.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gradient-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-mythic rounded-full flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Physical Options</h3>
                <p className="text-muted-foreground">
                  Convert virtual cards to physical ones or credits. Your choice, your control.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;