import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  FolderKanban, 
  GraduationCap, 
  Award,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MemberStats } from '@/types/clubMember';

interface MemberStatsCardsProps {
  stats: MemberStats;
  isLoading?: boolean;
}

const statConfig = [
  {
    key: 'eventsAttended',
    label: 'رویدادها',
    icon: Calendar,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-l-blue-500',
  },
  {
    key: 'projectsCompleted',
    label: 'پروژه‌ها',
    icon: FolderKanban,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-l-green-500',
  },
  {
    key: 'coursesCompleted',
    label: 'دوره‌ها',
    icon: GraduationCap,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-l-orange-500',
  },
  {
    key: 'achievementsEarned',
    label: 'دستاوردها',
    icon: Award,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-l-purple-500',
  },
];

export default function MemberStatsCards({ stats, isLoading }: MemberStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-l-4 border-l-gray-300">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((config, index) => {
        const Icon = config.icon;
        const value = stats[config.key as keyof MemberStats] || 0;
        
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-l-4 ${config.borderColor} hover:shadow-lg transition-shadow duration-300 group cursor-pointer`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{config.label}</p>
                    <motion.p 
                      className={`text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                    >
                      {value}
                    </motion.p>
                    
                    {/* Growth indicator (sample) */}
                    {value > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        <span>فعال</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.bgGradient} border border-${config.color}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 text-${config.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
