import { motion } from 'framer-motion';
import { Calendar, Trophy, BookOpen, Rocket } from 'lucide-react';

export default function ActivityTab() {
  const activities = [
    {
      type: 'achievement',
      title: 'دستاورد جدید دریافت کردید',
      description: 'دستاورد "پروژه‌ساز حرفه‌ای" را کسب کردید',
      date: '2 روز پیش',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      type: 'course',
      title: 'دوره جدید تکمیل شد',
      description: 'دوره "React پیشرفته" را با موفقیت به پایان رساندید',
      date: '5 روز پیش',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'project',
      title: 'پروژه جدید شروع شد',
      description: 'پروژه "سیستم مدیریت محتوا" را آغاز کردید',
      date: '1 هفته پیش',
      icon: Rocket,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">تایم‌لاین فعالیت</h2>
        <p className="text-gray-600">آخرین فعالیت‌ها و رویدادهای شما</p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E91E8C] via-[#a855f7] to-[#00D9FF]" />

        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline Dot */}
                <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex-1 bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black text-gray-900">{activity.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{activity.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{activity.description}</p>
                  <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${activity.color}`} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
