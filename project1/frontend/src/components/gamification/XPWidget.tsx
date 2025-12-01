import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Trophy, TrendingUp, ArrowRight } from 'lucide-react';
import { useMyXP } from '@/hooks/useXP';
import { Link } from 'react-router-dom';

export default function XPWidget() {
  const { data: xpData, isLoading, error } = useMyXP();

  if (error) {
    return (
      <Card className="border-l-4 border-l-red-500 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-red-600">خطا در بارگذاری XP</p>
            <p className="text-xs text-gray-500 mt-1">XP Service در دسترس نیست</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!xpData) return null;

  return (
    <Card className="border-l-4 border-l-purple-500 shadow-lg overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5" />
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">پیشرفت شما</h3>
              <p className="text-xs text-gray-600">سطح {xpData.level}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
            {xpData.rank}
          </Badge>
        </div>

        {/* Level Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {xpData.currentXP.toLocaleString()} / {xpData.xpToNextLevel.toLocaleString()} XP
            </span>
            <span className="font-medium text-purple-600">
              {xpData.levelProgress}%
            </span>
          </div>
          <Progress value={xpData.levelProgress} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-gray-600">کل XP</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {xpData.totalXP.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">ضریب</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              ×{xpData.xpMultiplier}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Link to="/club-member/xp-history">
              تاریخچه
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Link to="/club-member/leaderboard" className="flex items-center gap-1">
              رتبه‌بندی
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
