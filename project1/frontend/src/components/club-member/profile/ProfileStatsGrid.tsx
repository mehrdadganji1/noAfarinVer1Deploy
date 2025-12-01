import { motion } from 'framer-motion';
import { Trophy, Award, GraduationCap, Star, LucideIcon } from 'lucide-react';

interface StatCard {
  icon: LucideIcon;
  value: number;
  label: string;
  color: string;
  gradient: string;
}

interface ProfileStatsGridProps {
  projectsCompleted?: number;
  achievementsEarned?: number;
  coursesCompleted?: number;
  points?: number;
}

export default function ProfileStatsGrid({
  projectsCompleted = 0,
  achievementsEarned = 0,
  coursesCompleted = 0,
  points = 0,
}: ProfileStatsGridProps) {
  const stats: StatCard[] = [
    {
      icon: Trophy,
      value: projectsCompleted,
      label: 'پروژه',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Award,
      value: achievementsEarned,
      label: 'دستاورد',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: GraduationCap,
      value: coursesCompleted,
      label: 'دوره',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Star,
      value: points,
      label: 'امتیاز',
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
          </motion.div>
        );
      })}
    </div>
  );
}
