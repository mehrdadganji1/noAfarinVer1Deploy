import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useApplicationProgress } from '@/hooks/useApplicationProgress';
import {
  TrendingUp,
  Award,
  Star,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react';

interface StrengthFactor {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  icon: any;
  color: string;
}

/**
 * Application Strength Component
 * Shows the strength/quality of the application
 */
export const ApplicationStrength: FC = () => {
  const { data: applicationData } = useApplicationStatus();
  const { percentage } = useApplicationProgress();
  const application = applicationData?.application;

  // Calculate strength factors
  const factors: StrengthFactor[] = [
    {
      id: 'completeness',
      label: 'کامل بودن پروفایل',
      score: percentage,
      maxScore: 100,
      icon: Target,
      color: 'text-purple-600'
    },
    {
      id: 'education',
      label: 'سوابق تحصیلی',
      score: (application?.university && application?.major && application?.degree) ? 100 : 0,
      maxScore: 100,
      icon: Award,
      color: 'text-blue-600'
    },
    {
      id: 'experience',
      label: 'تجربه کاری',
      score: application?.previousExperience ? Math.min((application.previousExperience.length / 100) * 100, 100) : 0,
      maxScore: 100,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 'skills',
      label: 'مهارت‌ها',
      score: Math.min((application?.technicalSkills?.length || 0) * 10, 100),
      maxScore: 100,
      icon: Zap,
      color: 'text-green-600'
    }
  ];

  // Calculate overall strength
  const overallScore = Math.round(
    factors.reduce((acc, factor) => acc + factor.score, 0) / factors.length
  );

  const getStrengthLevel = (score: number) => {
    if (score >= 80) return { label: 'عالی', color: 'from-green-500 to-emerald-500', badge: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 60) return { label: 'خوب', color: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 40) return { label: 'متوسط', color: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'ضعیف', color: 'from-red-500 to-pink-500', badge: 'bg-red-100 text-red-800 border-red-200' };
  };

  const strengthLevel = getStrengthLevel(overallScore);

  const getRecommendations = () => {
    const recommendations: string[] = [];
    
    if (percentage < 100) {
      recommendations.push('پروفایل خود را کامل کنید');
    }
    if (!application?.university || !application?.major || !application?.degree) {
      recommendations.push('اطلاعات تحصیلی خود را کامل کنید');
    }
    if (!application?.previousExperience || application.previousExperience.length < 50) {
      recommendations.push('تجربیات کاری خود را با جزئیات بیشتر ثبت کنید');
    }
    if ((application?.technicalSkills?.length || 0) < 5) {
      recommendations.push('مهارت‌های بیشتری اضافه کنید');
    }
    if (!application?.documents || application.documents.length < 5) {
      recommendations.push('تمام مدارک مورد نیاز را آپلود کنید');
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <Card className="border-2 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${strengthLevel.color} rounded-xl`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">قدرت درخواست</h3>
              <p className="text-sm text-gray-600">ارزیابی کیفیت درخواست شما</p>
            </div>
          </div>
          <Badge className={`${strengthLevel.badge} px-4 py-2 text-sm font-semibold border`}>
            {strengthLevel.label}
          </Badge>
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">امتیاز کلی</span>
            <span className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {overallScore}/100
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${strengthLevel.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Strength Factors */}
        <div className="space-y-4 mb-6">
          {factors.map((factor, index) => {
            const Icon = factor.icon;
            const factorPercentage = (factor.score / factor.maxScore) * 100;
            
            return (
              <motion.div
                key={factor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-4 h-4 ${factor.color}`} />
                  <span className="text-sm font-medium text-gray-700 flex-1">
                    {factor.label}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {Math.round(factorPercentage)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${strengthLevel.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${factorPercentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-2">پیشنهادات بهبود</h4>
                <ul className="space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {overallScore >= 80 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center"
          >
            <Award className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800 font-medium">
              درخواست شما بسیار قوی است! شانس پذیرش بالایی دارید.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
