import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, CreditCard, Settings, Shield } from 'lucide-react';

const MyAccount = () => {
  const { user, isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
    if (user) {
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    setIsEditing(false);
    // For now, we'll just show the updated email (the store would be updated via API response)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input 
                    id="userId"
                    value={user.id} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleSaveProfile}
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          Save
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsEditing(false);
                            setEmail(user.email);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Balance */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Account Balance</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">
                  ${user.credits}
                </div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
              </div>
              <Button onClick={() => navigate('/')}>
                Add Credits
              </Button>
            </div>
          </Card>

          {/* Collection Summary */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Collection Summary</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
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

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Collection Value: 
                <span className="font-semibold text-foreground ml-1">
                  ${user.cards.reduce((total, card) => total + card.price, 0)}
                </span>
              </span>
              <Button 
                variant="outline"
                onClick={() => navigate('/my-cards')}
              >
                View Collection
              </Button>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Account Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: Never
                  </div>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Badge variant="secondary">Not Enabled</Badge>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/20">
            <h2 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </div>
                </div>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;