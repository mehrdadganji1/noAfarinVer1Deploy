import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon } from 'lucide-react';

interface ModernEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: string;
  variant?: 'default' | 'minimal' | 'illustrated';
}

export function ModernEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = 'from-violet-500 to-purple-600',
  variant = 'illustrated'
}: ModernEmptyStateProps) {
  
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center mb-3`}>
          <Icon className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm mb-4">{title}</p>
        {onAction && actionLabel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
          >
            <Plus className="w-4 h-4 ml-1" />
            {actionLabel}
          </Button>
        )}
      </motion.div>
    );
  }

  // Illustrated variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-100 p-8 md:p-10"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full blur-3xl`} />
        <div className={`absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full blur-3xl`} />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* Animated icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6"
        >
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">{description}</p>

        {onAction && actionLabel && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={onAction}
              className={`bg-gradient-to-l ${gradient} hover:opacity-90 text-white shadow-lg px-6`}
            >
              <Plus className="w-4 h-4 ml-2" />
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
