import { FC, useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypeWriter: FC<TypeWriterProps> = ({ 
  text, 
  speed = 100,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <h1 className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </h1>
  );
};

export default TypeWriter;
