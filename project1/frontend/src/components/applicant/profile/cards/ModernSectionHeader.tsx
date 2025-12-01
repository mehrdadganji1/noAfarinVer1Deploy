import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon, Filter, LayoutGrid, List } from 'lucide-react';

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
  showFilter?: boolean;
  onFilter?: () => void;
}

export function ModernSectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  onAdd,
  addLabel = 'افزودن',
  gradient = 'from-purple-500 to-indigo-500',
  showViewToggle = false,
  onViewChange,
  currentView = 'list',
  showFilter = false,
  onFilter
}: ModernSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      {/* Left side - Title and icon */}
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {count !== undefined && count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-3 py-1 text-xs font-bold bg-gradient-to-r ${gradient} text-white rounded-full shadow-sm`}
              >
                {count} مورد
              </motion.span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        {showViewToggle && onViewChange && (
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded-md transition-all ${
                currentView === 'list' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded-md transition-all ${
                currentView === 'grid' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter button */}
        {showFilter && onFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 ml-1" />
            فیلتر
          </Button>
        )}
        
        {/* Add button */}
        {onAdd && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onAdd}
              className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all`}
            >
              <Plus className="w-4 h-4 ml-2" />
              {addLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
