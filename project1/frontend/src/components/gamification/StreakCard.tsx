import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Calendar, Trophy, Loader2, Target, Sparkles } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  canCheckInToday: boolean;
  nextMilestone?: {
    days: number;
    xp: number;
    name: string;
  } | null;
  onCheckIn?: () => void;
  isCheckingIn?: boolean;
}

const getStreakLevel = (streak: number) => {
  if (streak >= 100) return { level: 'legendary', color: 'from-purple-500 to-pink-500', emoji: '👑' };
  if (streak >= 30) return { level: 'master', color: 'from-red-500 to-orange-500', emoji: '🔥' };
  if (streak >= 7) return { level: 'hot', color: 'from-orange-500 to-yellow-500', emoji: '⚡' };
  if (streak >= 3) return { level: 'warm', color: 'from-yellow-500 to-green-500', emoji: '✨' };
  return { level: 'starting', color: 'from-gray-400 to-gray-500', emoji: '🌱' };
};

const getMotivationMessage = (streak: number) => {
  if (streak === 0) return 'شروع کن و اولین روز استریکت رو بساز!';
  if (streak < 3) return 'داری خوب شروع میکنی! ادامه بده!';
  if (streak < 7) return '🔥 داری خوب پیش میری! به هفته نزدیک میشی!';
  if (streak < 30) return '⭐ عالی! به 30 روز نزدیک میشی!';
  if (streak < 100) return '🚀 فوق‌العاده! به 100 روز نزدیک میشی!';
  return '👑 افسانه‌ای! تو یک قهرمانی!';
};

export default function StreakCard({
  currentStreak,
  longestStreak,
  totalCheckIns,
  canCheckInToday,
  nextMilestone,
  onCheckIn,
  isCheckingIn = false,
}: StreakCardProps) {
  const streakLevel = getStreakLevel(currentStreak);
  const motivationMessage = getMotivationMessage(currentStreak);

  return (
    <Card className="border-r-4 border-orange-500 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className={`bg-gradient-to-r ${streakLevel.color} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{streakLevel.emoji}</div>
              <div>
                <h3 className="font-bold text-lg">Streak فعلی</h3>
                <p className="text-white/90 text-sm capitalize">{streakLevel.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{currentStreak}</div>
              <div className="text-white/90 text-sm">روز</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-xl font-bold text-gray-900">{longestStreak}</div>
              <div className="text-xs text-gray-600">بهترین استریک</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-xl font-bold text-gray-900">{totalCheckIns}</div>
              <div className="text-xs text-gray-600">مجموع حضور</div>
            </div>
          </div>

          {/* Check-in Button */}
          {canCheckInToday && onCheckIn && (
            <Button
              onClick={onCheckIn}
              disabled={isCheckingIn}
              className={`w-full bg-gradient-to-r ${streakLevel.color} hover:opacity-90 text-white`}
            >
              {isCheckingIn ? (
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

          {/* Already Checked In */}
          {!canCheckInToday && (
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">امروز حضور ثبت شد!</span>
              </div>
            </div>
          )}

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">هدف بعدی</span>
              </div>
              <div className="text-sm font-bold text-purple-800 mb-1">
                {nextMilestone.name}
              </div>
              <div className="flex items-center justify-between text-xs text-purple-600">
                <span>{nextMilestone.days - currentStreak} روز مانده</span>
                <span>+{nextMilestone.xp} XP</span>
              </div>
            </div>
          )}

          {/* Motivation Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              {motivationMessage}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
