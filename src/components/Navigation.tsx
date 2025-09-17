import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

const Navigation = () => {
  const location = useLocation();
  const { credits, ownedCards } = useGameStore();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/packs', label: 'Buy Packs' },
    { path: '/cards', label: 'My Cards' },
    { path: '/about', label: 'About' },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            HobbyHunter
          </motion.div>
        </Link>

        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
              {item.path === '/cards' && ownedCards.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {ownedCards.length}
                </Badge>
              )}
            </Link>
          ))}
          
          <div className="flex items-center space-x-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Credits:</span>
              <span className="ml-1 font-semibold text-accent">
                ${credits.toFixed(2)}
              </span>
            </div>
            <Button variant="outline" size="sm">
              Login
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;