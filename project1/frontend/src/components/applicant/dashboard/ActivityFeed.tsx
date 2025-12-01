import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  text: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface ActivityItemProps extends Activity {
  index: number;
}

function ActivityItem({ text, time, icon: Icon, color, index }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
    >
      {/* Icon with Gradient */}
      <div className={cn(
        "relative p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300",
        color
      )}>
        <Icon className="w-4 h-4 text-white" />
        
        {/* Pulse Effect */}
        {index === 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900">
          {text}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {time}
        </p>
      </div>
      
      {/* Chevron */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
}

export function ActivityFeed({ activities, title = "فعالیت‌های اخیر" }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
          مشاهده همه
        </button>
      </div>
      
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            {...activity}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
