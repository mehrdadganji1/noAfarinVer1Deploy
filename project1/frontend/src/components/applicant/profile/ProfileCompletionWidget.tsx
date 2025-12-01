import { FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileCompletionItem {
  id: string;
  label: string;
  completed: boolean;
  action?: () => void;
}

interface ProfileCompletionWidgetProps {
  items: ProfileCompletionItem[];
  onItemClick?: (id: string) => void;
}

export const ProfileCompletionWidget: FC<ProfileCompletionWidgetProps> = ({
  items,
  onItemClick,
}) => {
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const getProgressColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 50) return 'from-blue-500 to-indigo-500';
    if (percentage >= 30) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getProgressText = () => {
    if (percentage === 100) return 'پروفایل شما کامل است! 🎉';
    if (percentage >= 80) return 'تقریباً تمام شد!';
    if (percentage >= 50) return 'در مسیر درستی هستید!';
    if (percentage >= 30) return 'شروع خوبی بود!';
    return 'بیایید پروفایل خود را تکمیل کنیم';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getProgressColor()} flex items-center justify-center`}>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              تکمیل پروفایل
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getProgressText()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {percentage}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {completedCount} از {totalCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute inset-y-0 right-0 bg-gradient-to-l ${getProgressColor()} rounded-full`}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !item.completed && (item.action?.() || onItemClick?.(item.id))}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              item.completed
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
              <span className={`text-sm font-medium ${
                item.completed
                  ? 'text-green-700 dark:text-green-300 line-through'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {item.label}
              </span>
            </div>
            {!item.completed && (
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      {percentage < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            پروفایل کامل‌تر، فرصت‌های بیشتر! 🚀
          </p>
          <Button
            onClick={() => {
              const firstIncomplete = items.find(item => !item.completed);
              if (firstIncomplete) {
                firstIncomplete.action?.() || onItemClick?.(firstIncomplete.id);
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            ادامه تکمیل پروفایل
          </Button>
        </motion.div>
      )}

      {/* Success Message */}
      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
            <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
              🎉 عالی! پروفایل شما کامل است
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              حالا می‌توانید برای فرصت‌های شغلی درخواست دهید
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileCompletionWidget;
