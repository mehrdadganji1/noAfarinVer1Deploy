import { motion } from 'framer-motion';
import { Activity as ActivityIcon, Trophy, Calendar, BookOpen, FolderKanban, GraduationCap } from 'lucide-react';
import GlowingCard from './GlowingCard';

// Inline ModernActivityCard component
const ModernActivityCard = ({ activity, index }: { activity: Activity; index: number }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'achievement': return Trophy;
      case 'event': return Calendar;
      case 'course': return BookOpen;
      case 'project': return FolderKanban;
      case 'training': return GraduationCap;
      default: return ActivityIcon;
    }
  };
  const Icon = getIcon();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
    >
      <div className="p-2 rounded-lg bg-purple-100">
        <Icon className="w-4 h-4 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{activity.title}</p>
        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
      </div>
      {activity.points && (
        <span className="text-xs font-bold text-purple-600">+{activity.points} XP</span>
      )}
    </motion.div>
  );
};

interface Activity {
  id: string;
  type: 'event' | 'achievement' | 'project' | 'course' | 'training';
  title: string;
  description: string;
  timestamp: Date;
  points?: number;
  icon?: string;
}

interface ModernActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
}

export default function ModernActivityTimeline({ 
  activities, 
  loading 
}: ModernActivityTimelineProps) {
  return (
    <GlowingCard glowColor="magenta">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-[#E91E8C]" />
            فعالیت‌های اخیر
          </h2>
          <span className="text-sm text-gray-500">
            {activities?.length || 0} فعالیت
          </span>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <ModernActivityCard
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">هنوز فعالیتی ثبت نشده است</p>
          </motion.div>
        )}
      </div>
    </GlowingCard>
  );
}

