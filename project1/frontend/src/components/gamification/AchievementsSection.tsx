import { Trophy, Award, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionContainer from '@/components/common/SectionContainer';
import { useUserAchievements } from '@/hooks/useAchievements';
import { motion } from 'framer-motion';

interface AchievementsSectionProps {
  limit?: number;
  showAll?: boolean;
}

export default function AchievementsSection({
  limit = 6,
  showAll = false,
}: AchievementsSectionProps) {
  const { data: achievementsData, isLoading } = useUserAchievements();

  const achievements = achievementsData?.achievements || [];
  const apiStats = achievementsData?.stats;

  // Calculate stats from achievements
  const unlockedAchievements = achievements.filter((a: any) => a.isCompleted);
  const inProgressAchievements = achievements.filter(
    (a: any) => !a.isCompleted && a.progress > 0
  );

  const stats = {
    total: apiStats?.totalCount || achievements.length,
    unlocked: apiStats?.completedCount || unlockedAchievements.length,
    bronze: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'bronze').length,
    silver: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'silver').length,
    gold: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'gold').length,
    platinum: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'platinum').length,
  };

  const displayAchievements = showAll ? achievements : achievements.slice(0, limit);

  return (
    <SectionContainer
      header={{
        title: 'دستاوردها',
        subtitle: 'مجموعه دستاوردهای کسب شده و در حال انجام',
        icon: Trophy,
        iconColor: 'yellow',
        badge: stats.unlocked,
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-yellow-600" />
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">هنوز دستاوردی کسب نکرده‌اید</p>
          <p className="text-sm text-gray-400">با انجام فعالیت‌ها دستاوردهای جدید کسب کنید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-lg font-bold text-gray-900">{stats.unlocked}</div>
              <div className="text-xs text-gray-600">کسب شده</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold text-gray-900">{inProgressAchievements.length}</div>
              <div className="text-xs text-gray-600">در حال انجام</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <Award className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-lg font-bold text-gray-900">{stats.gold + stats.platinum}</div>
              <div className="text-xs text-gray-600">طلایی+</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-gray-900">
                {stats.total > 0 ? Math.round((stats.unlocked / stats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">تکمیل</div>
            </div>
          </div>

          {/* Recently Unlocked */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                آخرین دستاوردها
              </h4>
              <div className="grid gap-3">
                {unlockedAchievements.slice(0, 3).map((achievement: any) => (
                  <Card key={achievement._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h5 className="font-bold text-sm">{achievement.achievementId?.title || 'دستاورد'}</h5>
                          <p className="text-xs text-gray-600">{achievement.achievementId?.description || ''}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {inProgressAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                در حال انجام
              </h4>
              <div className="grid gap-3">
                {inProgressAchievements.slice(0, 3).map((achievement: any) => (
                  <Card key={achievement._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-600" />
                        <div>
                          <h5 className="font-bold text-sm">{achievement.achievementId?.title || 'دستاورد'}</h5>
                          <p className="text-xs text-gray-600">{achievement.achievementId?.description || ''}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Achievements Grid */}
          {showAll && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">همه دستاوردها</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {displayAchievements.map((achievement: any) => (
                  <Card key={achievement._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-8 h-8 text-yellow-600" />
                        <h5 className="font-bold">{achievement.achievementId?.title || 'دستاورد'}</h5>
                      </div>
                      <p className="text-sm text-gray-600">{achievement.achievementId?.description || ''}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completion Celebration */}
          {stats.unlocked === stats.total && stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-white font-bold text-lg mb-1">
                تبریک! همه دستاوردها رو کسب کردی!
              </p>
              <p className="text-white/90 text-sm">
                تو یک قهرمان واقعی هستی!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </SectionContainer>
  );
}
