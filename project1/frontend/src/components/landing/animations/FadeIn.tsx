import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FadeIn: FC<FadeInProps> = ({ 
  children, 
  delay = 0,
  direction = 'up'
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
};
