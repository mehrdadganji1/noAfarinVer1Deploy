import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useAuthStore } from '@/store/authStore';
import {
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  AlertCircle,
  Mail,
  Phone,
  User,
  HelpCircle
} from 'lucide-react';
// Dashboard components removed for simplified pending view

/**
 * Dashboard content for pending applicants
 * Shows application status and limited information
 */
export const PendingDashboardContent: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: applicationData } = useApplicationStatus();

  const status = applicationData?.status || 'submitted';

  const getStatusInfo = () => {
    switch (status) {
      case 'submitted':
        return {
          text: 'درخواست ارسال شده',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Clock,
          description: 'درخواست شما با موفقیت ثبت شد و در صف بررسی قرار گرفت'
        };
      case 'under_review':
        return {
          text: 'در حال بررسی',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Clock,
          description: 'تیم ما در حال بررسی دقیق درخواست شما هستند'
        };
      case 'interview_scheduled':
        return {
          text: 'مصاحبه تعیین شده',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Calendar,
          description: 'مصاحبه شما برنامه‌ریزی شده است'
        };
      case 'rejected':
        return {
          text: 'رد شده',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          description: 'متاسفانه درخواست شما مورد تایید قرار نگرفت'
        };
      default:
        return {
          text: 'در انتظار',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          description: 'وضعیت درخواست شما'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const quickActions = [
    {
      title: 'وضعیت درخواست',
      description: 'مشاهده جزئیات و وضعیت فعلی',
      icon: FileText,
      path: '/application-status',
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'پروفایل',
      description: 'مشاهده و ویرایش اطلاعات',
      icon: User,
      path: '/applicant/profile',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'راهنما و پشتیبانی',
      description: 'سوالات متداول و تماس',
      icon: HelpCircle,
      path: '/applicant/help',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            سلام {user?.firstName || 'کاربر'} عزیز! 👋
          </h1>
          <p className="text-white/90 text-lg">
            درخواست شما در حال بررسی است. لطفاً صبور باشید.
          </p>
        </div>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${statusInfo.color}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    وضعیت درخواست
                  </h3>
                  <p className="text-sm text-gray-600">
                    {statusInfo.description}
                  </p>
                </div>
              </div>
              <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-semibold border`}>
                {statusInfo.text}
              </Badge>
            </div>

            {/* Tracking Number */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">شماره پیگیری:</span>
                <span className="font-mono font-bold text-gray-800">
                  {applicationData?.application?._id?.slice(-8) || 'N/A'}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <TimelineStep
                title="ثبت درخواست"
                completed={status !== 'draft'}
                active={status === 'submitted'}
              />
              <TimelineStep
                title="بررسی مدارک"
                completed={['under_review', 'interview_scheduled', 'accepted', 'rejected'].includes(status)}
                active={status === 'under_review'}
              />
              <TimelineStep
                title="مصاحبه"
                completed={['accepted', 'rejected'].includes(status)}
                active={status === 'interview_scheduled'}
              />
              <TimelineStep
                title="تایید نهایی"
                completed={status === 'accepted'}
                active={false}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className="border-2 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">زمان بررسی</h4>
                <p className="text-sm text-gray-600">
                  معمولاً بررسی درخواست‌ها 3-5 روز کاری طول می‌کشد
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">اطلاع‌رسانی</h4>
                <p className="text-sm text-gray-600">
                  نتیجه از طریق ایمیل و پیامک به شما اطلاع داده می‌شود
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-2 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4">نیاز به کمک دارید؟</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('mailto:noafarinevent@gmail.com')}
              >
                <Mail className="w-4 h-4 ml-2" />
                noafarinevent@gmail.com
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('tel:+982112345678')}
              >
                <Phone className="w-4 h-4 ml-2" />
                09982328585
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Timeline Step Component
interface TimelineStepProps {
  title: string;
  completed: boolean;
  active: boolean;
}

const TimelineStep: FC<TimelineStepProps> = ({ title, completed, active }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${completed ? 'bg-green-100' : active ? 'bg-blue-100' : 'bg-gray-100'}
      `}>
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <div className={`w-3 h-3 rounded-full ${active ? 'bg-blue-600' : 'bg-gray-400'}`} />
        )}
      </div>
      <span className={`text-sm font-medium ${completed || active ? 'text-gray-800' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
};
