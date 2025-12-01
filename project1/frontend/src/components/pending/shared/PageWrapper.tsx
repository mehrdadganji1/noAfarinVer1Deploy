/**
 * PageWrapper - Smooth page transition wrapper for pending pages
 * Uses Framer Motion for professional animations
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

// Smooth page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
  },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 25,
  mass: 0.8,
};

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={`w-full max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation wrapper
export const StaggerWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 24,
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
