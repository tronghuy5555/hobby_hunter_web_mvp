import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Shield, Zap, Package, Users, TrendingUp, Heart } from 'lucide-react';
import { useAboutController } from '@/controller/AboutController';

const About = () => {
  const {
    // Content getters
    getPageContent,
    getFeatureIcon,
    getAnimationDelay,
    
    // Actions
    handleEmailContact,
    handleTwitterContact,
    handleFacebookContact,
    navigateToSignup,
    navigateToHome
  } = useAboutController();

  const pageContent = getPageContent();
  
  // Icon mapping for dynamic rendering
  const iconComponents = {
    Shield,
    TrendingUp,
    Zap,
    Package,
    Users,
    Heart
  };
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
            {pageContent.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {pageContent.hero.subtitle}
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
                <h2 className="text-2xl font-bold">{pageContent.mission.title}</h2>
                <p className="text-muted-foreground">{pageContent.mission.subtitle}</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent.mission.content}
            </p>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: getAnimationDelay(2) }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pageContent.features.map((feature, index) => {
              const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents] || Shield;
              return (
                <div key={index} className="card-container p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: getAnimationDelay(3) }}
        >
          <div className="card-container p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{pageContent.stats.title}</h2>
              <p className="text-muted-foreground">{pageContent.stats.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {pageContent.stats.data.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: getAnimationDelay(4) }}
        >
          <div className="card-container p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{pageContent.team.title}</h2>
                <p className="text-muted-foreground">{pageContent.team.subtitle}</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent.team.content}
            </p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: getAnimationDelay(5) }}
        >
          <div className="text-center card-container p-8">
            <h2 className="text-2xl font-bold mb-4">{pageContent.contact.title}</h2>
            <p className="text-muted-foreground mb-6">
              {pageContent.contact.subtitle}
            </p>
            <div className="space-y-2 text-sm">
              {pageContent.contact.methods.map((method, index) => {
                const handleClick = method.type === 'email' ? handleEmailContact :
                                  method.type === 'twitter' ? handleTwitterContact :
                                  handleFacebookContact;
                return (
                  <p key={index} className="text-muted-foreground cursor-pointer hover:text-primary" onClick={handleClick}>
                    {method.icon} {method.label}
                  </p>
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default About;