import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold text-sm">
              HOBBY HUNTER
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/packs')}>
              CARDS
            </Button>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/about')}>
              ABOUT
            </Button>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Copyright 2025. HobbyHunter. All Rights Reserved</p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <p>📧 hobbyhunter@gmail.com</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs">𝕏</span>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs">f</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;