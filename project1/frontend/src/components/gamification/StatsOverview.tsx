import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Flame, Trophy, Star, Target, Award } from 'lucide-react';
import { useMyXP, useMyRank } from '@/hooks/useXP';
import { useMyStreak } from '@/hooks/useStreaks';
import { useUserAchievements } from '@/hooks/useAchievements';
import { useChallenges } from '@/hooks/useChallenges';

export default function StatsOverview() {
  const { data: xpData, isLoading: xpLoading } = useMyXP();
  const { data: rankData, isLoading: rankLoading } = useMyRank();
  const { data: streakData, isLoading: streakLoading } = useMyStreak();
  const { data: achievementsData, isLoading: achievementsLoading } = useUserAchievements();
  const { data: challengesData, isLoading: challengesLoading } = useChallenges();

  // Show loading state
  if (xpLoading || rankLoading || streakLoading || achievementsLoading || challengesLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'XP کل',
      value: xpData?.totalXP?.toLocaleString() || '0',
      icon: Star,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-500',
    },
    {
      label: 'سطح',
      value: xpData?.level || '1',
      icon: TrendingUp,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-500',
    },
    {
      label: 'استریک',
      value: streakData?.currentStreak || '0',
      icon: Flame,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-500',
    },
    {
      label: 'رتبه',
      value: rankData?.rank ? `#${rankData.rank}` : '-',
      icon: Trophy,
      color: 'yellow',
      gradient: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-500',
    },
    {
      label: 'دستاوردها',
      value: `${achievementsData?.stats?.completedCount || 0}/${achievementsData?.stats?.totalCount || 0}`,
      icon: Award,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-500',
    },
    {
      label: 'چالش‌ها',
      value: challengesData?.challenges?.filter((c: any) => c.userProgress?.completed).length || '0',
      icon: Target,
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-l-4 ${stat.borderColor} hover:shadow-lg transition-all`}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
