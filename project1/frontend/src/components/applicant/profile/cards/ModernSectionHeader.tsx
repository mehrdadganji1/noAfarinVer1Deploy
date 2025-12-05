import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon, LayoutGrid, List } from 'lucide-react';

interface ModernSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  gradient?: string;
  showViewToggle?: boolean;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
}

export function ModernSectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  onAdd,
  addLabel = 'افزودن',
  gradient = 'from-violet-500 to-purple-600',
  showViewToggle = false,
  onViewChange,
  currentView = 'grid',
}: ModernSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
    >
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {count !== undefined && count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full"
              >
                {count}
              </motion.span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* View Toggle */}
        {showViewToggle && onViewChange && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded-md transition-all ${
                currentView === 'grid' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded-md transition-all ${
                currentView === 'list' 
                  ? 'bg-white shadow-sm text-violet-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Add Button */}
        {onAdd && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onAdd}
              size="sm"
              className={`bg-gradient-to-l ${gradient} hover:opacity-90 text-white shadow-md`}
            >
              <Plus className="w-4 h-4 ml-1.5" />
              {addLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
