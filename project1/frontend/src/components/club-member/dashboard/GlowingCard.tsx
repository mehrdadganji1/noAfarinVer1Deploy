import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface GlowingCardProps {
  children: ReactNode;
  glowColor?: 'magenta' | 'cyan' | 'purple';
  className?: string;
}

const glowColors = {
  magenta: 'shadow-[0_0_30px_rgba(233,30,140,0.3)] hover:shadow-[0_0_50px_rgba(233,30,140,0.5)]',
  cyan: 'shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)]',
  purple: 'shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]',
};

export default function GlowingCard({ 
  children, 
  glowColor = 'magenta',
  className = '' 
}: GlowingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        relative overflow-hidden border-0
        ${glowColors[glowColor]}
        transition-all duration-300
        bg-white
        ${className}
      `}>
        {/* Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E91E8C] via-[#a855f7] to-[#00D9FF] opacity-20" />
        <div className="absolute inset-[2px] bg-white rounded-lg" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

