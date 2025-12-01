import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Trophy,
  Target,
  Users,
  BookOpen,
  Flame,
} from 'lucide-react';

interface XPTransaction {
  _id: string;
  amount: number;
  source: string;
  description?: string;
  metadata?: any;
  createdAt: string;
}

interface XPHistoryCardProps {
  transaction: XPTransaction;
  index?: number;
}

const sourceConfig: Record<string, { label: string; color: string; icon: any }> = {
  login: { label: 'ورود', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Zap },
  daily_login: { label: 'ورود روزانه', color: 'bg-green-100 text-green-700 border-green-300', icon: Flame },
  profile_complete: { label: 'تکمیل پروفایل', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Users },
  project_create: { label: 'ایجاد پروژه', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: Target },
  project_complete: { label: 'تکمیل پروژه', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: Trophy },
  course_complete: { label: 'تکمیل دوره', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: BookOpen },
  achievement_unlock: { label: 'باز کردن دستاورد', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Trophy },
  team_join: { label: 'پیوستن به تیم', color: 'bg-pink-100 text-pink-700 border-pink-300', icon: Users },
  challenge_complete: { label: 'تکمیل چالش', color: 'bg-cyan-100 text-cyan-700 border-cyan-300', icon: Target },
  streak_milestone: { label: 'نقطه عطف Streak', color: 'bg-red-100 text-red-700 border-red-300', icon: Flame },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  return date.toLocaleDateString('fa-IR');
};

export default function XPHistoryCard({
  transaction,
  index = 0,
}: XPHistoryCardProps) {
  const config = sourceConfig[transaction.source] || {
    label: transaction.source,
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: Zap,
  };
  const Icon = config.icon;
  const isPositive = transaction.amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${config.color}`}>
              <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{config.label}</h3>
                <Badge variant="outline" className={`text-xs ${config.color}`}>
                  {transaction.source}
                </Badge>
              </div>
              {transaction.description && (
                <p className="text-sm text-gray-600 truncate">{transaction.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.createdAt)}</p>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <div className={`flex items-center gap-1 text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span>{isPositive ? '+' : ''}{transaction.amount}</span>
              </div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
