import { motion } from 'framer-motion';
import { Award, Lock, Star, Target, Rocket, BookOpen, Crown } from 'lucide-react';
import GlowingCard from './GlowingCard';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityGlow = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50',
};

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'اولین قدم',
    description: 'اولین رویداد خود را تکمیل کنید',
    icon: Target,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: '2',
    title: 'پروژه‌ساز',
    description: '5 پروژه موفق ایجاد کنید',
    icon: Rocket,
    unlocked: true,
    progress: 100,
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'استاد یادگیری',
    description: '10 دوره را با موفقیت بگذرانید',
    icon: BookOpen,
    unlocked: false,
    progress: 60,
    rarity: 'epic',
  },
  {
    id: '4',
    title: 'افسانه نوآوری',
    description: 'به رتبه 1 جدول برسید',
    icon: Crown,
    unlocked: false,
    progress: 25,
    rarity: 'legendary',
  },
];

function AchievementsShowcase() {
  const unlockedCount = defaultAchievements.filter((a) => a.unlocked).length;
  
  return (
    <GlowingCard glowColor="purple">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#a855f7]" />
            دستاوردهای اخیر
          </h3>
          <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            {unlockedCount}/{defaultAchievements.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {defaultAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative group"
            >
              <div
                className={`relative overflow-hidden rounded-2xl p-5 min-h-[180px] flex flex-col ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-xl ${rarityGlow[achievement.rarity]}`
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
                }`}
              >
                {/* Lock Overlay for Locked Achievements */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center flex-1">
                  {/* Icon */}
                  <div className="mb-3">
                    <achievement.icon 
                      className={`w-14 h-14 ${achievement.unlocked ? 'text-white drop-shadow-lg' : 'text-gray-500'}`} 
                    />
                  </div>

                  {/* Title */}
                  <h4
                    className={`text-base font-black mb-2 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {achievement.title}
                  </h4>

                  {/* Description */}
                  <p
                    className={`text-xs leading-relaxed mb-3 ${
                      achievement.unlocked ? 'text-white/90' : 'text-gray-600'
                    }`}
                  >
                    {achievement.description}
                  </p>

                  {/* Stars for Unlocked */}
                  {achievement.unlocked && (
                    <div className="flex justify-center gap-1 mt-auto">
                      {[
                        ...Array(
                          achievement.rarity === 'legendary'
                            ? 5
                            : achievement.rarity === 'epic'
                            ? 4
                            : achievement.rarity === 'rare'
                            ? 3
                            : 2
                        ),
                      ].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-white text-white drop-shadow" />
                      ))}
                    </div>
                  )}

                  {/* Progress Bar for Locked */}
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="w-full mt-auto">
                      <div className="h-2.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#E91E8C] via-[#a855f7] to-[#00D9FF] shadow-lg"
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-700 mt-1.5">
                        {achievement.progress}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Shine Effect for Unlocked */}
                {achievement.unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-[#a855f7] via-[#E91E8C] to-[#00D9FF] text-white font-black text-base hover:shadow-2xl transition-all duration-300"
        >
          مشاهده همه دستاوردها
        </motion.button>
      </div>
    </GlowingCard>
  );
}

export default AchievementsShowcase;

