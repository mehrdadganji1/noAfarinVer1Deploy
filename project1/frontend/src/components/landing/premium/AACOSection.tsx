import React from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';

export const AACOSection: React.FC = () => {
  return (
    <section
      className="relative overflow-visible"
      style={{
        minHeight: 'auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        padding: '3rem 1rem',
        boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Animated Background Orbs - Smaller on mobile */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 sm:w-56 lg:w-72 h-36 sm:h-56 lg:h-72 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[95%] sm:w-[90%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 text-center lg:text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                🎯 رویداد ملی نوآوری
              </div>
            </motion.div>

            {/* Logo */}
            <div className="mb-6 sm:mb-8 flex justify-center lg:justify-start">
              <img
                src="/images/logoweb-min.png"
                alt="AACO Logo"
                className="h-20 sm:h-28 md:h-32 lg:h-40 w-auto drop-shadow-2xl"
              />
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
              رویدادی برای تبدیل ایده‌هایت به واقعیت. با متخصصان آشنا شو، از تجربه‌ها یاد بگیر و پروژه‌ات رو شروع کن.
            </p>

            {/* Features */}
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              <div className="flex items-center gap-3 text-white justify-center lg:justify-start">
                <span className="text-sm sm:text-base lg:text-lg font-medium">شبکه‌سازی با سرمایه‌گذاران و متخصصان</span>
              </div>
              <div className="flex items-center gap-3 text-white justify-center lg:justify-start">
                <span className="text-sm sm:text-base lg:text-lg font-medium">تسهیلات شروع و حمایت‌های ویژه</span>
              </div>
              <div className="flex items-center gap-3 text-white justify-center lg:justify-start">
                <span className="text-sm sm:text-base lg:text-lg font-medium">کارگاه‌های تخصصی و منتورینگ</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/login'}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg overflow-hidden shadow-2xl bg-white text-purple-600 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3 group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>پیش‌ثبت‌نام در AACO</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/about-aaco'}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg border-3 border-white text-white backdrop-blur-sm bg-white/10 hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>درباره AACO</span>
                </div>
              </motion.button>
            </div>

            {/* Additional Info */}
            <p className="text-white/80 text-xs sm:text-sm mt-4 sm:mt-6">
              ⚡ ظرفیت محدود • ثبت‌نام زودهنگام مزایای ویژه دارد
            </p>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-none mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10"></div>
              <img
                src="/images/5web.png"
                alt="AACO Event"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
