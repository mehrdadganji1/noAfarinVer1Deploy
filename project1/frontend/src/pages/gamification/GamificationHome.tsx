import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Award, BarChart3, Gift, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GamificationHome() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'گیمیفیکیشن',
      description: 'مشاهده XP، سطح و پیشرفت خود',
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      path: '/club-member/gamification',
    },
    {
      title: 'دستاوردها',
      description: 'مشاهده و باز کردن دستاوردهای جدید',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      path: '/club-member/achievements',
    },
    {
      title: 'جدول رتبه‌بندی',
      description: 'رقابت با سایر اعضا',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      path: '/club-member/leaderboard',
    },
    {
      title: 'فروشگاه پاداش‌ها',
      description: 'خرید آیتم‌های ویژه با XP',
      icon: Gift,
      color: 'from-green-500 to-emerald-500',
      path: '/club-member/rewards',
    },
    {
      title: 'چالش‌ها',
      description: 'تکمیل چالش‌ها و کسب XP',
      icon: Target,
      color: 'from-red-500 to-pink-500',
      path: '/club-member/challenges',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="h-20 w-20 text-white/90" />
            </div>
          </div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:mr-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  سیستم گیمیفیکیشن
                </h1>
                <p className="text-gray-600 mt-1">
                  پیشرفت کن، دستاورد کسب کن و با دیگران رقابت کن
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-xl transition-all border-0 overflow-hidden group"
                onClick={() => navigate(feature.path)}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-gray-50"
                  >
                    مشاهده
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  چطور XP کسب کنم؟
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    شرکت در رویدادها و دوره‌ها
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    تکمیل پروژه‌ها و milestone ها
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    باز کردن دستاوردها
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    تکمیل چالش‌های روزانه
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    کمک به سایر اعضا
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
