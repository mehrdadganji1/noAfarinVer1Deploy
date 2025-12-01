import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { EventDate } from './types';

interface EventScheduleProps {
  events: EventDate[];
  variant?: 'dark' | 'light';
}

export const EventSchedule: React.FC<EventScheduleProps> = ({ events, variant = 'dark' }) => {
  const isLight = variant === 'light';

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>تاریخ برگزاری</h3>
          <p className={`text-[10px] sm:text-xs ${isLight ? 'text-slate-500' : 'text-white/70'}`}>۳ هفته متوالی • پنجشنبه و جمعه</p>
        </div>
      </div>

      {/* Simple Date List */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
        {events.map((event, index) => (
          <motion.div
            key={event.week}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${
              isLight
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'
                : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}
          >
            <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
              isLight 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-purple-600'
            }`}>
              {event.week}
            </span>
            <div className="flex flex-col">
              <span className={`font-bold text-sm sm:text-base ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {event.persianDates}
              </span>
              <span className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
                {event.days}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
          isLight
            ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100'
            : 'bg-white/5 backdrop-blur-md border border-white/10'
        }`}
      >
        <p className={`text-sm sm:text-base leading-relaxed sm:leading-loose ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
          در این روزها به صورت <span className="font-bold text-purple-600">نیم‌روزه</span>، برنامه‌های متنوعی برگزار خواهد شد:
        </p>
        <ul className={`mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span><span className="font-semibold">کلاس‌های آموزشی</span> برای یادگیری مفاهیم پایه و پیشرفته کارآفرینی</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-1">•</span>
            <span><span className="font-semibold">کارگاه‌های تعاملی</span> با تمرین‌های عملی و گروهی</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span><span className="font-semibold">پنل‌های انتقال تجربه</span> با حضور کارآفرینان موفق</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><span className="font-semibold">جلسات منتورینگ</span> برای راهنمایی شخصی‌سازی شده</span>
          </li>
        </ul>
        <p className={`mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed sm:leading-loose ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
          تمرکز اصلی این دوره بر <span className="font-bold text-indigo-600">آشنایی و استفاده از ابزارهای هوش مصنوعی</span> در راه‌اندازی و توسعه کسب‌وکار فناورانه است.
        </p>
      </motion.div>
    </div>
  );
};
