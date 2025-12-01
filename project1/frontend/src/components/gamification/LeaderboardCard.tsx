import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Trophy, Star } from 'lucide-react';

interface LeaderboardUser {
  userId: string;
  name: string;
  email?: string;
  totalXP: number;
  level: number;
  rank: number;
}

interface LeaderboardCardProps {
  user: LeaderboardUser;
  rank: number;
  index?: number;
  isCurrentUser?: boolean;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
  return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
  if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
  if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-pink-400';
  return 'bg-gradient-to-r from-blue-400 to-cyan-400';
};

const getAvatarColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-100 text-yellow-600 border-yellow-300';
  if (rank === 2) return 'bg-gray-100 text-gray-600 border-gray-300';
  if (rank === 3) return 'bg-amber-100 text-amber-600 border-amber-300';
  return 'bg-purple-100 text-purple-600 border-purple-300';
};

export default function LeaderboardCard({
  user,
  rank,
  index = 0,
  isCurrentUser = false,
}: LeaderboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`
          transition-all duration-300 hover:shadow-lg
          ${isCurrentUser ? 'border-2 border-purple-500 bg-gradient-to-r from-purple-50/50 to-pink-50/50' : 'border hover:border-purple-200'}
        `}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-12 flex items-center justify-center flex-shrink-0">
              {getRankIcon(rank)}
            </div>

            {/* Avatar */}
            <div
              className={`
                h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border-2 flex-shrink-0
                ${getAvatarColor(rank)}
              `}
            >
              {user.name[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {user.name}
                </h3>
                {isCurrentUser && (
                  <Badge variant="secondary" className="text-xs">
                    شما
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 ml-1" />
                  سطح {user.level}
                </Badge>
                {rank <= 10 && (
                  <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                    <Trophy className="h-3 w-3 ml-1" />
                    Top 10
                  </Badge>
                )}
              </div>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-purple-600">
                {user.totalXP.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">XP</div>
            </div>

            {/* Badge */}
            <div className={`w-2 h-12 rounded-full ${getRankBadgeColor(rank)} flex-shrink-0`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
