import { Award, Trophy, Star, Target, Zap, Crown, Sparkles, Medal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: 'award' | 'trophy' | 'star' | 'target' | 'zap' | 'crown' | 'medal'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: Date
  points: number
  category: string
}

export interface AchievementProgress {
  id: string
  title: string
  description: string
  icon: 'award' | 'trophy' | 'star' | 'target' | 'zap' | 'crown' | 'medal'
  current: number
  target: number
  category: string
}

export interface RecentAchievementsWidgetProps {
  achievements: Achievement[]
  progress?: AchievementProgress[]
  loading?: boolean
  onViewAll?: () => void
  maxAchievements?: number
}

const iconMap = {
  award: Award,
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
  medal: Medal,
}

const rarityConfig = {
  common: {
    label: 'معمولی',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400/50',
  },
  rare: {
    label: 'نادر',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    gradient: 'from-blue-400 to-cyan-600',
    glow: 'shadow-blue-400/50',
  },
  epic: {
    label: 'حماسی',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    gradient: 'from-purple-400 to-pink-600',
    glow: 'shadow-purple-400/50',
  },
  legendary: {
    label: 'افسانه‌ای',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    gradient: 'from-amber-400 to-orange-600',
    glow: 'shadow-amber-400/50',
  },
}

export default function RecentAchievementsWidget({
  achievements,
  progress = [],
  loading = false,
  onViewAll,
  maxAchievements = 5,
}: RecentAchievementsWidgetProps) {
  const displayAchievements = achievements.slice(0, maxAchievements)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <SectionHeader
            title="دستاوردهای اخیر"
            subtitle="تازه‌ترین دستاوردهای شما"
            icon={Trophy}
            iconColor="amber"
            size="sm"
          />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader
          title="دستاوردهای اخیر"
          subtitle="تازه‌ترین دستاوردهای شما"
          icon={Trophy}
          iconColor="amber"
          size="sm"
          badge={achievements.length}
          action={
            onViewAll
              ? {
                  label: 'مشاهده همه',
                  onClick: onViewAll,
                }
              : undefined
          }
        />

        {/* Recent Achievements */}
        {achievements.length > 0 ? (
          <div className="mt-4 space-y-3">
            {displayAchievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon]
              const rarity = rarityConfig[achievement.rarity]
              const daysAgo = Math.floor((Date.now() - new Date(achievement.earnedAt).getTime()) / (1000 * 60 * 60 * 24))

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-300',
                    rarity.color,
                    'hover:shadow-lg',
                    rarity.glow
                  )}
                >
                  {/* Background Glow Effect */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl opacity-20 blur-xl',
                      `bg-gradient-to-r ${rarity.gradient}`
                    )}
                  />

                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                        `bg-gradient-to-br ${rarity.gradient}`,
                        'shadow-lg'
                      )}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {achievement.title}
                        </h4>
                        <Badge variant="secondary" className={rarity.color}>
                          {rarity.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {daysAgo === 0 ? 'امروز' : `${daysAgo} روز پیش`}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="h-3 w-3 fill-current" />
                          +{achievement.points}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sparkle Animation for Legendary */}
                  {achievement.rarity === 'legendary' && (
                    <>
                      <Sparkles className="absolute top-2 right-2 h-4 w-4 text-amber-400 animate-pulse" />
                      <Sparkles className="absolute bottom-2 left-2 h-3 w-3 text-amber-400 animate-pulse delay-300" />
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 mt-4">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">هنوز دستاوردی کسب نکرده‌اید</p>
            <p className="text-sm text-gray-400">
              با شرکت در فعالیت‌ها دستاورد کسب کنید!
            </p>
          </div>
        )}

        {/* Achievement Progress */}
        {progress.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              در حال پیگیری
            </h4>
            <div className="space-y-3">
              {progress.slice(0, 3).map((item, index) => {
                const Icon = iconMap[item.icon]
                const percentage = Math.round((item.current / item.target) * 100)

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-gray-900 truncate">
                          {item.title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                          <span>
                            {item.current} / {item.target}
                          </span>
                          <span className="font-bold text-blue-600">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
