import { motion } from 'framer-motion';
import { Edit2, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMembershipLevelLabel, getMembershipLevelColor, MembershipLevel } from '@/types/clubMember';

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  level?: MembershipLevel;
  onEdit: () => void;
  onPreview: () => void;
  onSettings: () => void;
}

export default function ProfileHeader({
  firstName,
  lastName,
  email,
  bio,
  level,
  onEdit,
  onPreview,
  onSettings,
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
    >
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-r from-[#E91E8C] via-[#a855f7] to-[#00D9FF] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative px-8 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-36 h-36 rounded-3xl bg-white p-2 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#E91E8C] to-[#a855f7] flex items-center justify-center text-white text-5xl font-black">
                {firstName?.[0]}{lastName?.[0]}
              </div>
            </div>
            {level && (
              <Badge
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-${getMembershipLevelColor(level)}-500 text-white px-4 py-1.5 text-sm font-bold shadow-lg`}
              >
                {getMembershipLevelLabel(level)}
              </Badge>
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1 md:mr-4 mt-4 md:mt-0">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {firstName} {lastName}
            </h1>
            <p className="text-gray-600 text-lg mb-3">{email}</p>
            {bio && (
              <p className="text-gray-700 leading-relaxed max-w-2xl">{bio}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-[#E91E8C] hover:text-white hover:border-[#E91E8C] transition-all"
            >
              <Edit2 className="w-4 h-4" />
              ویرایش
            </Button>
            <Button
              onClick={onPreview}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-[#00D9FF] hover:text-white hover:border-[#00D9FF] transition-all"
            >
              <Eye className="w-4 h-4" />
              پیش‌نمایش
            </Button>
            <Button
              onClick={onSettings}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-[#a855f7] hover:text-white hover:border-[#a855f7] transition-all"
            >
              <Settings className="w-4 h-4" />
              تنظیمات
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
