import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VerticalTabs } from './VerticalTabs';
import { TabContent } from './TabContent';
import { tabs } from './data';

// Keyframes for slow zoom animation
const slowZoomKeyframes = `
  @keyframes slowZoom {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }
`;

export const ProgramInfoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <section id="program-info" className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Inject keyframes */}
      <style>{slowZoomKeyframes}</style>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[350px] lg:h-[500px] bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-[95%] sm:w-[90%] mx-auto px-2 sm:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 sm:mb-4 leading-relaxed py-2">
            طرح <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">نوآفرین</span> صنعت‌ساز
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            با ما همراه شوید و ایده‌های خود را به کسب‌وکارهای موفق تبدیل کنید
          </p>
        </motion.div>

        {/* Main Content - Responsive layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Image - Hidden on mobile, shown on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 order-1 hidden lg:block"
          >
            <div className="sticky top-8 relative">
              {/* 3D Shadow Effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-2xl transform translate-x-4 translate-y-4 scale-95"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl transform -translate-x-2 translate-y-6 scale-90"
              />
              <img
                src="/images/figure2-web-min.png"
                alt="نوآفرین"
                className="relative w-full h-auto rounded-2xl drop-shadow-2xl animate-[slowZoom_12s_ease-in-out_infinite]"
                style={{
                  animation: 'slowZoom 12s ease-in-out infinite',
                }}
              />
            </div>
          </motion.div>

          {/* Vertical Tabs - Horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 order-2 w-full"
          >
            <div className="lg:sticky lg:top-8">
              <VerticalTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="light"
              />
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 order-3 w-full"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 shadow-xl min-h-[400px] sm:min-h-[500px]">
              <TabContent activeTab={activeTab} variant="light" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
