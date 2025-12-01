/**
 * Progress Sidebar Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';

interface ProgressSidebarProps {
  currentStep: number;
  totalSteps: number;
  isEditMode: boolean;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentStep,
  totalSteps,
  isEditMode
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      {/* Logo Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-3 overflow-hidden"
      >
        <div className="relative">
          <img
            src="/logoweb-min.png"
            alt="AACo Logo"
            className="w-full h-auto object-contain max-h-16"
          />
        </div>
        <div className="text-center mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-900">شتابدهنده مجازی</p>
          <p className="text-[10px] text-gray-600">AACo</p>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-br ${
          isEditMode 
            ? 'from-amber-500 to-orange-600' 
            : 'from-blue-600 to-indigo-700'
        } rounded-xl shadow-xl p-4 text-white`}
      >
      <div className="space-y-3">
        {/* Progress Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-white/20"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                className="text-white transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">{Math.round(progress)}%</div>
                <div className="text-[10px] opacity-90">تکمیل</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-90">مرحله</p>
              <p className="text-sm font-bold">{currentStep}/{totalSteps}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-90">زمان</p>
              <p className="text-sm font-bold">{(totalSteps - currentStep + 1) * 2} دقیقه</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};
