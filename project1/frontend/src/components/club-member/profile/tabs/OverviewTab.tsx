import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';

export default function OverviewTab() {
  const highlights = [
    {
      icon: Trophy,
      title: 'دستاوردهای برتر',
      value: '12 دستاورد',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Target,
      title: 'پروژه‌های فعال',
      value: '3 پروژه',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'رشد ماهانه',
      value: '+25%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      title: 'رتبه کلی',
      value: 'Top 10%',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">نمای کلی پروفایل</h2>
        <p className="text-gray-600">خلاصه‌ای از فعالیت‌ها و دستاوردهای شما</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                  <p className="text-2xl font-black text-gray-900">{item.value}</p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-lg font-black text-gray-900 mb-3">درباره من</h3>
        <p className="text-gray-700 leading-relaxed">
          این بخش برای نمایش بیوگرافی و اطلاعات تکمیلی شما در نظر گرفته شده است.
          می‌توانید اطلاعات بیشتری درباره خودتان، علایق، اهداف و تخصص‌هایتان را در اینجا قرار دهید.
        </p>
      </div>
    </div>
  );
}
