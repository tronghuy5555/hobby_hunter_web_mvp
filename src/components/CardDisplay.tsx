import { Card as GameCard } from '@/store/gameStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import sampleCardImage from '@/assets/sample-card.jpg';

interface CardDisplayProps {
  card: GameCard;
  showPrice?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CardDisplay = ({ card, showPrice = true, size = 'md' }: CardDisplayProps) => {
  const getRarityStyles = (rarity: string, finish: string) => {
    const baseClasses = "transition-all duration-300";
    
    switch (rarity) {
      case 'legendary':
        return `${baseClasses} shadow-mythic border-legendary`;
      case 'mythic':
        return `${baseClasses} shadow-mythic border-mythic`;
      case 'rare':
        return `${baseClasses} shadow-rare border-rare`;
      case 'uncommon':
        return `${baseClasses} border-secondary shadow-card`;
      default:
        return `${baseClasses} border-muted`;
    }
  };

  const getFinishEffect = (finish: string) => {
    switch (finish) {
      case 'holographic':
        return 'bg-gradient-to-br from-holographic/20 to-legendary/20';
      case 'foil':
        return 'bg-gradient-to-br from-rare/20 to-accent/20';
      case 'reverse_foil':
        return 'bg-gradient-to-br from-accent/20 to-rare/20';
      default:
        return 'bg-gradient-card';
    }
  };

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-40 h-56',
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-legendary text-white';
      case 'mythic': return 'bg-mythic text-white';
      case 'rare': return 'bg-rare text-black';
      case 'uncommon': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ duration: 0.2 }}
      className="perspective-1000"
    >
      <Card
        className={`
          ${sizeClasses[size]} 
          ${getRarityStyles(card.rarity, card.finish)}
          ${getFinishEffect(card.finish)}
          overflow-hidden cursor-pointer relative
          transform-gpu hover:shadow-lg
        `}
      >
        <div className="relative h-full">
          <img
            src={sampleCardImage}
            alt={card.name}
            className="h-full w-full object-cover"
          />
          
          {/* Holographic overlay for special finishes */}
          {(card.finish === 'holographic' || card.finish === 'foil') && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-30 animate-pulse" />
          )}
          
          {/* Card info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={`text-xs ${getRarityColor(card.rarity)}`}
              >
                {card.rarity}
              </Badge>
              {card.finish !== 'normal' && (
                <Badge variant="secondary" className="text-xs">
                  {card.finish.replace('_', ' ')}
                </Badge>
              )}
            </div>
            
            <h3 className="text-white font-semibold text-sm mt-1 truncate">
              {card.name}
            </h3>
            
            {showPrice && (
              <p className="text-accent font-bold text-sm">
                ${card.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CardDisplay;