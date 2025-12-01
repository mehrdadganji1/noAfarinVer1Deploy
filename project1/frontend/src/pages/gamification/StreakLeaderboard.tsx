import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, TrendingUp, Loader2, Crown } from 'lucide-react';
import { useStreakLeaderboard, useMyStreak } from '@/hooks/useStreaks';
import { useAuthStore } from '@/store/authStore';

export default function StreakLeaderboard() {
  const [leaderboardType, setLeaderboardType] = useState<'current' | 'longest'>('current');
  const user = useAuthStore((state) => state.user);
  
  const { data: leaderboardData, isLoading } = useStreakLeaderboard(leaderboardType, 100);
  const { data: myStreak } = useMyStreak();

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-200 to-gray-300';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-600" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-500" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'text-red-600';
    if (streak >= 30) return 'text-orange-600';
    if (streak >= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-red-50/20 to-yellow-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Flame className="h-10 w-10 text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              لیدربورد Streak
            </h1>
          </div>
          <p className="text-gray-600">
            بهترین استریک‌های باشگاه نوآفرینان
          </p>
        </div>

        {/* My Streak Card */}
        {myStreak && (
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Streak شما</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-orange-600">
                      {leaderboardType === 'current' ? myStreak.currentStreak : myStreak.longestStreak}
                    </div>
                    <div className="text-sm text-gray-500">روز</div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">مجموع حضور</p>
                  <div className="text-2xl font-bold text-blue-600">
                    {myStreak.totalCheckIns}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Type Selector */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={leaderboardType === 'current' ? 'default' : 'outline'}
            onClick={() => setLeaderboardType('current')}
            className={leaderboardType === 'current' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}
          >
            <TrendingUp className="h-4 w-4 ml-2" />
            Streak فعلی
          </Button>
          <Button
            variant={leaderboardType === 'longest' ? 'default' : 'outline'}
            onClick={() => setLeaderboardType('longest')}
            className={leaderboardType === 'longest' ? 'bg-gradient-to-r from-orange-500 to-red-500' : ''}
          >
            <Trophy className="h-4 w-4 ml-2" />
            بهترین Streak
          </Button>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              {leaderboardType === 'current' ? 'Streak های فعلی' : 'بهترین Streak ها'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : leaderboardData && leaderboardData.leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboardData.leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user._id === user?._id;
                  
                  return (
                    <motion.div
                      key={entry.user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {entry.rank <= 3 ? (
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center shadow-md`}>
                            {getRankIcon(entry.rank)}
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-400">
                            #{entry.rank}
                          </div>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {entry.user.avatar ? (
                          <img
                            src={entry.user.avatar}
                            alt={`${entry.user.firstName} ${entry.user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-lg shadow">
                            {entry.user.firstName[0]}{entry.user.lastName[0]}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {entry.user.firstName} {entry.user.lastName}
                          </p>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">
                              شما
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {entry.totalCheckIns} حضور
                        </p>
                      </div>

                      {/* Streak */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-2">
                          <Flame className={`h-5 w-5 ${getStreakColor(entry.streak)}`} />
                          <div className={`text-2xl font-bold ${getStreakColor(entry.streak)}`}>
                            {entry.streak}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">روز</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Flame className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>هنوز کسی Streak ندارد</p>
                <p className="text-sm mt-2">اولین نفر باش!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Milestones Info */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg">🏆 جوایز Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { days: 3, xp: 50, name: '3 روز' },
                { days: 7, xp: 100, name: '1 هفته' },
                { days: 14, xp: 200, name: '2 هفته' },
                { days: 30, xp: 500, name: '1 ماه' },
                { days: 60, xp: 1000, name: '2 ماه' },
                { days: 100, xp: 2000, name: '100 روز' },
              ].map((milestone) => (
                <div
                  key={milestone.days}
                  className="bg-white rounded-lg p-3 text-center border border-purple-200"
                >
                  <div className="text-2xl font-bold text-purple-600">
                    {milestone.days}
                  </div>
                  <div className="text-xs text-gray-600">{milestone.name}</div>
                  <div className="text-sm font-semibold text-orange-600 mt-1">
                    +{milestone.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
