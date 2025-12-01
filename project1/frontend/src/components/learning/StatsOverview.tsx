import React from 'react';
import { Book, CheckCircle, Clock, TrendingUp, Bookmark } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalResources: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    totalTimeSpent: number;
    bookmarked: number;
    progressPercentage: number;
  } | null;
  loading: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: <Book className="w-8 h-8" />,
      label: 'کل منابع',
      value: stats.totalResources,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      label: 'تکمیل شده',
      value: stats.completed,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: 'در حال مطالعه',
      value: stats.inProgress,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: 'زمان مطالعه',
      value: `${stats.totalTimeSpent} دقیقه`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">پیشرفت کلی شما</h3>
            <p className="text-blue-100 text-sm">
              {stats.completed} از {stats.totalResources} منبع تکمیل شده
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.progressPercentage}%</p>
            <p className="text-blue-100 text-sm">تکمیل شده</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.progressPercentage}%` }}
          ></div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.bookmarked}</p>
            <p className="text-blue-100 text-sm">نشانک شده</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.inProgress}</p>
            <p className="text-blue-100 text-sm">در حال مطالعه</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.notStarted}</p>
            <p className="text-blue-100 text-sm">شروع نشده</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
