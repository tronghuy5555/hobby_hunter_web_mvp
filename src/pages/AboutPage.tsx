import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Jess',
      role: 'Product Designer',
      description: 'Crafting beautiful and intuitive user experiences for HobbyHunter.',
    },
    {
      name: 'Thai',
      role: 'Fullstack Developer',
      description: 'Building robust backend systems and ensuring seamless functionality.',
    },
    {
      name: 'Huy',
      role: 'Frontend Developer',
      description: 'Creating smooth animations and responsive interfaces.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-primary text-white px-4 py-2">
            Our Mission
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">HobbyHunter</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're on a mission to revolutionize the trading card experience by providing a safe, 
            controlled environment for card enthusiasts to enjoy the thrill of pack opening without 
            the risks associated with the unregulated physical market.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-card border-border">
            <h2 className="text-3xl font-bold mb-6 text-center">Why HobbyHunter Exists</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-accent">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The current trading card market is largely unregulated and has led to real-world 
                  violence and disputes over rare collectibles. People fight over cards, stores get 
                  robbed, and the hobby loses its joy.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-accent">Our Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  HobbyHunter provides all the excitement of opening card packs in a virtual, 
                  safe environment. You get the dopamine hit, the thrill of discovery, and the 
                  option to convert to physical cards—all without the risks.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Buy Virtual Packs</h3>
              <p className="text-sm text-muted-foreground">
                Purchase card packs safely online with PayPal or credits
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rare rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Experience Opening</h3>
              <p className="text-sm text-muted-foreground">
                Enjoy realistic pack opening animations with card reveals
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-mythic rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Manage Collection</h3>
              <p className="text-sm text-muted-foreground">
                Track your cards with automatic expiration and credit conversion
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Ship Physical Cards</h3>
              <p className="text-sm text-muted-foreground">
                Convert virtual cards to physical ones or credits as you choose
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Trust Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-card border-border text-center">
            <h2 className="text-3xl font-bold mb-6">Built on Trust</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  We use PayPal for secure transactions and never store credit card details
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rare rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Real Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Card values updated daily from MTGGoldfish for accurate market pricing
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-mythic rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Verified Inventory</h3>
                <p className="text-sm text-muted-foreground">
                  QC system ensures physical cards match digital ones through hash detection
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;