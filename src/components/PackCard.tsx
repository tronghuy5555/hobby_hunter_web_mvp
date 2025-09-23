import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pack } from '@/lib/store';
import packImage from '@/assets/pack-ff-gathering.jpg';

interface PackCardProps {
  pack: Pack;
  onBuyNow: () => void;
  className?: string;
}

const PackCard = ({ pack, onBuyNow, className = '' }: PackCardProps) => {
  return (
    <motion.div
      className={`pack-card ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <img
          src={packImage}
          alt={pack.name}
          className="w-full h-72 object-cover rounded-lg mb-4"
        />
        {pack.guaranteed && (
          <Badge className="absolute top-2 left-2 rarity-rare">
            Guaranteed {pack.guaranteed}
          </Badge>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-card-foreground">
          {pack.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Each pack contains {pack.cardCount} cards
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-card-foreground">
            ${pack.price}
          </span>
          <Button 
            onClick={onBuyNow}
            className="btn-primary"
          >
            BUY NOW
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackCard;