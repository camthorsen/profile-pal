'use client';

import { type ReactElement, useEffect, useRef, useState } from 'react';
import { formatTime } from '@/utils/timeFormat.ts';

interface StopwatchProps {
  isActive: boolean;
}

export function Stopwatch({ isActive }: StopwatchProps): ReactElement {
  const [time, setTime] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Handle timer start/stop based on isActive prop
  useEffect(() => {
    if (isActive) {
      // Starting timer - clear any existing timer first, then start counting
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTime(0);
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      timerIntervalRef.current = interval;
    } else {
      // Stopping timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [isActive]);

  // Only show the stopwatch if it's active or has recorded time
  if (!isActive && time === 0) {
    return <></>;
  }

  return (
    <div className="flex text-gray-900">
      <span className="text-lg font-mono font-bold">
        {formatTime(time)}
      </span>
    </div>
  );
}
