/**
 * Form Header Component
 */

import React from 'react';
import { motion } from 'framer-motion';

interface FormHeaderProps {
  isEditMode: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isEditMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
        isEditMode ? 'text-amber-900' : 'text-gray-900'
      }`}>
        {isEditMode ? '✏️ ویرایش درخواست AACo' : 'فرم پیش‌ثبت‌نام رویداد AACo'}
      </h1>
      <p className={`text-lg ${
        isEditMode ? 'text-amber-700' : 'text-gray-600'
      }`}>
        {isEditMode ? 'درخواست خود را ویرایش کنید' : 'شتاب‌دهنده شرکت‌ها و سازمان‌های پیشرفته'}
      </p>
    </motion.div>
  );
};
