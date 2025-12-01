import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { useMyStreak, useCheckIn } from '@/hooks/useStreaks';

interface StreakTrackerProps {
  currentStreak?: number;
  longestStreak?: number;
  lastLoginDate?: string;
}

export default function StreakTracker({
  currentStreak: propCurrentStreak,
  longestStreak: propLongestStreak,
  lastLoginDate: propLastLoginDate,
}: StreakTrackerProps) {
  // Fetch streak data from API
  const { data: streakData, isLoading } = useMyStreak();
  const checkInMutation = useCheckIn();

  // Use prop values if provided, otherwise use API data
  const currentStreak = propCurrentStreak ?? streakData?.currentStreak ?? 0;
  const longestStreak = propLongestStreak ?? streakData?.longestStreak ?? 0;
  const lastLoginDate = propLastLoginDate ?? (streakData?.lastCheckIn ? new Date(streakData.lastCheckIn).toISOString() : undefined);
  const canCheckInToday = streakData?.canCheckInToday ?? false;

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  if (isLoading && !propCurrentStreak) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </CardContent>
      </Card>
    );
  }
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-red-500 to-orange-500';
    if (streak >= 7) return 'from-orange-500 to-yellow-500';
    if (streak >= 3) return 'from-yellow-500 to-amber-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'افسانه‌ای! 🔥';
    if (streak >= 7) return 'عالی! 🌟';
    if (streak >= 3) return 'خوب! 👍';
    return 'شروع کن! 💪';
  };

  const daysOfWeek = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const today = new Date().getDay();

  return (
    <Card className="border-l-4 border-l-orange-500 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-yellow-500/5" />
      
      <CardHeader className="relative bg-gradient-to-r from-orange-50/50 to-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            Streak شما
          </div>
          <Badge className={`bg-gradient-to-r ${getStreakColor(currentStreak)}`}>
            {getStreakMessage(currentStreak)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative pt-4 space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getStreakColor(
              currentStreak
            )} shadow-lg`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{currentStreak}</div>
              <div className="text-xs text-white/90">روز</div>
            </div>
          </motion.div>
          <p className="text-sm text-gray-600 mt-3">
            Streak فعلی شما
          </p>
        </div>

        {/* Week Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>هفته جاری</span>
            <span>{currentStreak >= 7 ? '7/7' : `${currentStreak}/7`}</span>
          </div>
          <div className="flex gap-1 justify-between">
            {daysOfWeek.map((day, index) => {
              const isActive = index <= today && currentStreak > 0;
              const isPast = index < today;
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex-1 aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white shadow-md'
                      : isPast
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                  {isActive && <Flame className="h-3 w-3 mt-0.5" />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-gray-600">بهترین</span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {longestStreak}
            </div>
            <div className="text-xs text-gray-500">روز</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">آخرین ورود</span>
            </div>
            <div className="text-sm font-bold text-blue-600">
              {lastLoginDate ? 'امروز' : 'نامشخص'}
            </div>
            <div className="text-xs text-gray-500">
              {lastLoginDate
                ? new Date(lastLoginDate).toLocaleDateString('fa-IR', {
                    month: 'short',
                    day: 'numeric',
                  })
                : '-'}
            </div>
          </div>
        </div>

        {/* Check-in Button */}
        {canCheckInToday && (
          <Button
            onClick={handleCheckIn}
            disabled={checkInMutation.isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {checkInMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                در حال ثبت...
              </>
            ) : (
              <>
                <Flame className="h-4 w-4 ml-2" />
                ثبت حضور امروز
              </>
            )}
          </Button>
        )}

        {/* Next Milestone */}
        {streakData?.nextMilestone && (
          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">هدف بعدی</p>
            <p className="text-sm font-bold text-purple-600">
              {streakData.nextMilestone.name}
            </p>
            <p className="text-xs text-gray-500">
              {streakData.nextMilestone.days - currentStreak} روز مانده | +{streakData.nextMilestone.xp} XP
            </p>
          </div>
        )}

        {/* Motivation Message */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
          >
            <p className="text-sm text-gray-700">
              {currentStreak < 3 && '🎯 فردا هم بیا تا Streak ادامه پیدا کنه!'}
              {currentStreak >= 3 && currentStreak < 7 && '🔥 داری خوب پیش میری! ادامه بده!'}
              {currentStreak >= 7 && currentStreak < 30 && '⭐ عالی! به 30 روز نزدیک میشی!'}
              {currentStreak >= 30 && '👑 افسانه‌ای! تو یک قهرمانی!'}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
