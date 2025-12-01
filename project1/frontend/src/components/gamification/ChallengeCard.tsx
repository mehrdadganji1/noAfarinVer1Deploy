import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  Trophy,
  Gift,
  Loader2,
  Target,
  Zap,
  Star,
  FolderKanban,
  Calendar,
  GraduationCap,
  Users,
  User,
  Sparkles,
} from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onClaim?: (challengeId: string) => void;
  isClaiming?: boolean;
  index?: number;
}

const difficultyConfig = {
  easy: {
    label: 'آسان',
    color: 'bg-green-100 text-green-700 border-green-300',
    gradient: 'from-green-500 to-emerald-500',
    icon: Star,
  },
  medium: {
    label: 'متوسط',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    gradient: 'from-yellow-500 to-amber-500',
    icon: Target,
  },
  hard: {
    label: 'سخت',
    color: 'bg-red-100 text-red-700 border-red-300',
    gradient: 'from-red-500 to-rose-500',
    icon: Zap,
  },
};

// Category icons for future use
const categoryIcons: Record<string, any> = {
  projects: FolderKanban,
  events: Calendar,
  courses: GraduationCap,
  social: Users,
  profile: User,
  general: Sparkles,
};

// Get category icon
const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || Sparkles;
};

export default function ChallengeCard({
  challenge,
  onClaim,
  isClaiming = false,
  index = 0,
}: ChallengeCardProps) {
  const progress = challenge.userProgress;
  const isCompleted = progress?.completed || false;
  const isClaimed = progress?.claimedReward || false;
  const diffConfig = difficultyConfig[challenge.difficulty] || difficultyConfig.easy;
  const DiffIcon = diffConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group"
    >
      <Card
        className={`
          border-r-4 transition-all duration-300
          ${
            isClaimed
              ? 'border-green-500 bg-gradient-to-l from-green-50/50 to-transparent'
              : isCompleted
              ? 'border-yellow-500 bg-gradient-to-l from-yellow-50/50 to-transparent hover:shadow-lg'
              : 'border-gray-300 hover:border-purple-400 hover:shadow-md'
          }
        `}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <div
              className={`
              flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
              transition-transform duration-300 group-hover:scale-110
              ${
                isClaimed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                  : isCompleted
                  ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }
            `}
            >
              {isClaimed ? (
                <CheckCircle2 className="h-6 w-6 text-white" />
              ) : isCompleted ? (
                <Trophy className="h-6 w-6 text-white" />
              ) : (
                <Circle className="h-6 w-6 text-gray-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`
                    font-bold text-sm leading-tight mb-1
                    ${isClaimed ? 'text-gray-500 line-through' : 'text-gray-900'}
                  `}
                  >
                    {challenge.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`${diffConfig.color} text-xs`}>
                      <DiffIcon className="h-3 w-3 ml-1" />
                      {diffConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* XP Badge */}
                <Badge
                  className={`
                  flex-shrink-0 text-xs
                  ${
                    isClaimed
                      ? 'bg-green-600'
                      : `bg-gradient-to-r ${diffConfig.gradient} text-white`
                  }
                `}
                >
                  +{challenge.rewards.xp} XP
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {challenge.description}
              </p>

              {/* Progress Bar */}
              {!isCompleted && progress && progress.targetCount > 1 && (
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>پیشرفت</span>
                    <span className="font-medium">
                      {progress.progress}/{progress.targetCount}
                    </span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                </div>
              )}

              {/* Claim Button */}
              {isCompleted && !isClaimed && onClaim && (
                <Button
                  size="sm"
                  onClick={() => onClaim(challenge._id)}
                  disabled={isClaiming}
                  className={`w-full bg-gradient-to-r ${diffConfig.gradient} hover:opacity-90`}
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin ml-2" />
                      در حال دریافت...
                    </>
                  ) : (
                    <>
                      <Gift className="h-3 w-3 ml-2" />
                      دریافت جایزه
                    </>
                  )}
                </Button>
              )}

              {/* Claimed Badge */}
              {isClaimed && (
                <div className="flex items-center gap-2 text-green-600 text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">جایزه دریافت شد</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
