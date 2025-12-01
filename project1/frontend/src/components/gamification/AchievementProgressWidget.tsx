import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, ArrowRight, Lock } from 'lucide-react';
import { useUserAchievements } from '@/hooks/useAchievements';
import { Link } from 'react-router-dom';

export default function AchievementProgressWidget() {
  const { data, isLoading } = useUserAchievements();

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-yellow-500 shadow-lg">
        <CardHeader>
          <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const recentAchievements = data.achievements.slice(0, 3);
  const completionRate = Math.round((data.stats.completedCount / data.stats.totalCount) * 100);

  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-50/50 to-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            دستاوردها
          </CardTitle>
          <Badge variant="secondary">
            {data.stats.completedCount} / {data.stats.totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">پیشرفت کلی</span>
            <span className="font-medium text-yellow-600">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          {recentAchievements.length === 0 ? (
            <div className="text-center py-6">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                هنوز دستاوردی باز نکرده‌اید
              </p>
            </div>
          ) : (
            recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50/50 to-white rounded-lg border"
              >
                <div className="text-3xl">{achievement.achievementId.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {achievement.achievementId.titleFa}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        achievement.achievementId.type === 'platinum'
                          ? 'border-purple-500 text-purple-700'
                          : achievement.achievementId.type === 'gold'
                          ? 'border-yellow-500 text-yellow-700'
                          : achievement.achievementId.type === 'silver'
                          ? 'border-gray-400 text-gray-700'
                          : 'border-amber-600 text-amber-700'
                      }`}
                    >
                      {achievement.achievementId.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Star className="h-3 w-3" />
                      {achievement.achievementId.points}
                    </div>
                  </div>
                </div>
                {achievement.isCompleted && (
                  <div className="text-green-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* View All Button */}
        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link to="/club-member/achievements" className="flex items-center justify-center gap-2">
            مشاهده همه
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
