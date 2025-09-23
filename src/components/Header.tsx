import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { User, ShoppingCart } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAppStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm">
              HOBBY HUNTER
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              HOME
            </Link>
            <Link
              to="/cards"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/cards') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              CARDS
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              ABOUT
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">
                  Credits: ${user.credits}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUser(null)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth?mode=login')}
                >
                  Log in
                </Button>
                <Button 
                  size="sm" 
                  className="btn-primary"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;