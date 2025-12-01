/**
 * Modern Form Card Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernFormCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isEditMode?: boolean;
}

export const ModernFormCard: React.FC<ModernFormCardProps> = ({
  title,
  icon: Icon,
  children,
  isEditMode = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isEditMode 
          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isEditMode 
              ? 'bg-amber-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">لطفاً اطلاعات زیر را تکمیل کنید</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};
