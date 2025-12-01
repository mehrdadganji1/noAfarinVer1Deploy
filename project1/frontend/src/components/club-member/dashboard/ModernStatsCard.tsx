import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ModernStatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export default function ModernStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  onClick,
}: ModernStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className={`relative overflow-hidden cursor-pointer group border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}
        onClick={onClick}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-95 group-hover:opacity-100 transition-opacity`} />

        {/* Animated Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-0 group-hover:opacity-30`}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${trend.isPositive ? 'bg-white/20 text-white' : 'bg-black/20 text-white/80'
                }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-black text-white">
              {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
            </div>
            <div className="text-white/90 font-bold text-lg">{title}</div>
            {subtitle && (
              <div className="text-white/70 text-sm">{subtitle}</div>
            )}
          </div>
        </div>

        {/* Border Glow */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-lg group-hover:border-white/30 transition-colors" />
      </Card>
    </motion.div>
  );
}

