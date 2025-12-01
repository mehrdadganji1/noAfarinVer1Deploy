/**
 * Status Indicator Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ExistingApplication } from '../types/form.types';

interface StatusIndicatorProps {
  application: ExistingApplication;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ application }) => {
  const getStatusConfig = () => {
    switch (application.status) {
      case 'submitted':
        return {
          className: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
          label: 'در انتظار بررسی'
        };
      case 'approved':
        return {
          className: 'bg-green-100 text-green-800 border-2 border-green-300',
          label: 'تایید شده'
        };
      case 'rejected':
        return {
          className: 'bg-red-100 text-red-800 border-2 border-red-300',
          label: 'رد شده'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-2 border-gray-300',
          label: 'نامشخص'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-md ${config.className}`}>
      <AlertCircle className="h-4 w-4 mr-2" />
      <span className="font-semibold">وضعیت فعلی:</span>
      <span className="mr-1">{config.label}</span>
    </div>
  );
};

interface ApprovedWarningProps {
  application: ExistingApplication;
}

export const ApprovedWarning: React.FC<ApprovedWarningProps> = ({ application }) => {
  if (application.status !== 'approved') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg max-w-2xl mx-auto shadow-md"
    >
      <div className="flex items-start">
        <AlertCircle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="text-right">
          <p className="text-amber-900 font-bold mb-1">⚠️ توجه مهم</p>
          <p className="text-amber-800 text-sm">
            درخواست شما قبلاً <strong>تایید شده</strong> است. در صورت ویرایش، درخواست شما مجدداً به حالت 
            <strong className="mx-1">"در انتظار بررسی"</strong> 
            برمی‌گردد و نیاز به تایید مجدد خواهد داشت.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
