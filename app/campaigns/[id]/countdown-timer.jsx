import React, { useState, useEffect } from 'react';
import { Trophy, PartyPopper, CalendarCheck, Users } from 'lucide-react';



const CampaignCountdown = ({ endTime, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 0,
  });

  const [showEndedAnimation, setShowEndedAnimation] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        setShowEndedAnimation(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          percentage: 100,
        };
      }

      // Calculate time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Calculate percentage of time elapsed
      const maxDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      const elapsed = maxDuration - Math.min(difference, maxDuration);
      const percentage = Math.min(100, Math.max(0, (elapsed / maxDuration) * 100));

      return {
        days,
        hours,
        minutes,
        seconds,
        percentage,
      };
    };

    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Clean up the timer
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.percentage === 100) {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-300" aria-hidden="true" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300">
            Voting Period Completed
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Thank you for participating!
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <CalendarCheck className="w-4 h-4 mr-1 text-green-500" aria-hidden="true" />
            Results Available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${timeLeft.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CampaignCountdown;