import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/lib/store';
import sephirothCard from '@/assets/card-sephiroth.jpg';
import cloudCard from '@/assets/card-cloud.jpg';
import bahamutCard from '@/assets/card-bahamut.jpg';

const getCardImage = (imageName: string | any) => {
  // If it's already an imported image (object with default property or direct string)
  if (typeof imageName === 'object' && imageName.default) {
    return imageName.default;
  }
  if (typeof imageName === 'string' && imageName.startsWith('/') || imageName.startsWith('data:') || imageName.startsWith('http')) {
    return imageName;
  }
  
  // Handle filename mappings
  switch (imageName) {
    case 'card-sephiroth.jpg': return sephirothCard;
    case 'card-cloud.jpg': return cloudCard;
    case 'card-bahamut.jpg': return bahamutCard;
    default: return typeof imageName === 'string' ? imageName : '/placeholder-card.jpg';
  }
};

interface CardDisplayProps {
  card: Card;
  index?: number;
  showPrice?: boolean;
  className?: string;
}

const CardDisplay = ({ card, index = 0, showPrice = true, className = '' }: CardDisplayProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      className={`card-container overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] 
      }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="relative">
        <img
          src={getCardImage(card.image)}
          alt={card.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${getRarityColor(card.rarity)} text-xs font-medium`}>
            {card.rarity.toUpperCase()}
          </Badge>
        </div>
        {card.finish && card.finish !== 'normal' && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {card.finish.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-card-foreground truncate">
          {card.name}
        </h4>
        {showPrice && (
          <p className="text-sm font-medium text-primary">
            ${card.price} instant credit
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CardDisplay;