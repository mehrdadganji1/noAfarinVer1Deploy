import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  History,
  TrendingUp,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useXPHistory } from '@/hooks/useXP';

const sourceLabels: Record<string, string> = {
  login: 'ورود',
  daily_login: 'ورود روزانه',
  profile_complete: 'تکمیل پروفایل',
  project_create: 'ایجاد پروژه',
  project_complete: 'تکمیل پروژه',
  course_complete: 'تکمیل دوره',
  achievement_unlock: 'باز کردن دستاورد',
  team_join: 'پیوستن به تیم',
  challenge_complete: 'تکمیل چالش',
  streak_milestone: 'نقطه عطف Streak',
};

const sourceColors: Record<string, string> = {
  login: 'bg-blue-100 text-blue-700',
  daily_login: 'bg-green-100 text-green-700',
  profile_complete: 'bg-purple-100 text-purple-700',
  project_create: 'bg-orange-100 text-orange-700',
  project_complete: 'bg-emerald-100 text-emerald-700',
  course_complete: 'bg-indigo-100 text-indigo-700',
  achievement_unlock: 'bg-amber-100 text-amber-700',
  team_join: 'bg-pink-100 text-pink-700',
  challenge_complete: 'bg-cyan-100 text-cyan-700',
  streak_milestone: 'bg-red-100 text-red-700',
};

function XPHistory() {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState<string>('');
  const limit = 20;

  const { data, isLoading } = useXPHistory(page, limit, source || undefined);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'همین الان';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 7) return `${diffDays} روز پیش`;
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <History className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 md:mr-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  تاریخچه XP
                </h1>
                <p className="text-gray-600 mt-1">
                  مشاهده تمام فعالیت‌های XP شما
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فیلترها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  منبع XP
                </label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه منابع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">همه منابع</SelectItem>
                    {Object.entries(sourceLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {source && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setSource('')}
                    className="gap-2"
                  >
                    پاک کردن فیلتر
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                فعالیت‌های XP
              </CardTitle>
              {data && (
                <Badge variant="secondary">
                  {data.pagination.total} فعالیت
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : data?.history.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">هیچ فعالیت XP یافت نشد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.history.map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-white rounded-lg border hover:shadow-md transition-all"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={`text-xs ${
                                sourceColors[transaction.source] ||
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {sourceLabels[transaction.source] || transaction.source}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(transaction.timestamp)}
                            </div>
                            {transaction.multiplier > 1 && (
                              <Badge variant="outline" className="text-xs">
                                ×{transaction.multiplier}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-green-600">
                            +{transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">XP</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  صفحه {data.pagination.page} از {data.pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.totalPages}
                  >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default XPHistory;
