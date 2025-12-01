/**
 * AACo Application View Page
 * Dashboard-style view for viewing and editing AACo application
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  User, 
  GraduationCap, 
  Lightbulb, 
  Target, 
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { toPersianDate } from '@/utils/dateUtils';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface AACOApplication {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  university: string;
  major: string;
  degree: string;
  graduationYear?: string;
  startupIdea: string;
  businessModel: string;
  targetMarket: string;
  teamSize?: string;
  teamMembers?: string;
  skills: string[];
  motivation: string;
  goals: string;
  experience?: string;
  expectations?: string;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

const STATUS_CONFIG = {
  submitted: {
    label: 'در انتظار بررسی',
    icon: Clock,
    color: 'yellow',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-300',
    textClass: 'text-yellow-800',
    iconClass: 'text-yellow-600'
  },
  approved: {
    label: 'تایید شده',
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-300',
    textClass: 'text-green-800',
    iconClass: 'text-green-600'
  },
  rejected: {
    label: 'رد شده',
    icon: XCircle,
    color: 'red',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-300',
    textClass: 'text-red-800',
    iconClass: 'text-red-600'
  }
};

export default function AACOApplicationView() {
  const navigate = useNavigate();
  const [application, setApplication] = useState<AACOApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/aaco-applications/my-application');
      
      if (response.data.application) {
        setApplication(response.data.application);
      } else {
        toast.error('درخواستی یافت نشد');
        navigate('/pending');
      }
    } catch (error: any) {
      console.error('Error loading application:', error);
      if (error.response?.status === 404) {
        toast.error('شما هنوز درخواستی ثبت نکرده‌اید');
        navigate('/pending');
      } else {
        toast.error('خطا در بارگذاری درخواست');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/pending/aaco-application');
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
        {/* Skeleton Header */}
        <div className="relative overflow-hidden bg-gray-200 rounded-2xl h-48">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {/* Skeleton Status */}
        <div className="relative overflow-hidden bg-gray-200 rounded-xl h-24">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {/* Skeleton Cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative overflow-hidden bg-gray-200 rounded-xl h-48">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const statusConfig = STATUS_CONFIG[application.status];
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto py-4 px-2" 
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl mb-8"
        >
          <div className="relative h-48 bg-gradient-to-br from-red-900 via-rose-900 to-red-900">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-rose-900/85 to-red-900/90" />
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-between px-8">
              <div className="flex-1 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className="w-5 h-5" />
                      <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded-full border border-white/20">
                        {statusConfig.label}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">
                      درخواست AACo شما
                    </h1>
                    <p className="text-sm text-gray-300 max-w-md">
                      مشاهده و ویرایش اطلاعات درخواست
                    </p>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="hidden md:block">
                    <Button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش درخواست
                    </Button>
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

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className={`border-2 ${statusConfig.borderClass} ${statusConfig.bgClass} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-8 w-8 ${statusConfig.iconClass}`} />
                  <div>
                    <p className="text-sm text-gray-600">وضعیت درخواست</p>
                    <p className={`text-xl font-bold ${statusConfig.textClass}`}>
                      {statusConfig.label}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  ویرایش درخواست
                </Button>
              </div>
              
              {application.reviewNotes && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">یادداشت بررسی:</p>
                  <p className="text-gray-600">{application.reviewNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Details */}
        <div className="space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6 text-blue-600" />
                  <span>اطلاعات شخصی</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="نام" value={application.firstName} />
                  <InfoItem label="نام خانوادگی" value={application.lastName} />
                  <InfoItem label="ایمیل" value={application.email} />
                  <InfoItem label="شماره تماس" value={application.phone} />
                  <InfoItem label="شهر" value={application.city} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Educational Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  <span>سوابق تحصیلی</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="دانشگاه" value={application.university} />
                  <InfoItem label="رشته تحصیلی" value={application.major} />
                  <InfoItem label="مقطع" value={getDegreeLabel(application.degree)} />
                  {application.graduationYear && (
                    <InfoItem label="سال فارغ‌التحصیلی" value={application.graduationYear} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Startup Idea & Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <span>ایده استارتاپ و تیم</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <InfoItem label="ایده استارتاپ" value={application.startupIdea} fullWidth />
                <InfoItem label="مدل کسب‌وکار" value={application.businessModel} fullWidth />
                <InfoItem label="بازار هدف" value={application.targetMarket} fullWidth />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {application.teamSize && (
                    <InfoItem label="تعداد اعضای تیم" value={application.teamSize} />
                  )}
                  {application.teamMembers && (
                    <InfoItem label="اعضای تیم" value={application.teamMembers} />
                  )}
                </div>

                {application.skills && application.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">مهارت‌ها:</p>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border-2 border-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivation & Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  <span>انگیزه و اهداف</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <InfoItem label="انگیزه شرکت" value={application.motivation} fullWidth />
                <InfoItem label="اهداف" value={application.goals} fullWidth />
                {application.experience && (
                  <InfoItem label="تجربیات قبلی" value={application.experience} fullWidth />
                )}
                {application.expectations && (
                  <InfoItem label="انتظارات" value={application.expectations} fullWidth />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-between items-center"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/pending')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به داشبورد
          </Button>
          
          <p className="text-sm text-gray-500">
            تاریخ ثبت: {toPersianDate(application.submittedAt, 'full')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper Components
interface InfoItemProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

function InfoItem({ label, value, fullWidth }: InfoItemProps) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
        {value || '-'}
      </p>
    </div>
  );
}

// Helper function
function getDegreeLabel(degree: string): string {
  const degreeMap: Record<string, string> = {
    'diploma': 'دیپلم',
    'associate': 'کاردانی',
    'bachelor': 'کارشناسی',
    'master': 'کارشناسی ارشد',
    'phd': 'دکتری'
  };
  return degreeMap[degree] || degree;
}
