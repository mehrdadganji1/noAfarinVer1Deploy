import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Award } from 'lucide-react';
import { useMyXP } from '@/hooks/useXP';

export default function XPDisplay() {
  const { data: xp, isLoading } = useMyXP();

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-32"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!xp) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/15 to-purple-600/15 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">سطح شما</p>
                <p className="text-2xl font-bold text-purple-600">
                  {xp.level}
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              {xp.rank}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                {xp.currentXP.toLocaleString()} XP
              </span>
              <span className="text-gray-600">
                {xp.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xp.levelProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {xp.levelProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-[10px] text-gray-600">کل XP</p>
                <p className="text-sm font-bold text-gray-900">
                  {xp.totalXP.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-[10px] text-gray-600">ضریب</p>
                <p className="text-sm font-bold text-gray-900">
                  ×{xp.xpMultiplier}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
