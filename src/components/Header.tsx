import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import { User, ShoppingCart, CreditCard, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAppStore();

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
              to="/packs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/packs') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              PACKS
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
                
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.username || user.email?.split('@')[0] || 'User'}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 border-2 border-gray-200 bg-white shadow-lg"
                  >
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-cards')}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>My cards</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-account')}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>My account</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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