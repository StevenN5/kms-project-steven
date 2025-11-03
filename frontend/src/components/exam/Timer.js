// frontend/src/components/exam/Timer.js
import React, { useEffect, useState } from 'react';

const Timer = ({ initialTime, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 300) return 'text-red-600'; // Kurang dari 5 menit
    if (timeLeft < 600) return 'text-orange-600'; // Kurang dari 10 menit
    return 'text-gray-700';
  };

  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className={`text-2xl font-bold ${getTimerColor()} mb-2`}>
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-600">
          Sisa Waktu
        </div>
        {timeLeft < 300 && (
          <div className="text-xs text-red-500 mt-1 font-semibold">
            Waktu hampir habis!
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;