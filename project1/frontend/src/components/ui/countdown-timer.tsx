import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
        <Clock className="w-3.5 h-3.5" />
        <span>زمان گذشته</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
      <div className="flex gap-1 text-xs font-medium">
        {timeLeft.days > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-muted text-foreground">
            {timeLeft.days}د
          </span>
        )}
        <span className="px-1.5 py-0.5 rounded bg-muted text-foreground">
          {String(timeLeft.hours).padStart(2, '0')}س
        </span>
        <span className="px-1.5 py-0.5 rounded bg-muted text-foreground">
          {String(timeLeft.minutes).padStart(2, '0')}د
        </span>
      </div>
    </div>
  );
}
