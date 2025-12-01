import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import GlowingCard from './GlowingCard';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardWidgetProps {
  entries?: LeaderboardEntry[];
  currentUserRank?: number;
}

const defaultEntries: LeaderboardEntry[] = [
  { rank: 1, name: 'علی محمدی', points: 2850 },
  { rank: 2, name: 'سارا احمدی', points: 2640 },
  { rank: 3, name: 'رضا کریمی', points: 2420 },
  { rank: 4, name: 'مریم حسینی', points: 2180 },
  { rank: 5, name: 'امیر رضایی', points: 1950 },
];

function LeaderboardWidget({
  entries = defaultEntries,
  currentUserRank,
}: LeaderboardWidgetProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-amber-500';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <GlowingCard glowColor="cyan">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#E91E8C]" />
            جدول رتبه‌بندی
          </h3>
          {currentUserRank && (
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#E91E8C] to-[#a855f7] text-white text-xs font-bold">
              رتبه شما: #{currentUserRank}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5, scale: 1.02 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-[#E91E8C]/10 to-[#a855f7]/10 border-2 border-[#E91E8C]/30'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getRankBg(entry.rank)} flex items-center justify-center shadow-md`}>
                {getRankIcon(entry.rank)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{entry.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{entry.points.toLocaleString('fa-IR')} امتیاز</span>
                </div>
              </div>

              {/* Points Badge */}
              {entry.rank <= 3 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 px-3 py-1 rounded-full bg-white shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-orange-500" />
                  Top {entry.rank}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#0891b2] text-white font-bold hover:shadow-lg transition-all"
        >
          مشاهده جدول کامل
        </motion.button>
      </div>
    </GlowingCard>
  );
}

export default LeaderboardWidget;

