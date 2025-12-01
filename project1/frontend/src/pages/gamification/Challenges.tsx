import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Clock,
  Trophy,
  CheckCircle2,
  Circle,
  Star,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  expiresAt?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockChallenges: Challenge[] = [
  // Daily
  {
    id: '1',
    title: 'ورود روزانه',
    description: 'امروز وارد سیستم شو',
    type: 'daily',
    xpReward: 20,
    progress: 1,
    target: 1,
    completed: true,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    difficulty: 'easy',
  },
  {
    id: '2',
    title: 'مشاهده یک دوره',
    description: 'حداقل یک درس ببین',
    type: 'daily',
    xpReward: 50,
    progress: 0,
    target: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    difficulty: 'easy',
  },
  {
    id: '3',
    title: 'کار روی پروژه',
    description: 'یک milestone تکمیل کن',
    type: 'daily',
    xpReward: 100,
    progress: 0,
    target: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    difficulty: 'medium',
  },
  
  // Weekly
  {
    id: '4',
    title: 'شرکت در 3 رویداد',
    description: 'در 3 رویداد این هفته شرکت کن',
    type: 'weekly',
    xpReward: 300,
    progress: 1,
    target: 3,
    completed: false,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'medium',
  },
  {
    id: '5',
    title: 'تکمیل 2 دوره',
    description: '2 دوره آموزشی را تکمیل کن',
    type: 'weekly',
    xpReward: 500,
    progress: 0,
    target: 2,
    completed: false,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'hard',
  },
  {
    id: '6',
    title: 'کمک به 5 عضو',
    description: 'به 5 عضو دیگر کمک کن',
    type: 'weekly',
    xpReward: 400,
    progress: 2,
    target: 5,
    completed: false,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'medium',
  },
  
  // Monthly
  {
    id: '7',
    title: 'استاد ماه',
    description: '10 پروژه را تکمیل کن',
    type: 'monthly',
    xpReward: 2000,
    progress: 3,
    target: 10,
    completed: false,
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'hard',
  },
  {
    id: '8',
    title: 'یادگیرنده ماه',
    description: '5 دوره را تکمیل کن',
    type: 'monthly',
    xpReward: 1500,
    progress: 1,
    target: 5,
    completed: false,
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'hard',
  },
  
  // Special
  {
    id: '9',
    title: 'چالش ویژه: هکاتون',
    description: 'در هکاتون شرکت کن و پروژه ارائه بده',
    type: 'special',
    xpReward: 5000,
    progress: 0,
    target: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'hard',
  },
];

const typeLabels = {
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  special: 'ویژه',
};

const typeColors = {
  daily: 'from-blue-400 to-cyan-400',
  weekly: 'from-green-400 to-emerald-400',
  monthly: 'from-purple-400 to-pink-400',
  special: 'from-yellow-400 to-orange-400',
};

const difficultyLabels = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function Challenges() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (selectedType === 'all') return true;
    return challenge.type === selectedType;
  });

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return '';
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} روز`;
    if (hours > 0) return `${hours} ساعت`;
    return 'کمتر از 1 ساعت';
  };

  const stats = {
    daily: mockChallenges.filter(c => c.type === 'daily' && c.completed).length,
    weekly: mockChallenges.filter(c => c.type === 'weekly' && c.completed).length,
    monthly: mockChallenges.filter(c => c.type === 'monthly' && c.completed).length,
    total: mockChallenges.filter(c => c.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-20 w-20 text-white/90" />
            </div>
          </div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:mr-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  چالش‌ها
                </h1>
                <p className="text-gray-600 mt-1">
                  چالش‌ها را تکمیل کن و XP بیشتری کسب کن
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.daily}</div>
              <div className="text-sm text-gray-600">روزانه تکمیل شده</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.weekly}</div>
              <div className="text-sm text-gray-600">هفتگی تکمیل شده</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.monthly}</div>
              <div className="text-sm text-gray-600">ماهانه تکمیل شده</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.total}</div>
              <div className="text-sm text-gray-600">کل تکمیل شده</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                همه
              </Button>
              <Button
                variant={selectedType === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('daily')}
                className={selectedType === 'daily' ? 'bg-blue-600' : ''}
              >
                روزانه
              </Button>
              <Button
                variant={selectedType === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('weekly')}
                className={selectedType === 'weekly' ? 'bg-green-600' : ''}
              >
                هفتگی
              </Button>
              <Button
                variant={selectedType === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('monthly')}
                className={selectedType === 'monthly' ? 'bg-purple-600' : ''}
              >
                ماهانه
              </Button>
              <Button
                variant={selectedType === 'special' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('special')}
                className={selectedType === 'special' ? 'bg-yellow-600' : ''}
              >
                ویژه
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Challenges List */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-l-4 ${
                challenge.completed
                  ? 'border-l-green-500 bg-green-50/50'
                  : 'border-l-gray-300'
              } hover:shadow-lg transition-all`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {challenge.completed ? (
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${typeColors[challenge.type]} flex items-center justify-center`}>
                          <Circle className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold ${
                            challenge.completed ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}>
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={`bg-gradient-to-r ${typeColors[challenge.type]}`}>
                            {typeLabels[challenge.type]}
                          </Badge>
                          <Badge className={difficultyColors[challenge.difficulty]}>
                            {difficultyLabels[challenge.difficulty]}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress */}
                      {!challenge.completed && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              پیشرفت: {challenge.progress}/{challenge.target}
                            </span>
                            <span className="font-medium text-purple-600">
                              {Math.round((challenge.progress / challenge.target) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(challenge.progress / challenge.target) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-gray-900">
                              +{challenge.xpReward.toLocaleString()} XP
                            </span>
                          </div>
                          {challenge.expiresAt && !challenge.completed && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeRemaining(challenge.expiresAt)} باقی مانده</span>
                            </div>
                          )}
                        </div>
                        {challenge.completed && (
                          <Badge className="bg-green-600">
                            <Trophy className="h-3 w-3 ml-1" />
                            تکمیل شده
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
