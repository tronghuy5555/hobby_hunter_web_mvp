import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AboutControllerProps {
  // Optional props for future extensions
}

export const useAboutController = (_props?: AboutControllerProps) => {
  // State for any interactive elements
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Handle section expansion (for future interactive features)
  const toggleSection = (sectionId: string): void => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  // Handle contact actions
  const handleEmailContact = (): void => {
    window.location.href = 'mailto:abc@gmail.com?subject=Hobby Hunter Inquiry';
  };

  const handleTwitterContact = (): void => {
    window.open('https://twitter.com/hobbyhunter', '_blank', 'noopener,noreferrer');
  };

  const handleFacebookContact = (): void => {
    window.open('https://facebook.com/hobbyhunter', '_blank', 'noopener,noreferrer');
  };

  // Navigation helpers
  const navigateToSignup = (): void => {
    window.location.href = '/auth?mode=signup';
  };

  const navigateToHome = (): void => {
    window.location.href = '/';
  };

  // Get page content data
  const getPageContent = () => {
    return {
      hero: {
        title: "About Hobby Hunter",
        subtitle: "We're revolutionizing the way collectors experience trading card pack openings, bridging the gap between digital excitement and physical ownership."
      },
      mission: {
        title: "Our Mission",
        subtitle: "Bringing joy to collectors worldwide",
        content: "At Hobby Hunter, we believe that the thrill of opening trading card packs shouldn't be limited by geography or availability. Our platform combines the excitement of digital pack openings with real-world value, giving collectors the best of both worlds — instant gratification and the option to own physical cards."
      },
      features: [
        {
          icon: "Shield",
          title: "Verified Authentic",
          description: "Every pack is verified and mapped to real physical inventory using advanced hash detection technology."
        },
        {
          icon: "TrendingUp",
          title: "Real Market Value",
          description: "Card prices are updated daily from MTGGoldfish and TCGPlayer, ensuring accurate market-based valuations."
        },
        {
          icon: "Zap",
          title: "Instant Liquidity",
          description: "Convert your cards to credits instantly at 50% market value, or hold them for potential appreciation."
        },
        {
          icon: "Package",
          title: "Physical Shipping",
          description: "Request physical delivery of your favorite pulls and add them to your real-world collection."
        }
      ],
      stats: {
        title: "Trusted by Collectors",
        subtitle: "Join thousands of satisfied customers",
        data: [
          { label: "Packs Opened", value: "10,000+" },
          { label: "Cards Shipped", value: "$500K+" },
          { label: "Customer Satisfaction", value: "99.9%" }
        ]
      },
      team: {
        title: "Our Team",
        subtitle: "Built by collectors, for collectors",
        content: "Our team consists of passionate trading card enthusiasts, software engineers, and industry experts who understand the collector community. We've combined decades of collecting experience with cutting-edge technology to create the ultimate digital pack opening experience."
      },
      contact: {
        title: "Get in Touch",
        subtitle: "Have questions or suggestions? We'd love to hear from you.",
        methods: [
          { type: "email", label: "abc@gmail.com", icon: "📧" },
          { type: "twitter", label: "@hobbyhunter", icon: "🐦" },
          { type: "facebook", label: "facebook.com/hobbyhunter", icon: "📘" }
        ]
      }
    };
  };

  // Animation delays for staggered loading
  const getAnimationDelay = (index: number): number => {
    return index * 0.2;
  };

  // Feature icon mapping
  const getFeatureIcon = (iconName: string) => {
    const icons = {
      Shield: 'Shield',
      TrendingUp: 'TrendingUp', 
      Zap: 'Zap',
      Package: 'Package',
      Users: 'Users',
      Heart: 'Heart'
    };
    return icons[iconName as keyof typeof icons] || 'Shield';
  };

  // Handle CTA actions
  const handleJoinCommunity = (): void => {
    navigateToSignup();
  };

  const handleLearnMore = (): void => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get FAQ data (for future expansion)
  const getFaqData = () => {
    return [
      {
        question: "How does pack opening work?",
        answer: "When you purchase a pack, you'll receive cards that are mapped to real physical inventory. You can keep them digital or request physical shipping."
      },
      {
        question: "Are the cards authentic?",
        answer: "Yes, every card is verified and mapped to real physical inventory using our advanced authentication system."
      },
      {
        question: "How do I get physical cards?",
        answer: "Simply request physical shipping for any cards you want to keep. We'll securely package and ship them to your address."
      },
      {
        question: "What happens if I don't ship my cards?",
        answer: "Cards expire after 30 days and automatically convert to credits at 50% of their market value."
      }
    ];
  };

  return {
    // State
    expandedSection,

    // Content getters
    getPageContent,
    getFaqData,
    getFeatureIcon,
    getAnimationDelay,

    // Actions
    toggleSection,
    handleEmailContact,
    handleTwitterContact,
    handleFacebookContact,
    handleJoinCommunity,
    handleLearnMore,
    navigateToSignup,
    navigateToHome,

    // Computed values
    isExpanded: (sectionId: string) => expandedSection === sectionId
  };
};

// Static data exports
export const aboutPageConfig = {
  animationDuration: 0.6,
  staggerDelay: 0.2,
  contactEmail: 'abc@gmail.com',
  socialLinks: {
    twitter: 'https://twitter.com/hobbyhunter',
    facebook: 'https://facebook.com/hobbyhunter'
  }
};

// SEO and meta data
export const getAboutPageMeta = () => {
  return {
    title: 'About Hobby Hunter - Digital Trading Card Platform',
    description: 'Learn about Hobby Hunter, the revolutionary platform that bridges digital pack opening with physical card ownership. Trusted by collectors worldwide.',
    keywords: 'trading cards, digital packs, card collecting, hobby hunter, TCG',
    ogTitle: 'About Hobby Hunter - Revolutionizing Card Collecting',
    ogDescription: 'Discover how Hobby Hunter combines digital excitement with real-world value for card collectors.',
    ogImage: '/og-about.jpg'
  };
};