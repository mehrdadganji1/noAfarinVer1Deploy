/**
 * Status Card Component
 * Displays application status with badge and tracking number
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { STATUS_CONFIG, ANIMATION_VARIANTS } from './constants';
import type { ApplicationStatus } from './types';

interface StatusCardProps {
  status: ApplicationStatus;
  trackingId?: string;
  delay?: number;
}

export const StatusCard: FC<StatusCardProps> = ({ 
  status, 
  trackingId,
  delay = 0 
}) => {
  const navigate = useNavigate();
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ delay }}
      className="h-full"
      whileHover={{ y: -2 }}
    >
      <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-200 h-full">
        <CardContent className="p-3 md:p-5 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <motion.div 
                className={`p-2 md:p-3 rounded-xl ${statusInfo.color} relative`}
                animate={statusInfo.pulse ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <StatusIcon className="w-5 h-5 md:w-6 md:h-6" />
                {statusInfo.pulse && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
                  </span>
                )}
              </motion.div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                  وضعیت درخواست
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Badge className={`${statusInfo.color} px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold border`}>
                {statusInfo.text}
              </Badge>
            </motion.div>
          </div>

          {/* Tracking Number & Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="mt-3 md:mt-4 space-y-2 md:space-y-3"
          >
            {/* Tracking ID Card */}
            {trackingId && (
              <motion.div 
                className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-purple-200/50 shadow-sm hover:border-purple-400 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2 md:gap-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs md:text-sm text-gray-700 font-semibold">شماره پیگیری:</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 text-sm md:text-base tracking-wider">
                    {trackingId}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            <Button
                onClick={() => navigate('/pending/status')}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group h-10 md:h-11"
                size="default"
              >
                <FileText className="w-4 h-4 ml-1.5 md:ml-2 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold text-sm md:text-base">مشاهده جزئیات</span>
                <ArrowLeft className="w-4 h-4 mr-1.5 md:mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
