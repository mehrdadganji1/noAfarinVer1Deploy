/**
 * Status Overview Card
 * Main card showing current application status
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { STATUS_CONFIGS, ANIMATION_VARIANTS } from '../constants';
import type { AACOApplication, ApplicationStatus } from '../types';

interface StatusOverviewCardProps {
  application: AACOApplication;
  formatDate: (date: string | Date) => string;
}

export const StatusOverviewCard: FC<StatusOverviewCardProps> = ({ 
  application,
  formatDate 
}) => {
  const config = STATUS_CONFIGS[application.status as ApplicationStatus] || STATUS_CONFIGS['submitted'];
  const StatusIcon = config.icon;

  return (
    <motion.div
      {...ANIMATION_VARIANTS.slideUp}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-2 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        
        <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3 flex-row-reverse">
            <CardTitle className="flex items-center gap-2 text-lg flex-row-reverse">
              <Target className="h-5 w-5 text-violet-600" />
              وضعیت فعلی
            </CardTitle>
            <StatusBadge status={application.status as ApplicationStatus} size="lg" />
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Status Description */}
          <motion.div 
            className={`flex items-start gap-3 p-4 rounded-xl border-2 flex-row-reverse ${config.bgColor}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <StatusIcon className={`w-6 h-6 ${config.color} mt-0.5 flex-shrink-0`} />
            <div className="text-right flex-1">
              <p className={`font-semibold ${config.color} mb-1`}>
                {config.label}
              </p>
              <p className="text-sm text-gray-600">
                {config.description}
              </p>
            </div>
          </motion.div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div 
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 flex-row-reverse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="text-right flex-1">
                <p className="text-xs text-blue-600 font-medium">تاریخ ثبت</p>
                <p className="font-bold text-gray-900 text-sm">
                  {formatDate(application.createdAt)}
                </p>
              </div>
            </motion.div>

            {application.reviewedAt && (
              <motion.div 
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50 flex-row-reverse"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-xs text-green-600 font-medium">تاریخ بررسی</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatDate(application.reviewedAt)}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Review Notes */}
          {application.reviewNotes && (
            <motion.div 
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-semibold text-gray-900 mb-2 text-sm">توضیحات مدیر:</p>
              <p className="text-gray-700 text-sm leading-relaxed text-right">
                {application.reviewNotes}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
