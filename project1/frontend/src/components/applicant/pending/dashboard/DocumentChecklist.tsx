import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import {
  FileText,
  Image,
  CreditCard,
  GraduationCap,
  FileCheck,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Upload
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  status: 'uploaded' | 'pending' | 'missing';
}

/**
 * Document Checklist Component
 * Shows required documents and their upload status
 */
export const DocumentChecklist: FC = () => {
  const navigate = useNavigate();
  const { data: applicationData } = useApplicationStatus();
  const application = applicationData?.application;

  // Check document status
  const hasPhoto = !!application?.documents?.some((d) => d.type === 'photo');
  const hasNationalId = !!application?.documents?.some((d) => d.type === 'national_id');
  const hasEducation = !!application?.documents?.some((d) => d.type === 'education');
  const hasResume = !!application?.documents?.some((d) => d.type === 'resume');
  const hasMotivation = !!application?.documents?.some((d) => d.type === 'motivation');
  const hasCertificates = !!application?.documents?.some((d) => d.type === 'certificate');

  const documents: Document[] = [
    {
      id: 'photo',
      title: 'عکس پرسنلی',
      description: 'عکس رسمی با پس‌زمینه سفید',
      icon: Image,
      required: true,
      status: hasPhoto ? 'uploaded' : 'missing'
    },
    {
      id: 'national_id',
      title: 'کارت ملی',
      description: 'تصویر واضح از کارت ملی',
      icon: CreditCard,
      required: true,
      status: hasNationalId ? 'uploaded' : 'missing'
    },
    {
      id: 'education',
      title: 'مدرک تحصیلی',
      description: 'آخرین مدرک تحصیلی',
      icon: GraduationCap,
      required: true,
      status: hasEducation ? 'uploaded' : 'missing'
    },
    {
      id: 'resume',
      title: 'رزومه',
      description: 'رزومه کامل و به‌روز',
      icon: FileText,
      required: true,
      status: hasResume ? 'uploaded' : 'missing'
    },
    {
      id: 'motivation',
      title: 'نامه انگیزه',
      description: 'دلیل علاقه به عضویت',
      icon: Mail,
      required: true,
      status: hasMotivation ? 'uploaded' : 'missing'
    },
    {
      id: 'certificates',
      title: 'گواهی‌های مهارتی',
      description: 'گواهی‌های دوره‌ها و مهارت‌ها',
      icon: FileCheck,
      required: false,
      status: hasCertificates ? 'uploaded' : 'missing'
    }
  ];

  const uploadedCount = documents.filter(d => d.status === 'uploaded').length;
  const requiredCount = documents.filter(d => d.required).length;
  const requiredUploaded = documents.filter(d => d.required && d.status === 'uploaded').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, required: boolean) => {
    if (status === 'uploaded') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">آپلود شده</Badge>;
    }
    if (required) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">الزامی</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">اختیاری</Badge>;
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">چک‌لیست مدارک</h3>
            <p className="text-sm text-gray-600 mt-1">
              {requiredUploaded} از {requiredCount} مدرک الزامی آپلود شده
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {uploadedCount}/{documents.length}
            </div>
            <div className="text-xs text-gray-500">مدارک</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(uploadedCount / documents.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${doc.status === 'uploaded' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg flex-shrink-0
                    ${doc.status === 'uploaded' ? 'bg-green-100' : 'bg-white'}
                  `}>
                    <Icon className={`w-5 h-5 ${doc.status === 'uploaded' ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                      {getStatusBadge(doc.status, doc.required)}
                    </div>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>

                  <div className="flex-shrink-0">
                    {getStatusIcon(doc.status)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upload Button */}
        {requiredUploaded < requiredCount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => navigate('/applicant/profile')}
            >
              <Upload className="w-4 h-4 ml-2" />
              آپلود مدارک
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
