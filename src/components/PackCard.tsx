import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pack } from '@/store/gameStore';
import { motion } from 'framer-motion';
import heroPackImage from '@/assets/hero-pack.jpg';

interface PackCardProps {
  pack: Pack;
  onBuy: (pack: Pack) => void;
}

const PackCard = ({ pack, onBuy }: PackCardProps) => {
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden bg-gradient-card border-border card-hover">
        <div className="relative aspect-[4/3]">
          <img
            src={heroPackImage}
            alt={pack.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            ${pack.price}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{pack.description}</p>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Average Value:</span>
              <span className="ml-2 font-semibold text-accent">
                ${pack.averageValue.toFixed(2)}
              </span>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                THIS IS WHAT YOU CAN GET:
              </h4>
              <div className="space-y-1">
                {pack.topCards.slice(0, 5).map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRarityColor(card.rarity)}`}
                      >
                        {card.rarity}
                      </Badge>
                      <span className="truncate">{card.name}</span>
                    </div>
                    <span className="font-semibold text-accent">
                      ${card.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={() => onBuy(pack)}
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
              size="lg"
            >
              Buy Pack
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PackCard;