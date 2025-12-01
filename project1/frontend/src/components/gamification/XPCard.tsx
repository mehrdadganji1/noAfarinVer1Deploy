import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Award, Zap, Crown, Sparkles } from 'lucide-react';

interface XPCardProps {
  totalXP: number;
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  rank?: number;
  recentGains?: Array<{
    amount: number;
    source: string;
    timestamp: Date;
  }>;
}

const getLevelInfo = (level: number) => {
  if (level >= 50) return { title: 'افسانه', color: 'from-purple-500 to-pink-500', icon: Crown };
  if (level >= 25) return { title: 'استاد', color: 'from-yellow-500 to-orange-500', icon: Award };
  if (level >= 10) return { title: 'ماهر', color: 'from-blue-500 to-cyan-500', icon: Star };
  if (level >= 5) return { title: 'پیشرفته', color: 'from-green-500 to-emerald-500', icon: TrendingUp };
  return { title: 'مبتدی', color: 'from-gray-400 to-gray-500', icon: Sparkles };
};

const formatXP = (xp: number) => {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
};

export default function XPCard({
  totalXP,
  currentXP,
  level,
  xpToNextLevel,
  rank,
  recentGains = [],
}: XPCardProps) {
  const levelInfo = getLevelInfo(level);
  const LevelIcon = levelInfo.icon;
  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <Card className="border-r-4 border-purple-500 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className={`bg-gradient-to-r ${levelInfo.color} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <LevelIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">سطح {level}</h3>
                <p className="text-white/90 text-sm">{levelInfo.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatXP(totalXP)}</div>
              <div className="text-white/90 text-sm">XP کل</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Progress to Next Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">پیشرفت تا سطح بعدی</span>
              <span className="font-medium text-gray-900">
                {currentXP} / {xpToNextLevel}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-gray-500 text-center">
              {xpToNextLevel - currentXP} XP تا سطح {level + 1}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {rank && (
              <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Award className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                <div className="text-lg font-bold text-gray-900">#{rank}</div>
                <div className="text-xs text-gray-600">رتبه</div>
              </div>
            )}
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <Zap className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-lg font-bold text-gray-900">{level}</div>
              <div className="text-xs text-gray-600">سطح</div>
            </div>
          </div>

          {/* Recent XP Gains */}
          {recentGains.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                آخرین دستاوردها
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {recentGains.slice(0, 3).map((gain, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                  >
                    <span className="text-gray-600 truncate">{gain.source}</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                      +{gain.amount}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Level Up Motivation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
          >
            <p className="text-sm text-gray-700">
              {progressPercentage >= 80
                ? '🔥 تقریباً به سطح بعدی رسیدی!'
                : progressPercentage >= 50
                ? '⚡ نصف راه رو طی کردی!'
                : '🌟 به سمت سطح بعدی پیش میری!'}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
