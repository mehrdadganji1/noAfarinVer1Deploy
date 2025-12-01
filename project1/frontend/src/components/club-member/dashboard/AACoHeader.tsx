import { motion } from 'framer-motion';
import { Trophy, Zap, Star, TrendingUp, Award, Crown, Gem, Medal } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AACoHeaderProps {
  userName: string;
  level: string;
  points: number;
  rank?: number | null;
  streak?: number;
}

const levelConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  bronze: { label: 'برنزی', color: 'from-amber-600 to-amber-800', icon: Medal },
  silver: { label: 'نقره‌ای', color: 'from-gray-400 to-gray-600', icon: Award },
  gold: { label: 'طلایی', color: 'from-yellow-400 to-yellow-600', icon: Crown },
  platinum: { label: 'پلاتینیوم', color: 'from-cyan-400 to-blue-500', icon: Gem },
  diamond: { label: 'الماس', color: 'from-purple-400 to-pink-500', icon: Gem },
};

function AACoHeader({
  userName,
  level,
  points,
  rank,
  streak = 0,
}: AACoHeaderProps) {
  const config = levelConfig[level] || levelConfig.bronze;
  const LevelIcon = config.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E91E8C] via-[#a855f7] to-[#00D9FF] p-8 shadow-2xl">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left: Welcome Section */}
          <div className="flex items-center gap-5">
            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} shadow-2xl flex items-center justify-center border-4 border-white/30`}
            >
              <LevelIcon className="w-10 h-10 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-2xl blur-sm" />
            </motion.div>

            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2"
              >
                <h1 className="text-3xl font-black text-white">
                  سلام {userName}!
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-base flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-white" />
                به پوشش ملی نوآفرین صنعت ساز خوش آمدید
              </motion.p>
            </div>
          </div>

          {/* Right: Stats Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-white" />
                <div>
                  <div className="text-xs text-white/80 font-medium">سطح</div>
                  <div className="text-sm font-bold text-white">{config.label}</div>
                </div>
              </div>
            </motion.div>

            {/* Points Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-white" />
                <div>
                  <div className="text-xs text-white/80 font-medium">امتیاز</div>
                  <div className="text-sm font-bold text-white">{points.toLocaleString('fa-IR')}</div>
                </div>
              </div>
            </motion.div>

            {/* Rank Badge */}
            {rank && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-xs text-white/80 font-medium">رتبه</div>
                    <div className="text-sm font-bold text-white">#{rank}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Streak Badge */}
            {streak > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 30px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-5 py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 backdrop-blur-md border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-xs text-white/90 font-medium">استریک</div>
                    <div className="text-sm font-bold text-white">{streak} روز</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default AACoHeader;
