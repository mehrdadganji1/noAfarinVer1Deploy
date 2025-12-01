import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
  badge?: number;
}

interface QuickActionCardProps extends QuickAction {
  index: number;
}

function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  gradient,
  badge,
  index 
}: QuickActionCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(path)}
      className="group relative cursor-pointer"
    >
      {/* Card Container */}
      <div className="relative bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 overflow-hidden">
        {/* Gradient Background on Hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient
        )} />
        
        {/* White Overlay for Text Readability */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-95 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br shadow-md group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-500",
              gradient
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            {badge && badge > 0 && (
              <Badge 
                variant="destructive" 
                className="h-6 min-w-[24px] px-2 flex items-center justify-center text-xs font-bold shadow-lg"
              >
                {badge > 9 ? '9+' : badge}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 line-clamp-2 transition-colors">
              {description}
            </p>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

interface QuickActionsModernProps {
  actions: QuickAction[];
}

export function QuickActionsModern({ actions }: QuickActionsModernProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <QuickActionCard
          key={action.title}
          {...action}
          index={index}
        />
      ))}
    </div>
  );
}
