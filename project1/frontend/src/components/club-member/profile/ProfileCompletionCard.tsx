import { motion } from 'framer-motion';
import { TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import GlowingCard from '../dashboard/GlowingCard';

interface ProfileCompletionCardProps {
  completion: number;
  missingItems?: string[];
}

export default function ProfileCompletionCard({ completion, missingItems = [] }: ProfileCompletionCardProps) {
  const isComplete = completion >= 100;

  return (
    <GlowingCard glowColor={isComplete ? 'cyan' : 'cyan'}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-2 bg-gradient-to-br ${isComplete ? 'from-green-600 to-emerald-600' : 'from-cyan-600 to-blue-600'} rounded-lg shadow-lg`}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-black text-gray-900">تکمیل پروفایل</h3>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">درصد تکمیل</span>
              <span className={`text-4xl font-black ${isComplete ? 'text-green-600' : 'text-cyan-600'}`}>
                {completion}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${isComplete ? 'from-green-500 to-emerald-500' : 'from-cyan-500 to-blue-500'} shadow-lg`}
              />
            </div>
          </div>

          {isComplete ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
            >
              <Trophy className="w-6 h-6 text-green-600" />
              <span className="font-black text-green-700">پروفایل شما کامل است!</span>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700 mb-3">برای تکمیل پروفایل:</p>
              {missingItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlowingCard>
  );
}
