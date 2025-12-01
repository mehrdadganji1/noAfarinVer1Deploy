import { motion } from 'framer-motion';
import { Calendar, Rocket, BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  {
    id: 'events',
    title: 'رویدادها',
    description: 'مشاهده و ثبت‌نام',
    icon: Calendar,
    gradient: 'from-[#00D9FF] to-[#0891b2]',
    path: '/club-member/events',
  },
  {
    id: 'projects',
    title: 'پروژه‌ها',
    description: 'پروژه جدید بساز',
    icon: Rocket,
    gradient: 'from-[#10b981] to-[#059669]',
    path: '/club-member/projects',
  },
  {
    id: 'courses',
    title: 'دوره‌ها',
    description: 'یادگیری آنلاین',
    icon: BookOpen,
    gradient: 'from-[#a855f7] to-[#7e22ce]',
    path: '/club-member/courses',
  },
  {
    id: 'community',
    title: 'انجمن',
    description: 'گفتگو با اعضا',
    icon: Users,
    gradient: 'from-[#E91E8C] to-[#be185d]',
    path: '/club-member/community',
  },
  {
    id: 'ideas',
    title: 'بانک ایده',
    description: 'ایده‌های نوآورانه',
    icon: TrendingUp,
    gradient: 'from-[#f59e0b] to-[#d97706]',
    path: '/club-member/ideas-bank',
  },
  {
    id: 'achievements',
    title: 'دستاوردها',
    description: 'مدال‌ها و جوایز',
    icon: Award,
    gradient: 'from-[#ec4899] to-[#db2777]',
    path: '/club-member/achievements',
  },
];

export default function ModernQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-[#E91E8C]" />
        دسترسی سریع
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="relative overflow-hidden rounded-xl p-4 text-right group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-2xl" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{action.title}</h3>
                <p className="text-white/80 text-xs">{action.description}</p>
              </div>

              <div className="absolute inset-0 border-2 border-white/10 rounded-xl group-hover:border-white/30 transition-colors" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

