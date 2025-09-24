import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pack } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import packImage from '@/assets/pack-ff-gathering.jpg';

interface PackCardProps {
  pack: Pack;
  onBuyNow: () => void;
  className?: string;
  showDetailsOnClick?: boolean;
}

const PackCard = ({ pack, onBuyNow, className = '', showDetailsOnClick = true }: PackCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (showDetailsOnClick) {
      navigate(`/pack/${pack.id}`);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking buy button
    onBuyNow();
  };

  return (
    <motion.div
      className={`pack-card ${className} ${showDetailsOnClick ? 'cursor-pointer' : ''}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
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
            onClick={handleBuyClick}
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