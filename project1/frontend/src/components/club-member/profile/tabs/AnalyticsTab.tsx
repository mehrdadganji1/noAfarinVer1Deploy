import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';

export default function AnalyticsTab() {
  const stats = [
    { label: 'بازدید پروفایل', value: '1,234', change: '+12%', trend: 'up' },
    { label: 'تعامل با محتوا', value: '856', change: '+8%', trend: 'up' },
    { label: 'دنبال‌کنندگان', value: '342', change: '+15%', trend: 'up' },
    { label: 'امتیاز کلی', value: '4.8/5', change: '+0.2', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">آمار و تحلیل</h2>
        <p className="text-gray-600">عملکرد و فعالیت‌های شما</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-black text-gray-900">نمودار فعالیت</h3>
        </div>
        <p className="text-gray-600">
          نمودار تحلیلی فعالیت‌های شما در 30 روز گذشته در اینجا نمایش داده می‌شود.
        </p>
      </div>
    </div>
  );
}
