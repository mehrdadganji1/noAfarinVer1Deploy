import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex gap-4"
        >
          {/* Line */}
          {index < items.length - 1 && (
            <div className="absolute right-[15px] top-8 bottom-0 w-[2px] bg-border" />
          )}

          {/* Icon */}
          <div className="relative z-10">
            {item.status === 'completed' ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : item.status === 'current' ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-sm animate-pulse">
                <Circle className="w-4 h-4 text-white fill-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <Circle className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className={cn(
                  'font-semibold text-sm',
                  item.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                )}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              {item.date && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.date}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
