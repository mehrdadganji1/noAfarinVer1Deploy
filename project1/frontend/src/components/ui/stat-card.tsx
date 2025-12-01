import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { getColorConfig, type ColorName } from '@/styles/design-tokens';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color: ColorName;
  delay?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color,
  delay = 0,
  className
}: StatCardProps) {
  const colorConfig = getColorConfig(color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={cn(className)}
    >
      <Card className={cn(
        'bg-white rounded-xl border-2 transition-all duration-300',
        `border-${color}-200 hover:border-${color}-400 hover:shadow-lg`
      )}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {/* Icon */}
            <div className={cn(
              'rounded-lg flex items-center justify-center w-10 h-10',
              `bg-gradient-to-br ${colorConfig.bgGradient}`
            )}>
              <Icon className={cn('h-5 w-5', colorConfig.iconColor)} />
            </div>

            {/* Trend Badge */}
            {trend && (
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-bold',
                trend.isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          {/* Label */}
          <h4 className="font-medium text-gray-700 mb-2 text-sm">
            {title}
          </h4>

          {/* Value Display */}
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-gray-900 text-2xl">
              {value}
            </span>
            {description && (
              <span className="text-gray-500 text-xs">{description}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
