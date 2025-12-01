/**
 * Help Tips Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Info } from 'lucide-react';

interface HelpTipsProps {
  currentStep: number;
}

const TIPS = {
  1: [
    'اطلاعات شخصی شما محرمانه خواهد ماند',
    'از ایمیل فعال استفاده کنید',
    'شماره تماس برای ارتباط ضروری است'
  ],
  2: [
    'اطلاعات تحصیلی دقیق وارد کنید',
    'رشته تحصیلی مرتبط با استارتاپ مزیت است',
    'سال فارغ‌التحصیلی اختیاری است'
  ],
  3: [
    'ایده خود را واضح و مختصر بیان کنید',
    'مدل کسب‌وکار مشخص داشته باشید',
    'بازار هدف را به خوبی بشناسید'
  ],
  4: [
    'انگیزه واقعی خود را بنویسید',
    'اهداف مشخص و قابل اندازه‌گیری داشته باشید',
    'تجربیات قبلی می‌تواند مفید باشد'
  ]
};

export const HelpTips: React.FC<HelpTipsProps> = ({ currentStep }) => {
  const tips = TIPS[currentStep as keyof typeof TIPS] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-blue-900 mb-1">نکات مفید</h4>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-1 text-xs text-blue-800">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
