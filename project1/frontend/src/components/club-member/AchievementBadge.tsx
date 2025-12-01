import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  index?: number;
  onClick?: () => void;
}

const rarityConfig = {
  common: {
    label: 'رایج',
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    glow: 'shadow-gray-200',
  },
  rare: {
    label: 'کمیاب',
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    glow: 'shadow-blue-200',
  },
  epic: {
    label: 'حماسی',
    gradient: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    glow: 'shadow-purple-200',
  },
  legendary: {
    label: 'افسانه‌ای',
    gradient: 'from-amber-400 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    glow: 'shadow-amber-200',
  },
};

export default function AchievementBadge({ achievement, index = 0, onClick }: AchievementBadgeProps) {
  const rarity = rarityConfig[achievement.rarity];
  const Icon = achievement.icon;
  const progressPercentage = achievement.progress
    ? (achievement.progress.current / achievement.progress.target) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: achievement.isUnlocked ? 1.05 : 1 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className={`h-full transition-all duration-300 ${
          achievement.isUnlocked
            ? `${rarity.bg} border-2 ${rarity.border} hover:${rarity.glow} hover:shadow-lg`
            : 'bg-gray-100 border-2 border-gray-200 opacity-60'
        }`}
      >
        <CardContent className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                achievement.isUnlocked
                  ? `bg-gradient-to-br ${rarity.gradient}`
                  : 'bg-gray-300'
              }`}
            >
              {achievement.isUnlocked ? (
                <Icon className="h-10 w-10 text-white" />
              ) : (
                <Lock className="h-10 w-10 text-gray-500" />
              )}

              {/* Rarity Badge */}
              {achievement.isUnlocked && (
                <div className="absolute -top-1 -right-1">
                  <Badge className={`bg-gradient-to-r ${rarity.gradient} text-white border-0 text-xs`}>
                    {rarity.label}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-center font-bold mb-2 ${
              achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {achievement.title}
          </h3>

          {/* Description */}
          <p
            className={`text-center text-sm mb-3 line-clamp-2 ${
              achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            {achievement.description}
          </p>

          {/* Points */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className={`px-3 py-1 rounded-full ${
                achievement.isUnlocked
                  ? `bg-gradient-to-r ${rarity.gradient} text-white`
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <span className="text-sm font-bold">+{achievement.points} امتیاز</span>
            </div>
          </div>

          {/* Progress Bar (if not unlocked and has progress) */}
          {!achievement.isUnlocked && achievement.progress && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>پیشرفت</span>
                <span>
                  {achievement.progress.current}/{achievement.progress.target}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlocked Date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-center text-gray-500 mt-2">
              {new Date(achievement.unlockedAt).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
