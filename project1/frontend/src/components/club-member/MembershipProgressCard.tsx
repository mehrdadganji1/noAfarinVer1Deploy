import { Award, Star, Sparkles, TrendingUp, Zap, Crown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  MembershipLevel,
  getMembershipLevelLabel,
  getMembershipLevelColor,
} from '@/types/clubMember'

export interface LevelBenefits {
  level: MembershipLevel
  benefits: string[]
  requiredPoints: number
}

export interface MembershipProgressCardProps {
  currentLevel: MembershipLevel
  currentPoints: number
  nextLevel?: MembershipLevel
  requiredPoints?: number
  className?: string
}

// تعریف سطوح و امتیازات مورد نیاز
const levelHierarchy: Record<MembershipLevel, { order: number; requiredPoints: number; icon: typeof Award }> = {
  [MembershipLevel.BRONZE]: {
    order: 1,
    requiredPoints: 0,
    icon: Award,
  },
  [MembershipLevel.SILVER]: {
    order: 2,
    requiredPoints: 100,
    icon: Star,
  },
  [MembershipLevel.GOLD]: {
    order: 3,
    requiredPoints: 300,
    icon: Sparkles,
  },
  [MembershipLevel.PLATINUM]: {
    order: 4,
    requiredPoints: 600,
    icon: Crown,
  },
}

// مزایای هر سطح
const levelBenefits: Record<MembershipLevel, string[]> = {
  [MembershipLevel.BRONZE]: [
    'دسترسی به رویدادهای عمومی',
    'عضویت در یک پروژه',
    'دسترسی به منابع پایه',
  ],
  [MembershipLevel.SILVER]: [
    'دسترسی به رویدادهای VIP',
    'عضویت در 3 پروژه',
    'دسترسی به mentorship',
    'تخفیف 10% دوره‌ها',
  ],
  [MembershipLevel.GOLD]: [
    'اولویت ثبت نام رویدادها',
    'عضویت نامحدود پروژه',
    'mentorship اختصاصی',
    'تخفیف 20% دوره‌ها',
    'بادج طلایی',
  ],
  [MembershipLevel.PLATINUM]: [
    'دسترسی به همه امکانات',
    'اولویت اول در همه چیز',
    'mentorship VIP',
    'تخفیف 50% دوره‌ها',
    'بادج پلاتینیوم',
    'دعوت به رویدادهای خاص',
  ],
}

export default function MembershipProgressCard({
  currentLevel,
  currentPoints,
  nextLevel,
  requiredPoints,
  className,
}: MembershipProgressCardProps) {
  // محاسبه سطح بعدی
  const currentLevelData = levelHierarchy[currentLevel]
  const currentOrder = currentLevelData.order
  
  // اگر next level مشخص نشده، پیدا کن
  if (!nextLevel) {
    const levels = Object.values(MembershipLevel)
    const nextLevelIndex = levels.findIndex((l) => levelHierarchy[l].order === currentOrder + 1)
    nextLevel = nextLevelIndex >= 0 ? levels[nextLevelIndex] : undefined
  }
  
  const nextLevelData = nextLevel ? levelHierarchy[nextLevel] : null
  const isMaxLevel = !nextLevel || currentOrder >= 4
  
  // محاسبه پیشرفت
  const currentLevelPoints = currentLevelData.requiredPoints
  const nextLevelPoints = requiredPoints || nextLevelData?.requiredPoints || currentPoints
  const pointsNeeded = isMaxLevel ? 0 : nextLevelPoints - currentPoints
  const progressPercentage = isMaxLevel
    ? 100
    : Math.min(100, Math.round(((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))

  // آیکون‌ها
  const CurrentLevelIcon = currentLevelData.icon
  const NextLevelIcon = nextLevelData?.icon || Crown

  // رنگ‌ها
  const currentColor = getMembershipLevelColor(currentLevel)
  const currentBenefits = levelBenefits[currentLevel]
  const nextBenefits = nextLevel ? levelBenefits[nextLevel] : []

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        {/* Header با gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <CurrentLevelIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">سطح فعلی شما</p>
                <h3 className="text-2xl font-bold">{getMembershipLevelLabel(currentLevel)}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">امتیاز کل</p>
              <p className="text-3xl font-bold">{currentPoints}</p>
            </div>
          </div>

          {/* Progress to Next Level */}
          {!isMaxLevel && nextLevel && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/90">پیشرفت به {getMembershipLevelLabel(nextLevel)}</span>
                <span className="font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full relative"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              <p className="text-xs text-white/80 mt-2">
                {pointsNeeded} امتیاز تا سطح بعد
              </p>
            </div>
          )}

          {/* Max Level */}
          {isMaxLevel && (
            <div className="flex items-center gap-2 text-yellow-300">
              <Crown className="h-5 w-5" />
              <span className="font-bold">شما به بالاترین سطح رسیده‌اید! 🎉</span>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="p-6 space-y-4">
          {/* Current Benefits */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              مزایای فعلی شما
            </h4>
            <div className="space-y-2">
              {currentBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Level Benefits */}
          {!isMaxLevel && nextLevel && nextBenefits.length > 0 && (
            <>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  مزایای سطح {getMembershipLevelLabel(nextLevel)}
                </h4>
                <div className="space-y-2">
                  {nextBenefits.slice(currentBenefits.length).map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-start gap-2 text-sm text-gray-500"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <NextLevelIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      چطور {pointsNeeded} امتیاز بگیرم؟
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• شرکت در رویدادها: 10 امتیاز</li>
                      <li>• تکمیل پروژه: 30 امتیاز</li>
                      <li>• اتمام دوره: 20 امتیاز</li>
                      <li>• کسب دستاورد: 15 امتیاز</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
