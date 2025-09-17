import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean; // Track mouse events as well
  trackTouch?: boolean; // Track touch events
  delta?: number; // Minimum distance to start swiping
  rotationAngle?: number; // Allow rotation
  velocityThreshold?: number; // Minimum velocity for swipe
}

interface TouchData {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const {
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false,
    trackTouch = true,
    delta = 10,
    velocityThreshold = 0.3
  } = config;

  const elementRef = useRef<HTMLElement>(null);
  const startTouch = useRef<TouchData | null>(null);
  const currentTouch = useRef<TouchData | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const getTouchData = (event: TouchEvent | MouseEvent): TouchData => {
    const touch = 'touches' in event ? event.touches[0] : event;
    return {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const calculateDistance = (start: TouchData, end: TouchData): number => {
    return Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
  };

  const calculateVelocity = (start: TouchData, end: TouchData): number => {
    const distance = calculateDistance(start, end);
    const time = end.time - start.time;
    return time > 0 ? distance / time : 0;
  };

  const getSwipeDirection = (start: TouchData, end: TouchData): string | null => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = calculateDistance(start, end);
    
    if (distance < threshold) return null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  const handleStart = (event: TouchEvent | MouseEvent) => {
    const touchData = getTouchData(event);
    startTouch.current = touchData;
    currentTouch.current = touchData;
    setIsSwiping(false);

    // Long press detection
    if (handlers.onLongPress) {
      const timer = setTimeout(() => {
        handlers.onLongPress?.();
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleMove = (event: TouchEvent | MouseEvent) => {
    if (!startTouch.current) return;

    const touchData = getTouchData(event);
    currentTouch.current = touchData;
    
    const distance = calculateDistance(startTouch.current, touchData);
    
    if (distance > delta && !isSwiping) {
      setIsSwiping(true);
      // Clear long press timer if user starts swiping
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }

    if (preventDefaultTouchmoveEvent && isSwiping) {
      event.preventDefault();
    }
  };

  const handleEnd = (event: TouchEvent | MouseEvent) => {
    if (!startTouch.current || !currentTouch.current) return;

    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const endTouch = getTouchData(event);
    const distance = calculateDistance(startTouch.current, endTouch);
    const velocity = calculateVelocity(startTouch.current, endTouch);

    if (distance < threshold || velocity < velocityThreshold) {
      // Handle tap/double tap
      const now = Date.now();
      const timeDiff = now - lastTap;
      
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap
        handlers.onDoubleTap?.();
        setLastTap(0); // Reset to prevent triple tap
      } else {
        // Single tap
        setLastTap(now);
        setTimeout(() => {
          if (lastTap === now) {
            handlers.onTap?.();
          }
        }, 300);
      }
      
      setIsSwiping(false);
      startTouch.current = null;
      currentTouch.current = null;
      return;
    }

    // Handle swipe
    const direction = getSwipeDirection(startTouch.current, endTouch);
    
    switch (direction) {
      case 'left':
        handlers.onSwipeLeft?.();
        break;
      case 'right':
        handlers.onSwipeRight?.();
        break;
      case 'up':
        handlers.onSwipeUp?.();
        break;
      case 'down':
        handlers.onSwipeDown?.();
        break;
    }

    setIsSwiping(false);
    startTouch.current = null;
    currentTouch.current = null;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const touchStartHandler = (e: TouchEvent) => trackTouch && handleStart(e);
    const touchMoveHandler = (e: TouchEvent) => trackTouch && handleMove(e);
    const touchEndHandler = (e: TouchEvent) => trackTouch && handleEnd(e);
    
    const mouseDownHandler = (e: MouseEvent) => trackMouse && handleStart(e);
    const mouseMoveHandler = (e: MouseEvent) => trackMouse && handleMove(e);
    const mouseUpHandler = (e: MouseEvent) => trackMouse && handleEnd(e);

    if (trackTouch) {
      element.addEventListener('touchstart', touchStartHandler, { passive: false });
      element.addEventListener('touchmove', touchMoveHandler, { passive: false });
      element.addEventListener('touchend', touchEndHandler, { passive: false });
    }

    if (trackMouse) {
      element.addEventListener('mousedown', mouseDownHandler);
      element.addEventListener('mousemove', mouseMoveHandler);
      element.addEventListener('mouseup', mouseUpHandler);
    }

    return () => {
      if (trackTouch) {
        element.removeEventListener('touchstart', touchStartHandler);
        element.removeEventListener('touchmove', touchMoveHandler);
        element.removeEventListener('touchend', touchEndHandler);
      }

      if (trackMouse) {
        element.removeEventListener('mousedown', mouseDownHandler);
        element.removeEventListener('mousemove', mouseMoveHandler);
        element.removeEventListener('mouseup', mouseUpHandler);
      }

      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [handlers, config, trackTouch, trackMouse, longPressTimer]);

  return {
    ref: elementRef,
    isSwiping
  };
};

// Hook for detecting device capabilities
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isTouchDevice: false,
    isTablet: false,
    isMobile: false,
    isDesktop: false,
    supportsHover: false,
    orientation: 'landscape' as 'landscape' | 'portrait',
    screenSize: 'desktop' as 'mobile' | 'tablet' | 'desktop'
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      const supportsHover = window.matchMedia('(hover: hover)').matches;
      const orientation = height > width ? 'portrait' : 'landscape';
      
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) screenSize = 'mobile';
      else if (isTablet) screenSize = 'tablet';

      setCapabilities({
        isTouchDevice,
        isTablet,
        isMobile,
        isDesktop,
        supportsHover,
        orientation,
        screenSize
      });
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    window.addEventListener('orientationchange', checkCapabilities);

    return () => {
      window.removeEventListener('resize', checkCapabilities);
      window.removeEventListener('orientationchange', checkCapabilities);
    };
  }, []);

  return capabilities;
};

// Hook for optimizing performance on mobile devices
export const useMobileOptimization = () => {
  const capabilities = useDeviceCapabilities();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getOptimizedProps = () => {
    return {
      // Reduce animations on mobile or if reduced motion is preferred
      shouldAnimate: !isReducedMotion && (capabilities.isDesktop || !capabilities.isTouchDevice),
      // Use hardware acceleration hints
      style: capabilities.isTouchDevice ? {
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      } : {},
      // Optimize touch targets for mobile
      touchTargetSize: capabilities.isMobile ? '44px' : '32px',
      // Adjust hover effects
      enableHover: capabilities.supportsHover
    };
  };

  return {
    ...capabilities,
    isReducedMotion,
    getOptimizedProps
  };
};