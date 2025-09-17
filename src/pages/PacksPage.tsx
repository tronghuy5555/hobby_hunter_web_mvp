import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import PackCard from '@/components/PackCard';
import { useNavigate } from 'react-router-dom';

const PacksPage = () => {
  const { featuredPacks, setCurrentPack } = useGameStore();
  const navigate = useNavigate();
  
  const handleBuyPack = (pack: any) => {
    setCurrentPack(pack);
    navigate('/open-pack');
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Buy <span className="bg-gradient-primary bg-clip-text text-transparent">Card Packs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our selection of premium card packs. Each pack guarantees exciting cards with the chance of rare finds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <PackCard pack={pack} onBuy={handleBuyPack} />
            </motion.div>
          ))}
        </div>

        {featuredPacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground">
              No packs available at the moment. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PacksPage;