import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, MessageSquare, BookOpen, LayoutDashboard } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  image: string;
}

const features: Feature[] = [
  {
    icon: <LayoutDashboard size={40} strokeWidth={1.5} />,
    title: 'داشبورد هوشمند',
    description: 'مدیریت کامل فعالیت‌ها، پروژه‌ها و پیشرفت خود در یک نگاه',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    iconColor: '#3B82F6',
    image: '/images/dashboard1noafarineventir2-min.png',
  },
  {
    icon: <Users size={40} strokeWidth={1.5} />,
    title: 'تیم‌سازی حرفه‌ای',
    description: 'با افراد با استعداد آشنا شوید و تیم رویایی خود را بسازید',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    iconColor: '#8B5CF6',
    image: '/images/teamBuilding1noafarineventir2-min.png',
  },
  {
    icon: <Trophy size={40} strokeWidth={1.5} />,
    title: 'سیستم گیمیفیکیشن',
    description: 'با انجام فعالیت‌ها امتیاز کسب کنید و در رتبه‌بندی پیشرفت کنید',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    iconColor: '#F59E0B',
    image: '/images/gamification1noafarineventir2-min.png',
  },
  {
    icon: <Calendar size={40} strokeWidth={1.5} />,
    title: 'رویدادها و کارگاه‌ها',
    description: 'در رویدادها و کارگاه‌های تخصصی شرکت کنید و مهارت‌های خود را ارتقا دهید',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    iconColor: '#10B981',
    image: '/images/events1noafarineventir-min.png',
  },
  {
    icon: <MessageSquare size={40} strokeWidth={1.5} />,
    title: 'انجمن و ارتباطات',
    description: 'با جامعه نوآفرین در ارتباط باشید و تجربیات خود را به اشتراک بگذارید',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    iconColor: '#EC4899',
    image: '/images/community1noafarineventir2-min.png',
  },
  {
    icon: <BookOpen size={40} strokeWidth={1.5} />,
    title: 'آموزش و توسعه',
    description: 'دسترسی به دوره‌ها و منابع آموزشی تخصصی برای رشد مهارت‌های خود',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    iconColor: '#6366F1',
    image: '/images/learning1noafarineventir-min.png',
  },
];

export const FeaturesPremium: React.FC = () => {
  return (
    <section
      id="features"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a0b2e 0%, #1e1540 25%, #221f52 50%, #1f2855 75%, #1a0b2e 100%)',
        padding: '8rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Simple Background Orbs - Reduced */}
      <div
        className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
        }}
      />

      <div
        className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 70%)',
        }}
      />

      {/* Simple Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Bottom Shadow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-[90%] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            همه چیز برای موفقیت شما
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            با ابزارها و خدمات جامع ما مسیر تبدیل ایده به استارتاپ را با اطمینان طی کنید
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow on Hover */}
      {isHovered && (
        <div
          className="absolute -inset-1 rounded-2xl blur-xl opacity-75"
          style={{ background: feature.gradient }}
        />
      )}

      {/* Card */}
      <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
        {/* Top Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl z-10"
          style={{ background: feature.gradient }}
        />

        {/* Image Preview */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              objectPosition: 'center top',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, rgba(15, 23, 42, 0.95) 100%)`,
            }}
          />
          
          {/* Icon on Image */}
          <div className="absolute bottom-4 right-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              style={{ 
                background: isHovered ? feature.gradient : `${feature.iconColor}40`,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="text-white">
                {feature.icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">
            {feature.description}
          </p>

          {/* Arrow */}
          {isHovered && (
            <div className="absolute bottom-4 left-4 text-purple-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
