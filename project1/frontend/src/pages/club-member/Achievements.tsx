import React, { useState } from 'react';
import { Trophy, Star, Award, Target, Users, BookOpen } from 'lucide-react';
import { useUserAchievements } from '../../hooks/useAchievements';
import { AchievementCategory } from '../../types/achievement';
import { Card, CardContent } from '@/components/ui/card';

const categories: { value: AchievementCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'همه', icon: <Trophy className="w-5 h-5" /> },
  { value: 'project', label: 'پروژه‌ها', icon: <Target className="w-5 h-5" /> },
  { value: 'course', label: 'دوره‌ها', icon: <BookOpen className="w-5 h-5" /> },
  { value: 'milestone', label: 'مایلستون‌ها', icon: <Award className="w-5 h-5" /> },
  { value: 'team', label: 'تیم', icon: <Users className="w-5 h-5" /> },
  { value: 'community', label: 'انجمن', icon: <Star className="w-5 h-5" /> },
];

export const Achievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const { data, isLoading, error } = useUserAchievements();

  const filteredAchievements =
    selectedCategory === 'all'
      ? data?.achievements
      : data?.achievements.filter(
          (ua) => ua.achievementId.category === selectedCategory
        );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری دستاوردها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">دسترسی محدود</h2>
          <p className="text-gray-600 mb-4">
            برای مشاهده دستاوردها لطفاً وارد حساب کاربری خود شوید.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">دستاوردها</h1>
              <p className="text-gray-600">مجموعه افتخارات و موفقیت‌های شما</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">مجموع امتیازات</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {data?.stats.totalPoints || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">دستاوردهای باز شده</p>
                  <p className="text-3xl font-bold text-green-600">
                    {data?.stats.completedCount || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">کل دستاوردها</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {data?.stats.totalCount || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements && filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((userAchievement) => (
              <Card key={userAchievement._id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                    <h3 className="font-bold">{userAchievement.achievementId.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{userAchievement.achievementId.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              هنوز دستاوردی در این دسته ندارید
            </p>
            <p className="text-gray-500 text-sm mt-2">
              با فعالیت در پروژه‌ها و دوره‌ها، دستاوردهای جدید کسب کنید!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
