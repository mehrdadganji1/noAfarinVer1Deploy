import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon, Sparkles } from 'lucide-react';

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
  gradient = 'from-purple-500 to-indigo-500',
  variant = 'default'
}: ModernEmptyStateProps) {
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center mb-3`}>
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm mb-3">{title}</p>
        {onAction && actionLabel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 ml-1" />
            {actionLabel}
          </Button>
        )}
      </motion.div>
    );
  }

  if (variant === 'illustrated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8"
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-3xl`} />
          <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-3xl`} />
        </div>

        <div className="relative flex flex-col items-center text-center">
          {/* Animated icon */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative mb-6"
          >
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-amber-400" />
            </motion.div>
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">{description}</p>

          {onAction && actionLabel && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAction}
                size="lg"
                className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all px-8`}
              >
                <Plus className="w-5 h-5 ml-2" />
                {actionLabel}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* Icon container */}
        <motion.div
          whileHover={{ rotate: 10 }}
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center mb-5 border border-gray-100`}
        >
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm max-w-md mb-5 leading-relaxed">{description}</p>

        {onAction && actionLabel && (
          <Button
            onClick={onAction}
            className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all`}
          >
            <Plus className="w-4 h-4 ml-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
