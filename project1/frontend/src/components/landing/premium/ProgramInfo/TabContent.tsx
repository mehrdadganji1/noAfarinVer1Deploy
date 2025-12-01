import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { EventSchedule } from './EventSchedule';
import { events, specialties, benefits } from './data';

interface TabContentProps {
  activeTab: string;
  variant?: 'dark' | 'light';
}

export const TabContent: React.FC<TabContentProps> = ({ activeTab, variant = 'dark' }) => {
  const isLight = variant === 'light';

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const renderAboutContent = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
            طرح نوآفرین صنعت‌ساز
          </h3>
          <p className={isLight ? 'text-slate-500' : 'text-white/70'}>
            ایجاد کسب‌وکارها و هسته‌های فناور جدید
          </p>
        </div>
      </div>

      {/* Description */}
      <div className={`rounded-2xl p-6 ${
        isLight 
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100' 
          : 'bg-white/10 backdrop-blur-md border border-white/20'
      }`}>
        <p className={`leading-relaxed text-lg ${isLight ? 'text-slate-700' : 'text-white/90'}`}>
          طرح نوآفرین صنعت‌ساز یک برنامه جامع و ملی برای شناسایی، پرورش و حمایت از 
          استعدادهای نوآور و کارآفرین کشور است. هدف اصلی این طرح، ایجاد یک اکوسیستم 
          نوآوری پویا و کارآمد است تا افراد مستعد بتوانند ایده‌های خود را به واقعیت تبدیل کنند.
        </p>
      </div>

      {/* Goals */}
      <div>
        <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
          <Target className={`w-5 h-5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
          اهداف طرح
        </h4>
        <div className="grid gap-3">
          {[
            'شناسایی و جذب استعدادهای برتر در حوزه‌های فناوری و نوآوری',
            'ارائه آموزش‌های تخصصی برای توسعه مهارت‌های فنی و کسب‌وکار',
            'تشکیل تیم‌های نوآور با ترکیب مکمل مهارت‌ها و تخصص‌ها',
            'حمایت مالی و منتورینگ برای تبدیل ایده‌ها به محصولات موفق',
            'ایجاد شبکه‌ای قوی از نوآوران، سرمایه‌گذاران و متخصصان',
          ].map((goal, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-xl p-4 ${
                isLight 
                  ? 'bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? 'text-green-500' : 'text-green-400'}`} />
              <span className={isLight ? 'text-slate-700' : 'text-white/80'}>{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventsContent = () => <EventSchedule events={events} variant={variant} />;


  const renderSpecialtiesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>پنج تخصص کلیدی</h3>
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
            هر کسب‌وکار فناورانه برای موفقیت نیاز به این تخصص‌ها دارد
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {specialties.map((specialty, index) => {
          const Icon = specialty.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-5 transition-all group ${
                isLight
                  ? 'bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-200'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${specialty.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>{specialty.title}</h4>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{specialty.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderBenefitsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>مزایای عضویت</h3>
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/70'}`}>امتیازات و فرصت‌های ویژه برای اعضا</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-5 transition-all ${
                isLight
                  ? 'bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-200'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isLight ? 'bg-gradient-to-br from-purple-100 to-pink-100' : 'bg-white/20'
                }`}>
                  <Icon className={`w-5 h-5 ${isLight ? 'text-purple-600' : 'text-white'}`} />
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>{benefit.title}</h4>
                  <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className={`rounded-2xl p-6 mt-6 ${
        isLight
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl shadow-purple-500/25'
          : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-bold text-white text-lg mb-1">آماده‌ای شروع کنی؟</h4>
            <p className="text-white/80 text-sm">همین حالا ثبت‌نام کن و از مزایا بهره‌مند شو</p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              isLight
                ? 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg'
                : 'bg-white text-purple-600 hover:bg-white/90'
            }`}
          >
            <span>ثبت‌نام</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'about':
        return renderAboutContent();
      case 'events':
        return renderEventsContent();
      case 'specialties':
        return renderSpecialtiesContent();
      case 'benefits':
        return renderBenefitsContent();
      default:
        return renderAboutContent();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {getContent()}
      </motion.div>
    </AnimatePresence>
  );
};
