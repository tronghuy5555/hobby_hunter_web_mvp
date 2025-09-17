import type { Variants } from 'framer-motion';
import { Rarity } from '../types';

// Pack Opening Animations
export const packAnimations: Variants = {
  closed: {
    rotateY: 0,
    scale: 1,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  opening: {
    rotateY: [0, 15, -15, 0],
    scale: [1, 1.1, 1.05],
    boxShadow: [
      '0 10px 30px rgba(0,0,0,0.3)',
      '0 20px 60px rgba(59,130,246,0.4)',
      '0 15px 45px rgba(59,130,246,0.3)'
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut'
    }
  },
  burst: {
    scale: [1.05, 1.3, 0],
    opacity: [1, 1, 0],
    rotateZ: [0, 180, 360],
    transition: {
      duration: 0.8,
      ease: 'easeIn'
    }
  }
};

// Card Reveal Animations
export const cardRevealAnimations: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 180,
    scale: 0.5,
    y: 100
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    rotateY: -180,
    scale: 0.5,
    y: -100,
    transition: {
      duration: 0.5
    }
  }
};

// Card Hover Animations
export const cardHoverAnimations: Variants = {
  rest: {
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  hover: {
    scale: 1.05,
    rotateY: 5,
    rotateX: 2,
    boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

// Rarity-based Glow Animations
export const getRarityGlowAnimation = (rarity: Rarity) => {
  const colors = {
    [Rarity.COMMON]: '#9CA3AF',
    [Rarity.UNCOMMON]: '#10B981',
    [Rarity.RARE]: '#3B82F6',
    [Rarity.EPIC]: '#8B5CF6',
    [Rarity.LEGENDARY]: '#F59E0B',
    [Rarity.MYTHIC]: '#EF4444'
  };

  const color = colors[rarity];
  
  return {
    animate: {
      boxShadow: [
        `0 0 20px ${color}40`,
        `0 0 40px ${color}80`,
        `0 0 20px ${color}40`
      ]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };
};

// Particle Animation for Rare Cards
export const particleAnimation = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 0.8, 0],
    y: [0, -20, -40]
  },
  transition: (delay: number) => ({
    duration: 2,
    repeat: Infinity,
    delay,
    ease: 'easeOut'
  })
};

// Sparkle Effect for Epic+ Cards
export const sparkleAnimation = {
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180, 360]
  },
  transition: (delay: number) => ({
    duration: 1.5,
    repeat: Infinity,
    delay,
    repeatType: 'loop' as const
  })
};

// Background Gradient Animation
export const backgroundGradientAnimation = {
  animate: {
    background: [
      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
      'radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
      'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
    ]
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    repeatType: 'reverse' as const
  }
};

// Holographic Effect Animation
export const holographicAnimation = {
  animate: {
    background: [
      'linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)',
      'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%)',
      'linear-gradient(225deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)'
    ]
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'linear' as const
  }
};

// Text Glow Animation
export const textGlowAnimation = {
  animate: {
    textShadow: [
      '0 0 10px rgba(255,255,255,0.5)',
      '0 0 20px rgba(255,255,255,0.8)',
      '0 0 10px rgba(255,255,255,0.5)'
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Loading Animations
export const loadingAnimations: Variants = {
  loading: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Page Transition Animations
export const pageTransitions: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn'
    }
  }
};

// Stagger Children Animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// Modal Animations
export const modalAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 100
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 100,
    transition: {
      duration: 0.3
    }
  }
};

// Button Press Animation
export const buttonPressAnimation = {
  whileTap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  whileHover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};