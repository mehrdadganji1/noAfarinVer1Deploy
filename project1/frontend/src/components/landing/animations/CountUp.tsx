import { FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUp: FC<CountUpProps> = ({ 
  end, 
  duration = 2000,
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <div ref={ref} className={className}>
      {count.toLocaleString('fa-IR')}{suffix}
    </div>
  );
};

export default CountUp;
