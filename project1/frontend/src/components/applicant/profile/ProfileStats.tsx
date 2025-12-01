import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Target, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileStatsProps {
  educationCount: number;
  experienceCount: number;
  certificationsCount: number;
  skillsCount: number;
}

const stats = [
  {
    key: 'education',
    label: 'تحصیلات',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-600',
  },
  {
    key: 'experience',
    label: 'تجربه کاری',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    iconBg: 'bg-violet-500',
    textColor: 'text-violet-600',
  },
  {
    key: 'certifications',
    label: 'گواهینامه',
    icon: Award,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    textColor: 'text-emerald-600',
  },
  {
    key: 'skills',
    label: 'مهارت',
    icon: Target,
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    iconBg: 'bg-rose-500',
    textColor: 'text-rose-600',
  },
];

export function ProfileStats({
  educationCount,
  experienceCount,
  certificationsCount,
  skillsCount,
}: ProfileStatsProps) {
  const values: Record<string, number> = {
    education: educationCount,
    experience: experienceCount,
    certifications: certificationsCount,
    skills: skillsCount,
  };

  const total = educationCount + experienceCount + certificationsCount + skillsCount;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">خلاصه پروفایل</h3>
        <span className="text-xs text-gray-500">{total} مورد ثبت شده</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const value = values[stat.key];
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative group cursor-pointer rounded-xl p-3 transition-all duration-200",
                "hover:shadow-md border border-transparent hover:border-gray-200",
                stat.bgLight
              )}
            >
              {/* Icon */}
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center mb-2 mx-auto",
                `bg-gradient-to-br ${stat.gradient}`
              )}>
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              
              {/* Value */}
              <div className={cn("text-2xl font-bold text-center", stat.textColor)}>
                {value}
              </div>
              
              {/* Label */}
              <div className="text-xs text-gray-600 text-center mt-0.5 font-medium">
                {stat.label}
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-3 h-3 text-gray-400 rotate-90" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
