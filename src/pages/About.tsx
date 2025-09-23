import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Shield, Zap, Package, Users, TrendingUp, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center py-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            About Hobby Hunter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing the way collectors experience trading card pack openings, 
            bridging the gap between digital excitement and physical ownership.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-container p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">Bringing joy to collectors worldwide</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Hobby Hunter, we believe that the thrill of opening trading card packs shouldn't be limited 
              by geography or availability. Our platform combines the excitement of digital pack openings 
              with real-world value, giving collectors the best of both worlds — instant gratification and 
              the option to own physical cards.
            </p>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Authentic",
                description: "Every pack is verified and mapped to real physical inventory using advanced hash detection technology."
              },
              {
                icon: TrendingUp,
                title: "Real Market Value",
                description: "Card prices are updated daily from MTGGoldfish and TCGPlayer, ensuring accurate market-based valuations."
              },
              {
                icon: Zap,
                title: "Instant Liquidity",
                description: "Convert your cards to credits instantly at 50% market value, or hold them for potential appreciation."
              },
              {
                icon: Package,
                title: "Physical Shipping",
                description: "Request physical delivery of your favorite pulls and add them to your real-world collection."
              }
            ].map((feature, index) => (
              <div key={index} className="card-container p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="card-container p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Trusted by Collectors</h2>
              <p className="text-muted-foreground">Join thousands of satisfied customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Packs Opened</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$500K+</div>
                <div className="text-muted-foreground">Cards Shipped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="card-container p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Our Team</h2>
                <p className="text-muted-foreground">Built by collectors, for collectors</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our team consists of passionate trading card enthusiasts, software engineers, and industry experts 
              who understand the collector community. We've combined decades of collecting experience with 
              cutting-edge technology to create the ultimate digital pack opening experience.
            </p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="text-center card-container p-8">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">📧 abc@gmail.com</p>
              <p className="text-muted-foreground">🐦 @hobbyhunter</p>
              <p className="text-muted-foreground">📘 facebook.com/hobbyhunter</p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default About;