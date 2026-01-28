import React, { useState, useEffect } from 'react';

const AuctionTimer = ({ endTime, onAuctionEnd, size = 'normal' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    // Guard: if endTime is missing or invalid, mark as ended
    const end = new Date(endTime);
    if (!endTime || isNaN(end.getTime())) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsEnded(true);
      return;
    }
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsEnded(true);
        if (onAuctionEnd) {
          onAuctionEnd();
        }
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onAuctionEnd]);

  const getTimeColor = () => {
    const totalMinutes = timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;
    
    if (totalMinutes <= 0) return 'text-red-600 dark:text-red-400';
    if (totalMinutes <= 60) return 'text-red-500 dark:text-red-400'; // Last hour
    if (totalMinutes <= 24 * 60) return 'text-orange-500 dark:text-orange-400'; // Last day
    return 'text-gray-600 dark:text-gray-400';
  };

  const getBackgroundColor = () => {
    const totalMinutes = timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;
    
    if (totalMinutes <= 0) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    if (totalMinutes <= 60) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
    if (totalMinutes <= 24 * 60) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
    return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
  };

  if (isEnded) {
    return (
      <div className={`${getBackgroundColor()} rounded-lg p-3 border`}>
        <div className="text-center">
          <div className={`font-bold ${size === 'large' ? 'text-lg' : 'text-sm'} text-red-600 dark:text-red-400`}>
            Auction Ended
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(endTime).toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className={`${getBackgroundColor()} rounded-xl p-6 border`}>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Remaining</div>
          <div className="grid grid-cols-4 gap-4">
            {timeLeft.days > 0 && (
              <div className="text-center">
                <div className={`text-3xl font-bold ${getTimeColor()}`}>
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
              </div>
            )}
            <div className="text-center">
              <div className={`text-3xl font-bold ${getTimeColor()}`}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getTimeColor()}`}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getTimeColor()}`}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (size === 'compact') {
    return (
      <div className={`${getBackgroundColor()} rounded-lg p-2 border`}>
        <div className="flex items-center justify-center space-x-1">
          <span className={`text-sm font-mono font-bold ${getTimeColor()}`}>
            {timeLeft.hours.toString().padStart(2, '0')}:
            {timeLeft.minutes.toString().padStart(2, '0')}:
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">left</span>
        </div>
      </div>
    );
  }

  // Normal size
  return (
    <div className={`${getBackgroundColor()} rounded-lg p-3 border`}>
      <div className="text-center">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time Remaining</div>
        <div className="flex items-center justify-center space-x-2">
          {timeLeft.days > 0 && (
            <>
              <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                {timeLeft.days}d
              </span>
              <span className="text-gray-400">:</span>
            </>
          )}
          <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
            {timeLeft.hours.toString().padStart(2, '0')}:
            {timeLeft.minutes.toString().padStart(2, '0')}:
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
        </div>
        {timeLeft.days > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {timeLeft.days} day{timeLeft.days !== 1 ? 's' : ''} left
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
