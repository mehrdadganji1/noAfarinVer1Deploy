import { motion } from 'framer-motion';
import { Zap, TrendingUp, Target } from 'lucide-react';
import GlowingCard from './GlowingCard';

interface ModernXPWidgetProps {
  currentXP?: number;
  nextLevelXP?: number;
  weeklyXP?: number;
  monthlyXP?: number;
}

export default function ModernXPWidget({
  currentXP = 0,
  nextLevelXP = 1000,
  weeklyXP = 0,
  monthlyXP = 0,
}: ModernXPWidgetProps) {
  const progress = (currentXP / nextLevelXP) * 100;
  const remainingXP = nextLevelXP - currentXP;

  return (
    <GlowingCard glowColor="purple">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#a855f7]" />
            پیشرفت XP
          </h3>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#a855f7] to-[#E91E8C] text-white text-xs font-bold">
            {currentXP.toLocaleString('fa-IR')} XP
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">تا سطح بعدی</span>
            <span className="text-sm font-bold text-[#E91E8C]">{remainingXP.toLocaleString('fa-IR')} XP</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#E91E8C] via-[#a855f7] to-[#00D9FF] rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">0</span>
            <span className="text-xs text-gray-500">{nextLevelXP.toLocaleString('fa-IR')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-[#00D9FF]/10 to-[#0891b2]/10 rounded-xl p-3 border border-[#00D9FF]/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-xs text-gray-600">هفتگی</span>
            </div>
            <div className="text-lg font-black text-gray-900">{weeklyXP.toLocaleString('fa-IR')}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-[#E91E8C]/10 to-[#be185d]/10 rounded-xl p-3 border border-[#E91E8C]/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#E91E8C]" />
              <span className="text-xs text-gray-600">ماهانه</span>
            </div>
            <div className="text-lg font-black text-gray-900">{monthlyXP.toLocaleString('fa-IR')}</div>
          </motion.div>
        </div>
      </div>
    </GlowingCard>
  );
}

