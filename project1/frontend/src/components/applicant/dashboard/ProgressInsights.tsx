import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  delay: number;
}

function InsightCard({ icon: Icon, title, value, subtitle, gradient, delay }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className={cn(
        "relative bg-gradient-to-br p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden",
        gradient
      )}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-medium mb-1">{title}</p>
              <p className="text-white text-2xl font-bold">{value}</p>
            </div>
          </div>
          
          <p className="text-white/90 text-sm font-medium">{subtitle}</p>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

interface ProgressInsightsProps {
  profileCompletion: number;
  stepsCompleted: number;
  totalSteps: number;
  upcomingInterviews: number;
}

export function ProgressInsights({ 
  profileCompletion, 
  stepsCompleted, 
  totalSteps,
  upcomingInterviews 
}: ProgressInsightsProps) {
  const insights = [
    {
      icon: TrendingUp,
      title: "تکمیل پروفایل",
      value: `${profileCompletion}%`,
      subtitle: "در حال پیشرفت عالی",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      icon: Target,
      title: "مراحل تکمیل شده",
      value: `${stepsCompleted}/${totalSteps}`,
      subtitle: "ادامه بده!",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: Award,
      title: "مصاحبه‌های پیش رو",
      value: upcomingInterviews.toString(),
      subtitle: "آماده باش",
      gradient: "from-pink-600 to-pink-800"
    },
    {
      icon: Zap,
      title: "امتیاز فعالیت",
      value: "92",
      subtitle: "عملکرد عالی",
      gradient: "from-orange-600 to-orange-800"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight, index) => (
        <InsightCard
          key={insight.title}
          {...insight}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
