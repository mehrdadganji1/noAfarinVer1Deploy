import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';

interface TrainingStatsProps {
  stats: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
  };
}

export const TrainingStats: React.FC<TrainingStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'کل دوره‌ها',
      value: stats.total,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'در حال برگزاری',
      value: stats.active,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'دوره‌های آینده',
      value: stats.upcoming,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'تکمیل شده',
      value: stats.completed,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
