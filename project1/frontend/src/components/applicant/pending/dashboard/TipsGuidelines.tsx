import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Lightbulb,
  UserCheck,
  MessageSquare,
  Clock,
  CheckSquare,
  AlertCircle,
  Sparkles,
  Target
} from 'lucide-react';

interface Tip {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  tips: string[];
}

/**
 * Tips & Guidelines Component
 * Provides helpful tips for pending applicants
 */
export const TipsGuidelines: FC = () => {
  const tipCategories: Tip[] = [
    {
      id: 'interview',
      category: 'آماده‌سازی مصاحبه',
      title: 'نکات مصاحبه',
      description: 'برای مصاحبه موفق آماده شوید',
      icon: UserCheck,
      color: 'from-purple-500 to-blue-500',
      tips: [
        'لباس رسمی و مناسب بپوشید',
        '15 دقیقه زودتر حاضر شوید',
        'درباره AACO و فعالیت‌هایش تحقیق کنید',
        'سوالات متداول را مرور کنید',
        'نمونه کارها و پروژه‌هایتان را آماده کنید'
      ]
    },
    {
      id: 'profile',
      category: 'تکمیل پروفایل',
      title: 'پروفایل کامل',
      description: 'اطلاعات خود را کامل کنید',
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-500',
      tips: [
        'تمام بخش‌های پروفایل را پر کنید',
        'اطلاعات دقیق و صحیح وارد کنید',
        'مدارک معتبر و واضح آپلود کنید',
        'رزومه خود را به‌روز نگه دارید',
        'مهارت‌ها و تجربیات را کامل ذکر کنید'
      ]
    },
    {
      id: 'communication',
      category: 'ارتباط با تیم',
      title: 'پاسخگویی سریع',
      description: 'در ارتباط باشید',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      tips: [
        'ایمیل‌های خود را روزانه چک کنید',
        'به پیامک‌ها در اسرع وقت پاسخ دهید',
        'در صورت تغییر اطلاعات، فوراً اطلاع دهید',
        'سوالات خود را از طریق پشتیبانی بپرسید',
        'شماره تماس خود را فعال نگه دارید'
      ]
    },
    {
      id: 'important',
      category: 'نکات مهم',
      title: 'توصیه‌های کلیدی',
      description: 'نکات ضروری برای موفقیت',
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      tips: [
        'صبور باشید، بررسی زمان می‌برد',
        'اطلاعات صادقانه و واقعی ارائه دهید',
        'از ارسال مدارک تکراری خودداری کنید',
        'قوانین و مقررات را مطالعه کنید',
        'در صورت رد شدن، دلسرد نشوید'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-yellow-100 rounded-xl">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">نکات و راهنمایی‌ها</h3>
          <p className="text-sm text-gray-600">توصیه‌های مفید برای موفقیت در فرآیند پذیرش</p>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tipCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="border-2 hover:border-purple-300 hover:shadow-lg transition-all h-full">
                <CardContent className="p-6">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`
                      p-3 rounded-xl bg-gradient-to-br ${category.color}
                      flex items-center justify-center flex-shrink-0
                    `}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{category.title}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  {/* Tips List */}
                  <div className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <motion.div
                        key={tipIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (tipIndex * 0.05) }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Success Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-xl flex-shrink-0">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">راز موفقیت</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  متقاضیان موفق کسانی هستند که پروفایل کامل، مدارک معتبر، و انگیزه قوی دارند. 
                  صداقت، پشتکار، و آمادگی برای یادگیری از مهم‌ترین ویژگی‌های یک عضو موفق AACO است.
                  همچنین، پاسخگویی سریع و ارتباط مؤثر با تیم می‌تواند شانس پذیرش شما را افزایش دهد.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Time Management Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>نکته زمانی:</strong> معمولاً بررسی درخواست‌ها 3-5 روز کاری طول می‌کشد. 
                در این مدت، پروفایل خود را کامل کنید و منتظر تماس تیم ما باشید.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
