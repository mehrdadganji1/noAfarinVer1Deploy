/**
 * Status Badge Component
 * Displays application status with icon and color
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIGS } from '../constants';
import type { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const config = STATUS_CONFIGS[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Badge 
        className={`
          ${config.bgColor} ${config.color} 
          ${sizeClasses[size]}
          border-2 font-semibold
          flex items-center gap-1.5
          shadow-sm hover:shadow-md transition-shadow
        `}
      >
        {showIcon && <Icon className="w-4 h-4" />}
        {config.label}
      </Badge>
    </motion.div>
  );
};
