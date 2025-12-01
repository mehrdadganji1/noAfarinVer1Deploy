/**
 * Hero Section with Image
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

interface HeroSectionProps {
  isEditMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isEditMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-4"
    >
      {/* Background with Gradient */}
      <div className="relative h-48 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-8">
          {/* Text Content */}
          <div className="flex-1 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded-full border border-white/20">
                    {isEditMode ? 'ویرایش' : 'فرصت استثنایی'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-1">
                  {isEditMode ? 'به‌روزرسانی اطلاعات' : 'به AACo بپیوندید'}
                </h1>
                <p className="text-sm text-gray-300 max-w-md">
                  {isEditMode 
                    ? 'اطلاعات خود را به‌روز کنید'
                    : 'اولین شتابدهنده مجازی کسب و کار های فناورانه'
                  }
                </p>
              </div>
              
              {/* Stats - Compact */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <div>
                    <p className="text-lg font-bold">500+</p>
                    <p className="text-xs text-gray-300">متقاضی</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <p className="text-lg font-bold">85%</p>
                    <p className="text-xs text-gray-300">موفقیت</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>
    </motion.div>
  );
};
