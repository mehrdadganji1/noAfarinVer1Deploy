import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'red';
  description?: string;
  delay?: number;
}

interface StatsOverviewProps {
  stats: Array<Omit<StatCardProps, 'delay'>>;
}

const colorConfig = {
  purple: {
    bg: 'from-purple-500 to-purple-600',
    light: 'from-purple-50 to-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700'
  },
  pink: {
    bg: 'from-pink-500 to-fuchsia-600',
    light: 'from-pink-50 to-fuchsia-100',
    text: 'text-pink-600',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700'
  },
  blue: {
    bg: 'from-blue-500 to-cyan-600',
    light: 'from-blue-50 to-cyan-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700'
  },
  green: {
    bg: 'from-emerald-500 to-teal-600',
    light: 'from-emerald-50 to-teal-100',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700'
  },
  orange: {
    bg: 'from-orange-500 to-amber-600',
    light: 'from-orange-50 to-amber-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700'
  },
  red: {
    bg: 'from-rose-500 to-red-600',
    light: 'from-rose-50 to-red-100',
    text: 'text-rose-600',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700'
  }
};

function StatCard({ title, value, icon: Icon, trend, color, description, delay = 0 }: StatCardProps) {
  const colors = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={cn(
        "relative overflow-hidden border rounded-xl transition-all duration-200 hover:shadow-lg group",
        colors.border
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
          colors.bg
        )} />

        <div className="relative p-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg bg-gradient-to-br shadow-sm group-hover:scale-105 transition-transform",
              colors.bg
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-muted-foreground truncate">
                  {title}
                </h3>
                {trend && (
                  <Badge className={cn("gap-0.5 border-0 text-[10px] px-1.5 py-0", colors.badge)}>
                    {trend.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {trend.value}%
                  </Badge>
                )}
              </div>
              <p className={cn("text-xl font-bold", colors.text)}>
                {value}
              </p>
            </div>
          </div>
          
          {description && (
            <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
              {description}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
