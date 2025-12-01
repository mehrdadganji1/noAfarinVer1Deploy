/**
 * Status Page Header Component
 * Simple and elegant header matching the app's design system
 */

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StatusPageHeaderProps {
  applicationStatus?: string;
  submittedDate?: string;
}

export const StatusPageHeader: React.FC<StatusPageHeaderProps> = ({ 
  applicationStatus = 'submitted',
  submittedDate 
}) => {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    switch (applicationStatus) {
      case 'submitted':
        return {
          title: 'درخواست شما با موفقیت ثبت شد',
          subtitle: 'تیم ما به زودی درخواست شما را بررسی خواهد کرد',
          icon: Clock,
          gradient: 'from-blue-500 to-indigo-600',
          badge: 'در انتظار بررسی',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'under-review':
        return {
          title: 'درخواست شما در حال بررسی است',
          subtitle: 'کارشناسان ما در حال ارزیابی اطلاعات شما هستند',
          icon: TrendingUp,
          gradient: 'from-purple-500 to-violet-600',
          badge: 'در حال بررسی',
          badgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
        };
      case 'approved':
        return {
          title: 'تبریک! درخواست شما تایید شد',
          subtitle: 'به جمع اعضای AACo خوش آمدید',
          icon: CheckCircle2,
          gradient: 'from-green-500 to-emerald-600',
          badge: 'تایید شده',
          badgeColor: 'bg-green-100 text-green-700 border-green-200'
        };
      default:
        return {
          title: 'وضعیت درخواست AACo',
          subtitle: 'پیگیری وضعیت درخواست شما',
          icon: Sparkles,
          gradient: 'from-indigo-500 to-purple-600',
          badge: 'در حال بررسی',
          badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-6 bg-white border-2 border-gray-200 shadow-lg"
    >
      {/* Gradient Header Bar */}
      <div className={`h-2 bg-gradient-to-r ${statusInfo.gradient}`} />

      
      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Side - Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon className="w-5 h-5 text-gray-600" />
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusInfo.badgeColor}`}>
                  {statusInfo.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
                {statusInfo.title}
              </h1>

              {/* Subtitle */}
              <p className="text-base text-gray-600 mb-4 max-w-2xl">
                {statusInfo.subtitle}
              </p>

              {/* Submitted Date */}
              {submittedDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>تاریخ ثبت: {submittedDate}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Stats & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 w-full md:w-auto"
          >
            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 min-w-[100px]">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-2xl font-black text-gray-900">500+</p>
                </div>
                <p className="text-xs text-gray-600">متقاضی</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 min-w-[100px]">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-2xl font-black text-gray-900">85%</p>
                </div>
                <p className="text-xs text-gray-600">نرخ پذیرش</p>
              </div>
            </div>

            {/* Back Button */}
            <Button
              onClick={() => navigate('/pending')}
              variant="outline"
              className="w-full border-2"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به داشبورد
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
