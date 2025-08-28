import React, { useState, useEffect } from 'react';

const TWENTY_MINUTES_IN_MS = 20 * 60 * 1000;

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TWENTY_MINUTES_IN_MS);

  useEffect(() => {
    if (timeLeft <= 0) return;

    // Use a prime number for the interval to make the fractional second display feel more frantic and less robotic.
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 47);
    }, 47);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const hundredths = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');

    return `${minutes}:${seconds}:${hundredths}`;
  };

  const isLowTime = timeLeft < 60000; // Under 1 minute
  const timerColorClass = isLowTime ? 'text-brand-primary animate-pulse' : 'text-brand-accent';

  return (
    <div className="absolute top-4 right-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-md border border-brand-border/50 shadow-lg">
      <div 
        className={`font-mono text-lg font-bold tracking-wider transition-colors duration-500 ${timerColorClass}`}
        role="timer"
        aria-live="off"
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default CountdownTimer;