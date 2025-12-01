import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Filter, Award, TrendingUp } from 'lucide-react';
import { useUserAchievements } from '@/hooks/useAchievements';

const categories = [
  { value: 'all', label: 'همه' },
  { value: 'project', label: 'پروژه' },
  { value: 'course', label: 'دوره' },
  { value: 'community', label: 'انجمن' },
  { value: 'milestone', label: 'نقطه عطف' },
  { value: 'team', label: 'تیم' },
];

const difficulties = [
  { value: 'all', label: 'همه' },
  { value: 'bronze', label: 'برنز' },
  { value: 'silver', label: 'نقره' },
  { value: 'gold', label: 'طلا' },
  { value: 'platinum', label: 'پلاتین' },
];

export default function AllAchievements() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCompleted, setShowCompleted] = useState<'all' | 'completed' | 'locked'>('all');

  const { data: achievementsData, isLoading } = useUserAchievements();

  const achievements = achievementsData?.achievements || [];
  const apiStats = achievementsData?.stats;

  // Calculate stats
  const unlockedAchievements = achievements.filter((a: any) => a.isCompleted);

  const stats = {
    total: apiStats?.totalCount || achievements.length,
    unlocked: apiStats?.completedCount || unlockedAchievements.length,
    bronze: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'bronze').length,
    silver: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'silver').length,
    gold: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'gold').length,
    platinum: unlockedAchievements.filter((a: any) => a.achievementId?.type === 'platinum').length,
  };

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement: any) => {
    if (selectedCategory !== 'all' && achievement.achievementId?.category !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty !== 'all' && achievement.achievementId?.type !== selectedDifficulty) {
      return false;
    }
    if (showCompleted === 'completed' && !achievement.isCompleted) {
      return false;
    }
    if (showCompleted === 'locked' && achievement.isCompleted) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/30 via-orange-50/20 to-red-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="h-20 w-20 text-white/90" />
            </div>
          </div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:mr-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  همه دستاوردها
                </h1>
                <p className="text-gray-600 mt-1">
                  مجموعه کامل دستاوردهای قابل کسب
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-3 rounded-xl border-2 border-yellow-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.unlocked}
                  </div>
                  <div className="text-xs text-gray-600">کسب شده</div>
                </div>
                <div className="h-12 w-px bg-yellow-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.total}
                  </div>
                  <div className="text-xs text-gray-600">کل</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600 text-center">{stats.unlocked}</div>
              <div className="text-xs text-gray-600 text-center">کسب شده</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <Award className="h-5 w-5 mx-auto mb-1 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600 text-center">{stats.bronze}</div>
              <div className="text-xs text-gray-600 text-center">برنز</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="p-4">
              <Award className="h-5 w-5 mx-auto mb-1 text-gray-600" />
              <div className="text-2xl font-bold text-gray-600 text-center">{stats.silver}</div>
              <div className="text-xs text-gray-600 text-center">نقره</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-600">
            <CardContent className="p-4">
              <Award className="h-5 w-5 mx-auto mb-1 text-yellow-700" />
              <div className="text-2xl font-bold text-yellow-700 text-center">{stats.gold}</div>
              <div className="text-xs text-gray-600 text-center">طلا</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <Award className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600 text-center">{stats.platinum}</div>
              <div className="text-xs text-gray-600 text-center">پلاتین</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فیلترها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                دسته‌بندی
              </label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                سختی
              </label>
              <div className="flex gap-2 flex-wrap">
                {difficulties.map((diff) => (
                  <Button
                    key={diff.value}
                    variant={selectedDifficulty === diff.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(diff.value)}
                  >
                    {diff.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                وضعیت
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showCompleted === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCompleted('all')}
                >
                  همه
                </Button>
                <Button
                  variant={showCompleted === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCompleted('completed')}
                  className={showCompleted === 'completed' ? 'bg-green-600' : ''}
                >
                  کسب شده
                </Button>
                <Button
                  variant={showCompleted === 'locked' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCompleted('locked')}
                  className={showCompleted === 'locked' ? 'bg-gray-600' : ''}
                >
                  قفل شده
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">پیشرفت کلی</span>
              <span className="text-sm font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.unlocked / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                دستاوردها
              </CardTitle>
              <Badge variant="secondary">
                {filteredAchievements.length} دستاورد
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredAchievements.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">هیچ دستاوردی با این فیلترها یافت نشد</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement: any) => (
                  <Card key={achievement._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Trophy className="w-8 h-8 text-yellow-600" />
                        <h3 className="font-bold">{achievement.achievementId?.title || 'دستاورد'}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{achievement.achievementId?.description || ''}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completion Celebration */}
        {stats.unlocked === stats.total && stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-2xl"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-white font-bold text-3xl mb-2">
              تبریک! همه دستاوردها رو کسب کردی!
            </h2>
            <p className="text-white/90 text-lg">
              تو یک قهرمان واقعی هستی! 🎉
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
