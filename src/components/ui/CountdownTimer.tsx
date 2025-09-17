import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  className?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  format?: 'full' | 'compact' | 'minimal';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onExpire,
  className = '',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  format = 'full'
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: difference };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.total <= 0 && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  const formatUnit = (value: number, unit: string): React.ReactNode => {
    if (format === 'minimal') {
      return `${value}${unit.charAt(0)}`;
    }
    
    if (format === 'compact') {
      return (
        <span className="inline-flex items-center">
          <span className="text-lg font-bold">{value.toString().padStart(2, '0')}</span>
          <span className="text-xs ml-1 text-gray-400">{unit}</span>
        </span>
      );
    }
    
    // Full format
    return (
      <div className="flex flex-col items-center bg-background-card rounded-lg p-2 min-w-[3rem]">
        <span className="text-xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-400 uppercase">{unit}</span>
      </div>
    );
  };

  const isUrgent = timeRemaining.total <= 24 * 60 * 60 * 1000; // Less than 24 hours
  const isCritical = timeRemaining.total <= 60 * 60 * 1000; // Less than 1 hour

  const urgencyClasses = isCritical 
    ? 'text-red-400' 
    : isUrgent 
    ? 'text-yellow-400' 
    : 'text-green-400';

  if (timeRemaining.total <= 0) {
    return (
      <div className={`text-red-500 font-semibold ${className}`}>
        ⏰ Expired
      </div>
    );
  }

  const timeUnits = [];
  
  if (showDays && timeRemaining.days > 0) {
    timeUnits.push(formatUnit(timeRemaining.days, 'days'));
  }
  if (showHours && (timeRemaining.hours > 0 || timeRemaining.days > 0)) {
    timeUnits.push(formatUnit(timeRemaining.hours, 'hrs'));
  }
  if (showMinutes && (timeRemaining.minutes > 0 || timeRemaining.hours > 0 || timeRemaining.days > 0)) {
    timeUnits.push(formatUnit(timeRemaining.minutes, 'min'));
  }
  if (showSeconds && timeRemaining.days === 0 && timeRemaining.hours === 0) {
    timeUnits.push(formatUnit(timeRemaining.seconds, 'sec'));
  }

  return (
    <div className={`${urgencyClasses} ${className}`}>
      {format === 'full' ? (
        <div className="flex gap-2 items-center">
          {timeUnits.map((unit, index) => (
            <React.Fragment key={index}>
              {unit}
              {index < timeUnits.length - 1 && format === 'full' && (
                <span className="text-gray-500 text-lg">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex gap-1 items-center">
          {timeUnits.map((unit, index) => (
            <React.Fragment key={index}>
              {unit}
              {index < timeUnits.length - 1 && (
                <span className="text-gray-500 mx-1">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {isUrgent && (
        <div className="text-xs mt-1 opacity-75">
          {isCritical ? '🚨 Expires soon!' : '⚠️ Expires in less than 24h'}
        </div>
      )}
    </div>
  );
};