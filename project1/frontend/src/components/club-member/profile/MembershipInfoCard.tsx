import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GlowingCard from '../dashboard/GlowingCard';
import {
  getMembershipLevelLabel,
  getMembershipLevelColor,
  getMembershipStatusLabel,
  getMembershipStatusColor,
  formatMembershipDuration,
  MembershipLevel,
  MembershipStatus,
} from '@/types/clubMember';

interface MembershipInfoCardProps {
  level?: MembershipLevel;
  status?: MembershipStatus;
  memberSince?: Date | string;
  points?: number;
}

export default function MembershipInfoCard({
  level,
  status,
  memberSince,
  points = 0,
}: MembershipInfoCardProps) {
  const membershipDays = memberSince
    ? Math.floor((Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const items = [
    {
      label: 'سطح عضویت',
      value: level ? (
        <Badge className={`bg-${getMembershipLevelColor(level)}-500 text-white text-xs font-bold`}>
          {getMembershipLevelLabel(level)}
        </Badge>
      ) : '-',
    },
    {
      label: 'وضعیت',
      value: status ? (
        <Badge className={`bg-${getMembershipStatusColor(status)}-500 text-white text-xs font-bold`}>
          {getMembershipStatusLabel(status)}
        </Badge>
      ) : '-',
    },
    {
      label: 'مدت عضویت',
      value: <span className="text-sm font-black text-purple-700">{formatMembershipDuration(membershipDays)}</span>,
    },
    {
      label: 'امتیاز کل',
      value: (
        <span className="text-sm font-black text-purple-700 flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {points}
        </span>
      ),
    },
  ];

  return (
    <GlowingCard glowColor="purple">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-black text-gray-900">اطلاعات عضویت</h3>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm text-gray-600 font-medium">{item.label}</span>
              <div>{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlowingCard>
  );
}
