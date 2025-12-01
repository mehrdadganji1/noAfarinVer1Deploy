import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Target, Flame, Gift, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import XPDisplay from '@/components/gamification/XPDisplay';
import StreakTracker from '@/components/gamification/StreakTracker';
import AchievementProgressWidget from '@/components/gamification/AchievementProgressWidget';
import { useMyXP } from '@/hooks/useXP';

export default function GamificationOverview() {
  const navigate = useNavigate();
  const { data: xpData, isLoading, error } = useMyXP();

  const quickStats = [
    {
      title: 'سطح فعلی',
      value: xpData?.level || 1,
      icon: Trophy,
      color: 'purple',
      description: 'Level',
      onClick: () => navigate('/club-member/xp-history'),
    },
    {
      title: 'کل XP',
      value: xpData?.totalXP.toLocaleString() || '0',
      icon: Zap,
      color: 'blue',
      description: 'امتیاز',
      onClick: () => navigate('/club-member/xp-history'),
    },
    {
      title: 'دستاوردها',
      value: '12',
      icon: Target,
      color: 'green',
      description: 'باز شده',
      onClick: () => navigate('/club-member/achievements'),
    },
    {
      title: 'Streak',
      value: '7',
      icon: Flame,
      color: 'orange',
      description: 'روز',
      onClick: () => {},
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6 flex items-center justify-center" dir="rtl">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6 flex items-center justify-center" dir="rtl">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              خطا در بارگذاری اطلاعات
            </h3>
            <p className="text-gray-600 mb-4">
              لطفاً مطمئن شوید XP Service در حال اجراست
            </p>
            <Button onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
                  گیمیفیکیشن
                </h1>
                <p className="text-gray-600 mt-1">
                  پیشرفت، دستاوردها و رتبه‌بندی شما
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              purple: 'from-purple-500 to-pink-500',
              blue: 'from-blue-500 to-cyan-500',
              green: 'from-green-500 to-emerald-500',
              orange: 'from-orange-500 to-red-500',
            }[stat.color];

            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all border-l-4"
                style={{
                  borderLeftColor: {
                    purple: '#a855f7',
                    blue: '#3b82f6',
                    green: '#10b981',
                    orange: '#f97316',
                  }[stat.color],
                }}
                onClick={stat.onClick}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600">{stat.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Progress */}
            <XPDisplay />

            {/* Quick Actions */}
            <Card className="border-l-4 border-l-indigo-500 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-indigo-600" />
                  راه‌های کسب XP
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => navigate('/club-member/projects')}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium">کار روی پروژه</div>
                      <div className="text-xs text-gray-600">تا 200 XP</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => navigate('/club-member/courses')}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium">تکمیل دوره</div>
                      <div className="text-xs text-gray-600">تا 200 XP</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => navigate('/club-member/events')}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium">شرکت در رویداد</div>
                      <div className="text-xs text-gray-600">تا 100 XP</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => navigate('/club-member/profile')}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium">تکمیل پروفایل</div>
                      <div className="text-xs text-gray-600">50 XP</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Streak Tracker */}
            <StreakTracker
              currentStreak={7}
              longestStreak={15}
              lastLoginDate={new Date().toISOString()}
            />

            {/* Achievement Progress */}
            <AchievementProgressWidget />

            {/* Leaderboard Preview */}
            <Card className="border-l-4 border-l-yellow-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    رتبه شما
                  </h3>
                </div>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    #42
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    از 250 نفر
                  </p>
                  <Button
                    onClick={() => navigate('/club-member/leaderboard')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    مشاهده جدول کامل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
