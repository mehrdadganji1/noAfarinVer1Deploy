import { Eye, Users, Award, TrendingUp, Calendar, Target, Shield, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileStatsProps {
  stats?: {
    profileViews?: number;
    connectionsCount?: number;
    endorsementsReceived?: number;
    eventsAttended?: number;
    projectsCompleted?: number;
    coursesCompleted?: number;
    achievementsEarned?: number;
  };
  membershipPoints?: number;
}

export default function ProfileStats({ stats, membershipPoints }: ProfileStatsProps) {
  const statItems = [
    {
      icon: Eye,
      value: stats?.profileViews || 0,
      label: 'بازدید پروفایل',
      color: 'blue'
    },
    {
      icon: Users,
      value: stats?.connectionsCount || 0,
      label: 'ارتباطات',
      color: 'green'
    },
    {
      icon: Award,
      value: stats?.endorsementsReceived || 0,
      label: 'تاییدیه‌ها',
      color: 'amber'
    },
    {
      icon: Star,
      value: membershipPoints || 0,
      label: 'امتیاز کل',
      color: 'yellow'
    },
    {
      icon: Calendar,
      value: stats?.eventsAttended || 0,
      label: 'رویدادها',
      color: 'purple'
    },
    {
      icon: Target,
      value: stats?.projectsCompleted || 0,
      label: 'پروژه‌ها',
      color: 'pink'
    },
    {
      icon: Shield,
      value: stats?.coursesCompleted || 0,
      label: 'دوره‌ها',
      color: 'indigo'
    },
    {
      icon: TrendingUp,
      value: stats?.achievementsEarned || 0,
      label: 'دستاوردها',
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-8 h-8 text-${item.color}-600`} />
                <span className="text-2xl font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
