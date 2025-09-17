import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    rounded: 'rounded-xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-background-card rounded-lg p-4 space-y-4 ${className}`}>
    <Skeleton variant="rectangular" height={180} />
    <div className="space-y-2">
      <Skeleton variant="text" height={20} width="60%" />
      <Skeleton variant="text" height={16} width="40%" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton variant="text" height={16} width="30%" />
      <Skeleton variant="rounded" height={32} width={80} />
    </div>
  </div>
);

export const PackGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 8, 
  className = '' 
}) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const CarouselSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="text-center space-y-2">
      <Skeleton variant="text" height={28} width="200px" className="mx-auto" />
      <Skeleton variant="text" height={16} width="300px" className="mx-auto" />
    </div>
    <div className="flex space-x-4 overflow-hidden">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex-shrink-0 w-48">
          <CardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

export const HeaderSkeleton: React.FC = () => (
  <header className="bg-background-secondary border-b border-gray-700 h-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Skeleton variant="rounded" width={32} height={32} />
        <Skeleton variant="text" width={120} height={20} />
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} variant="text" width={60} height={16} />
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  </header>
);

export const FooterSkeleton: React.FC = () => (
  <footer className="bg-background-secondary border-t border-gray-700 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton variant="text" width="60%" height={20} />
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, j) => (
                <Skeleton key={j} variant="text" width="80%" height={16} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </footer>
);

export const LayoutSkeleton: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background-primary">
    <HeaderSkeleton />
    <main className="flex-1 flex flex-col p-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        <CarouselSkeleton />
        <PackGridSkeleton />
      </div>
    </main>
    <FooterSkeleton />
  </div>
);