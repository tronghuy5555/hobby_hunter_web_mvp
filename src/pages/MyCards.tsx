import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import CardDisplay from '@/components/CardDisplay';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MyCards = () => {
  const { user, isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Card Collection</h1>
          <p className="text-muted-foreground">
            You have {user.cards.length} cards in your collection
          </p>
        </div>

        {user.cards.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-muted-foreground">
                No cards in your collection yet
              </h2>
              <p className="text-muted-foreground">
                Purchase some packs to start building your collection!
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Browse Packs
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Collection Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Collection Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {user.cards.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {user.cards.filter(card => card.rarity === 'legendary').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Legendary</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {user.cards.filter(card => card.rarity === 'epic').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Epic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {user.cards.filter(card => card.rarity === 'rare').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rare</div>
                </div>
              </div>
            </Card>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {user.cards.map((card, index) => (
                <Card key={`${card.id}-${index}`} className="p-4 hover:shadow-lg transition-shadow">
                  <CardDisplay card={card} />
                  <div className="mt-3 space-y-2">
                    <h3 className="font-semibold text-sm truncate">{card.name}</h3>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={
                          card.rarity === 'legendary' ? 'default' :
                          card.rarity === 'epic' ? 'secondary' :
                          card.rarity === 'rare' ? 'outline' : 'secondary'
                        }
                        className={
                          card.rarity === 'legendary' ? 'bg-yellow-500 text-yellow-50' :
                          card.rarity === 'epic' ? 'bg-purple-500 text-purple-50' :
                          card.rarity === 'rare' ? 'bg-blue-500 text-blue-50' : ''
                        }
                      >
                        {card.rarity}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        ${card.price}
                      </span>
                    </div>
                    {card.finish && card.finish !== 'normal' && (
                      <Badge variant="outline" className="text-xs">
                        {card.finish}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCards;