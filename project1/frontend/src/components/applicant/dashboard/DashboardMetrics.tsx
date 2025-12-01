import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  trend,
  delay = 0 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300/80 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50">
        {/* Gradient Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500",
          gradient
        )} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br shadow-lg transform group-hover:scale-110 transition-transform duration-500",
              gradient
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            {trend && (
              <div className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "bg-rose-50 text-rose-700"
              )}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

interface DashboardMetricsProps {
  metrics: Array<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    gradient: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }>;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.title}
          {...metric}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
